import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { theme } from '../styles/theme';
import Layout from '../components/Layout';

function Statistiques() {
  const [periode, setPeriode] = useState('mois');
  const [donnees, setDonnees] = useState([]);

  const charger = async (p) => {
    try {
      const res = await api.get(`/rh/statistiques-structure?periode=${p}`);
      setDonnees(res.data.donnees);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    charger(periode);
  }, [periode]);

  // Regrouper les données par structure pour un affichage en tableau croisé
  const structures = [...new Set(donnees.map((d) => d.structure))];
  const periodes = [...new Set(donnees.map((d) => d.periode))].sort().reverse();

  const getValeur = (structure, per) => {
    const ligne = donnees.find((d) => d.structure === structure && d.periode === per);
    return ligne ? ligne.nombre_jours : 0;
  };

  const cardStyle = {
    background: theme.colors.card,
    borderRadius: theme.radius,
    boxShadow: theme.shadow,
    padding: '20px 24px',
  };

  const btnPeriode = (val, label) => (
    <button
      onClick={() => setPeriode(val)}
      style={{
        padding: '8px 18px',
        borderRadius: theme.radius,
        border: 'none',
        fontSize: '13px',
        fontWeight: 600,
        cursor: 'pointer',
        background: periode === val ? theme.colors.accent : '#fff',
        color: periode === val ? '#fff' : theme.colors.text,
        boxShadow: theme.shadow,
      }}
    >
      {label}
    </button>
  );

  return (
    <Layout>
      <h1 style={{ fontSize: '22px', fontWeight: 600, margin: '0 0 8px', color: theme.colors.text }}>
        📊 Statistiques des RC
      </h1>
      <p style={{ fontSize: '13px', color: theme.colors.textMuted, margin: '0 0 24px' }}>
        Nombre de jours RC déclarés par structure
      </p>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        {btnPeriode('mois', 'Par mois')}
        {btnPeriode('trimestre', 'Par trimestre')}
        {btnPeriode('annee', 'Par année')}
      </div>

      <div style={cardStyle}>
        {structures.length === 0 ? (
          <p style={{ color: theme.colors.textMuted, fontSize: '14px' }}>Aucune donnée disponible pour l'instant.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: `1px solid ${theme.colors.border}` }}>
                  <th style={{ padding: '10px 12px', color: theme.colors.textMuted, fontWeight: 600, position: 'sticky', left: 0, background: theme.colors.card }}>
                    Structure
                  </th>
                  {periodes.map((p) => (
                    <th key={p} style={{ padding: '10px 12px', color: theme.colors.textMuted, fontWeight: 600, textAlign: 'center' }}>
                      {p}
                    </th>
                  ))}
                  <th style={{ padding: '10px 12px', color: theme.colors.text, fontWeight: 700, textAlign: 'center' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {structures.map((s, i) => {
                  const total = periodes.reduce((sum, p) => sum + getValeur(s, p), 0);
                  return (
                    <tr key={s} style={{ borderBottom: `1px solid ${theme.colors.border}`, background: i % 2 === 0 ? '#fff' : theme.colors.bg }}>
                      <td style={{ padding: '10px 12px', fontWeight: 600, position: 'sticky', left: 0, background: i % 2 === 0 ? '#fff' : theme.colors.bg }}>
                        {s}
                      </td>
                      {periodes.map((p) => {
                        const val = getValeur(s, p);
                        return (
                          <td key={p} style={{ padding: '10px 12px', textAlign: 'center' }}>
                            {val > 0 ? (
                              <span style={{
                                background: theme.colors.accentBg, color: theme.colors.accent,
                                borderRadius: '20px', padding: '3px 10px', fontWeight: 600,
                              }}>
                                {val}
                              </span>
                            ) : (
                              <span style={{ color: theme.colors.textMuted }}>—</span>
                            )}
                          </td>
                        );
                      })}
                      <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 700, color: theme.colors.text }}>
                        {total}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Statistiques;