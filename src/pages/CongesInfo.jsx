import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { theme } from '../styles/theme';
import Layout from '../components/Layout';

function CongesInfo() {
  const [conges, setConges] = useState([]);

  useEffect(() => {
    api.get('/conges/toutes').then((res) => setConges(res.data.conges)).catch(console.error);
  }, []);

  const statutBadge = (statut) => {
    const map = {
      'Validée': { bg: theme.colors.successBg, text: theme.colors.success },
      'En attente': { bg: theme.colors.warningBg, text: theme.colors.warning },
      'Refusée': { bg: theme.colors.dangerBg, text: theme.colors.danger },
    };
    const style = map[statut] || { bg: '#eee', text: '#555' };
    return <span style={{ fontSize: '12px', padding: '3px 8px', borderRadius: '20px', background: style.bg, color: style.text }}>{statut}</span>;
  };

  const cardStyle = { background: theme.colors.card, borderRadius: theme.radius, boxShadow: theme.shadow, padding: '20px 24px' };

  return (
    <Layout>
      <h1 style={{ fontSize: '22px', fontWeight: 600, margin: '0 0 8px', color: theme.colors.text }}>Congés RC</h1>
      <p style={{ fontSize: '13px', color: theme.colors.textMuted, margin: '0 0 24px' }}>
        Vue d'ensemble — validation gérée par les chefs de structure
      </p>

      <div style={cardStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: `1px solid ${theme.colors.border}` }}>
              <th style={{ padding: '8px 0', color: theme.colors.textMuted, fontWeight: 500 }}>Employé</th>
              <th style={{ padding: '8px 0', color: theme.colors.textMuted, fontWeight: 500 }}>Structure</th>
              <th style={{ padding: '8px 0', color: theme.colors.textMuted, fontWeight: 500 }}>Du</th>
              <th style={{ padding: '8px 0', color: theme.colors.textMuted, fontWeight: 500 }}>Au</th>
              <th style={{ padding: '8px 0', color: theme.colors.textMuted, fontWeight: 500 }}>Jours</th>
              <th style={{ padding: '8px 0', color: theme.colors.textMuted, fontWeight: 500 }}>Statut</th>
            </tr>
          </thead>
          <tbody>
            {conges.map((c) => (
              <tr key={c.id} style={{ borderBottom: `1px solid ${theme.colors.border}` }}>
                <td style={{ padding: '10px 0' }}>{c.prenom} {c.nom}</td>
                <td style={{ padding: '10px 0', color: theme.colors.accent }}>{c.structure}</td>
                <td style={{ padding: '10px 0' }}>{c.date_debut?.substring(0, 10)}</td>
                <td style={{ padding: '10px 0' }}>{c.date_fin?.substring(0, 10)}</td>
                <td style={{ padding: '10px 0', fontWeight: 600 }}>{c.nombre_jours}</td>
                <td style={{ padding: '10px 0' }}>{statutBadge(c.statut)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default CongesInfo;