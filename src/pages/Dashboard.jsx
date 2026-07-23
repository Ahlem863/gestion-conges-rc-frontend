import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { theme } from '../styles/theme';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';

function Dashboard() {
  const { user } = useAuth();
  const [solde, setSolde] = useState(null);
  const [historique, setHistorique] = useState([]);
  const [conges, setConges] = useState([]);
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [message, setMessage] = useState('');

  const chargerDonnees = async () => {
    try {
      const soldeRes = await api.get('/rc/solde');
      setSolde(soldeRes.data);
      const histoRes = await api.get('/rc/historique');
      setHistorique(histoRes.data.historique);
      const congesRes = await api.get('/conges/mes-conges');
      setConges(congesRes.data.conges);
    } catch (error) {
      console.error('Erreur chargement:', error);
    }
  };

  useEffect(() => {
    chargerDonnees();
  }, []);

  const handleDemanderConge = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await api.post('/conges/demander', { date_debut: dateDebut, date_fin: dateFin });
      setMessage(`✅ Demande envoyée : ${res.data.nombre_jours} jour(s), en attente de validation`);
      setDateDebut('');
      setDateFin('');
      chargerDonnees();
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.message || 'Erreur'));
    }
  };

  const inputStyle = {
    padding: '10px 12px',
    borderRadius: theme.radius,
    border: `1px solid ${theme.colors.border}`,
    fontSize: '14px',
  };

  const cardStyle = {
    background: theme.colors.card,
    borderRadius: theme.radius,
    boxShadow: theme.shadow,
    padding: '20px 24px',
  };

  const statutBadge = (statut) => {
    const map = {
      'Disponible': { bg: theme.colors.successBg, text: theme.colors.success },
      'Validé Chef': { bg: theme.colors.accentBg, text: theme.colors.accent },
      'En attente': { bg: theme.colors.warningBg, text: theme.colors.warning },
      'Validée': { bg: theme.colors.successBg, text: theme.colors.success },
      'Expiré': { bg: theme.colors.dangerBg, text: theme.colors.danger },
      'Compensé': { bg: theme.colors.dangerBg, text: theme.colors.danger },
      'Utilisé': { bg: theme.colors.accentBg, text: theme.colors.accent },
      'Refusée': { bg: theme.colors.dangerBg, text: theme.colors.danger },
      'Refusé': { bg: theme.colors.dangerBg, text: theme.colors.danger },
    };
    const style = map[statut] || { bg: '#eee', text: '#555' };
    return (
      <span style={{
        fontSize: '12px', padding: '3px 8px', borderRadius: '20px',
        background: style.bg, color: style.text,
      }}>
        {statut}
      </span>
    );
  };

  return (
    <Layout>
      <h1 style={{ fontSize: '22px', fontWeight: 600, margin: '0 0 24px', color: theme.colors.text }}>
        Bonjour, {user?.prenom}
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', maxWidth: '260px', marginBottom: '32px' }}>
        <StatCard label="Solde RC disponible" value={solde?.solde ?? '...'} variant="success" />
      </div>

      <div style={{ ...cardStyle, marginBottom: '32px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 6px', color: theme.colors.text }}>
          Demander un congé RC
        </h2>
        <p style={{ fontSize: '13px', color: theme.colors.textMuted, margin: '0 0 16px' }}>
          Si la période inclut un vendredi, le samedi suivant est automatiquement compté.
        </p>
        <form onSubmit={handleDemanderConge} style={{ display: 'grid', gap: '12px', gridTemplateColumns: '1fr 1fr' }}>
          <div>
            <label style={{ fontSize: '13px', color: theme.colors.textMuted }}>Du</label>
            <input style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }} type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} required />
          </div>
          <div>
            <label style={{ fontSize: '13px', color: theme.colors.textMuted }}>Au</label>
            <input style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }} type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} required />
          </div>
          <button
            type="submit"
            style={{
              gridColumn: 'span 2', padding: '10px', borderRadius: theme.radius, border: 'none',
              background: theme.colors.accent, color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            Envoyer la demande
          </button>
        </form>
        {message && <p style={{ marginTop: '10px', fontSize: '14px' }}>{message}</p>}
      </div>

      <div style={{ ...cardStyle, marginBottom: '32px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 16px', color: theme.colors.text }}>
          Mes demandes de congé
        </h2>
        {conges.length === 0 ? (
          <p style={{ color: theme.colors.textMuted, fontSize: '14px' }}>Aucune demande.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: `1px solid ${theme.colors.border}` }}>
                <th style={{ padding: '8px 0', color: theme.colors.textMuted, fontWeight: 500 }}>Du</th>
                <th style={{ padding: '8px 0', color: theme.colors.textMuted, fontWeight: 500 }}>Au</th>
                <th style={{ padding: '8px 0', color: theme.colors.textMuted, fontWeight: 500 }}>Jours</th>
                <th style={{ padding: '8px 0', color: theme.colors.textMuted, fontWeight: 500 }}>Statut</th>
              </tr>
            </thead>
            <tbody>
              {conges.map((c) => (
                <tr key={c.id} style={{ borderBottom: `1px solid ${theme.colors.border}` }}>
                  <td style={{ padding: '10px 0' }}>{c.date_debut?.substring(0, 10)}</td>
                  <td style={{ padding: '10px 0' }}>{c.date_fin?.substring(0, 10)}</td>
                  <td style={{ padding: '10px 0' }}>{c.nombre_jours}</td>
                  <td style={{ padding: '10px 0' }}>{statutBadge(c.statut)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={cardStyle}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 16px', color: theme.colors.text }}>
          Historique des RC
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: `1px solid ${theme.colors.border}` }}>
              <th style={{ padding: '8px 0', color: theme.colors.textMuted, fontWeight: 500 }}>Date travaillée</th>
              <th style={{ padding: '8px 0', color: theme.colors.textMuted, fontWeight: 500 }}>Motif</th>
              <th style={{ padding: '8px 0', color: theme.colors.textMuted, fontWeight: 500 }}>Expiration</th>
              <th style={{ padding: '8px 0', color: theme.colors.textMuted, fontWeight: 500 }}>Statut</th>
            </tr>
          </thead>
          <tbody>
            {historique.map((rc) => (
              <tr key={rc.id} style={{ borderBottom: `1px solid ${theme.colors.border}` }}>
                <td style={{ padding: '10px 0' }}>{rc.date_travail?.substring(0, 10)}</td>
                <td style={{ padding: '10px 0', color: theme.colors.textMuted }}>{rc.motif}</td>
                <td style={{ padding: '10px 0' }}>{rc.date_expiration?.substring(0, 10)}</td>
                <td style={{ padding: '10px 0' }}>{statutBadge(rc.statut)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Dashboard;