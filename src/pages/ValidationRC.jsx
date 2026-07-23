import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { theme } from '../styles/theme';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';

function ValidationRC() {
  const { user } = useAuth();
  const [liste, setListe] = useState([]);
  const [message, setMessage] = useState('');

  const chargerListe = async () => {
    try {
      const res = await api.get('/conges/en-attente');
      setListe(res.data.conges);
    } catch (error) {
      console.error('Erreur chargement:', error);
    }
  };

  useEffect(() => {
    chargerListe();
  }, []);

  const handleDecision = async (id, decision) => {
    setMessage('');
    try {
      const res = await api.put(`/conges/${id}/valider`, { decision });
      setMessage(`✅ ${res.data.message}`);
      chargerListe();
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.message || 'Erreur'));
    }
  };

  const cardStyle = {
    background: theme.colors.card,
    borderRadius: theme.radius,
    boxShadow: theme.shadow,
    padding: '20px 24px',
  };

  const btnStyle = (variant) => ({
    padding: '6px 14px',
    borderRadius: theme.radius,
    border: 'none',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    marginRight: '8px',
    background: variant === 'valider' ? theme.colors.success : theme.colors.danger,
    color: '#fff',
  });

  return (
    <Layout>
      <h1 style={{ fontSize: '22px', fontWeight: 600, margin: '0 0 8px', color: theme.colors.text }}>
        Bonjour, {user?.prenom}
      </h1>
      <p style={{ fontSize: '13px', color: theme.colors.textMuted, margin: '0 0 24px' }}>
        Demandes de congé RC de votre structure
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', maxWidth: '260px', marginBottom: '32px' }}>
        <StatCard label="Demandes en attente" value={liste.length} variant="warning" />
      </div>

      {message && <p style={{ marginBottom: '16px', fontSize: '14px' }}>{message}</p>}

      <div style={cardStyle}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 16px', color: theme.colors.text }}>
          Demandes à traiter
        </h2>

        {liste.length === 0 ? (
          <p style={{ color: theme.colors.textMuted, fontSize: '14px' }}>Aucune demande en attente.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: `1px solid ${theme.colors.border}` }}>
                <th style={{ padding: '8px 0', color: theme.colors.textMuted, fontWeight: 500 }}>Employé</th>
                <th style={{ padding: '8px 0', color: theme.colors.textMuted, fontWeight: 500 }}>Du</th>
                <th style={{ padding: '8px 0', color: theme.colors.textMuted, fontWeight: 500 }}>Au</th>
                <th style={{ padding: '8px 0', color: theme.colors.textMuted, fontWeight: 500 }}>Jours</th>
                <th style={{ padding: '8px 0', color: theme.colors.textMuted, fontWeight: 500 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {liste.map((c) => (
                <tr key={c.id} style={{ borderBottom: `1px solid ${theme.colors.border}` }}>
                  <td style={{ padding: '10px 0' }}>{c.prenom} {c.nom}</td>
                  <td style={{ padding: '10px 0' }}>{c.date_debut?.substring(0, 10)}</td>
                  <td style={{ padding: '10px 0' }}>{c.date_fin?.substring(0, 10)}</td>
                  <td style={{ padding: '10px 0', fontWeight: 600 }}>{c.nombre_jours}</td>
                  <td style={{ padding: '10px 0' }}>
                    <button style={btnStyle('valider')} onClick={() => handleDecision(c.id, 'valider')}>Valider</button>
                    <button style={btnStyle('refuser')} onClick={() => handleDecision(c.id, 'refuser')}>Refuser</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}

export default ValidationRC;