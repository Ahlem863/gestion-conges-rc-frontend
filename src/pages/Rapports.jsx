import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import api from '../api/axiosConfig';
import { theme } from '../styles/theme';
import Layout from '../components/Layout';

const COULEURS_STATUT = {
  'Disponible': '#16a34a',
  'En attente': '#f59e0b',
  'Validé Chef': '#2b6cb0',
  'Expiré': '#e11d48',
  'Utilisé': '#7c3aed',
  'Compensé': '#94a3b8',
  'Refusé': '#dc2626',
};

function Rapports() {
  const [parStructure, setParStructure] = useState([]);
  const [parStatut, setParStatut] = useState([]);
  const [parMois, setParMois] = useState([]);

  const charger = async () => {
    try {
      const [statsRes, structRes] = await Promise.all([
        api.get('/rh/statistiques'),
        api.get('/rh/statistiques-structure?periode=mois'),
      ]);

      // Répartition par statut (pour le donut)
      const donutData = statsRes.data.par_statut.map((s) => ({
        name: s.statut,
        value: s.total,
      }));
      setParStatut(donutData);

      // Total par structure (pour les barres)
      const structureMap = {};
      structRes.data.donnees.forEach((d) => {
        structureMap[d.structure] = (structureMap[d.structure] || 0) + d.nombre_jours;
      });
      setParStructure(Object.entries(structureMap).map(([structure, total]) => ({ structure, total })));

      // Évolution par mois (pour la courbe), toutes structures confondues
      const moisMap = {};
      structRes.data.donnees.forEach((d) => {
        moisMap[d.periode] = (moisMap[d.periode] || 0) + d.nombre_jours;
      });
      const moisData = Object.entries(moisMap)
        .map(([mois, total]) => ({ mois, total }))
        .sort((a, b) => a.mois.localeCompare(b.mois));
      setParMois(moisData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    charger();
  }, []);

  const cardStyle = {
    background: theme.colors.card,
    borderRadius: theme.radius,
    boxShadow: theme.shadow,
    padding: '20px 24px',
  };

  const exporterExcel = () => {
    let csv = 'Structure;Total RC\n';
    parStructure.forEach((s) => { csv += `${s.structure};${s.total}\n`; });
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rapport_rc_par_structure.csv';
    a.click();
  };

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 600, margin: 0, color: theme.colors.text }}>
          📄 Rapports
        </h1>
        <button
          onClick={exporterExcel}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: theme.colors.accent, color: '#fff', border: 'none',
            borderRadius: theme.radius, padding: '10px 18px', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
          }}
        >
          ⬇ Exporter en Excel
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div style={cardStyle}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 16px', color: theme.colors.text }}>
            RC par structure
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={parStructure} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" fontSize={12} />
              <YAxis type="category" dataKey="structure" width={130} fontSize={11} />
              <Tooltip />
              <Bar dataKey="total" fill={theme.colors.accent} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={cardStyle}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 16px', color: theme.colors.text }}>
            Répartition par statut
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={parStatut} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                {parStatut.map((entry, i) => (
                  <Cell key={i} fill={COULEURS_STATUT[entry.name] || '#94a3b8'} />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={cardStyle}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 16px', color: theme.colors.text }}>
          Évolution mensuelle des RC déclarés
        </h2>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={parMois}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mois" fontSize={12} />
            <YAxis fontSize={12} allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke={theme.colors.accent} strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Layout>
  );
}

export default Rapports;