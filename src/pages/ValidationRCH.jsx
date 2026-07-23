import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { theme } from '../styles/theme';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';

function ValidationRCH() {
  const [liste, setListe] = useState([]);
  const [message, setMessage] = useState('');
  const [edition, setEdition] = useState(null);
  const [formEdit, setFormEdit] = useState({ date_travail: '', motif: '' });

  const chargerListe = async () => {
    try {
      const res = await api.get('/rc/en-attente');
      setListe(res.data.rc_en_attente);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    chargerListe();
  }, []);

  const handleDecision = async (id, decision) => {
    setMessage('');
    try {
      const res = await api.put(`/rc/${id}/valider`, { decision });
      setMessage(`✅ ${res.data.message}`);
      chargerListe();
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.message || 'Erreur'));
    }
  };

  const ouvrirEdition = (rc) => {
    setEdition(rc.id);
    setFormEdit({ date_travail: rc.date_travail?.substring(0, 10), motif: rc.motif || '' });
  };

  const enregistrerModification = async (id) => {
    try {
      await api.put(`/rc/${id}/modifier`, formEdit);
      setMessage('✅ RC modifié');
      setEdition(null);
      chargerListe();
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.message || 'Erreur'));
    }
  };

  const supprimer = async (id) => {
    if (!window.confirm('Supprimer ce RC déclaré par erreur ?')) return;
    try {
      await api.delete(`/rc/${id}`);
      chargerListe();
    } catch (error) {
      alert('❌ ' + (error.response?.data?.message || 'Erreur'));
    }
  };

  const cardStyle = { background: theme.colors.card, borderRadius: theme.radius, boxShadow: theme.shadow, padding: '20px 24px' };
  const inputStyle = { padding: '6px 10px', borderRadius: theme.radius, border: `1px solid ${theme.colors.border}`, fontSize: '13px' };
  const btnStyle = (bg) => ({ padding: '6px 12px', borderRadius: theme.radius, border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer', marginRight: '6px', background: bg, color: '#fff' });

  return (
    <Layout>
      <h1 style={{ fontSize: '22px', fontWeight: 600, margin: '0 0 8px', color: theme.colors.text }}>RC à valider</h1>
      <p style={{ fontSize: '13px', color: theme.colors.textMuted, margin: '0 0 24px' }}>
        Déclarations des chefs, en attente de votre validation finale
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', maxWidth: '260px', marginBottom: '32px' }}>
        <StatCard label="En attente de validation" value={liste.length} variant="warning" />
      </div>

      {message && <p style={{ marginBottom: '16px', fontSize: '14px' }}>{message}</p>}

      <div style={cardStyle}>
        {liste.length === 0 ? (
          <p style={{ color: theme.colors.textMuted, fontSize: '14px' }}>Aucun RC en attente.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: `1px solid ${theme.colors.border}` }}>
                <th style={{ padding: '8px 0', color: theme.colors.textMuted, fontWeight: 500 }}>Employé</th>
                <th style={{ padding: '8px 0', color: theme.colors.textMuted, fontWeight: 500 }}>Structure</th>
                <th style={{ padding: '8px 0', color: theme.colors.textMuted, fontWeight: 500 }}>Date</th>
                <th style={{ padding: '8px 0', color: theme.colors.textMuted, fontWeight: 500 }}>Motif</th>
                <th style={{ padding: '8px 0', color: theme.colors.textMuted, fontWeight: 500 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {liste.map((rc) => (
                <tr key={rc.id} style={{ borderBottom: `1px solid ${theme.colors.border}` }}>
                  <td style={{ padding: '10px 0' }}>{rc.prenom} {rc.nom}</td>
                  <td style={{ padding: '10px 0', color: theme.colors.accent }}>{rc.departement}</td>
                  <td style={{ padding: '10px 0' }}>
                    {edition === rc.id ? (
                      <input style={inputStyle} type="date" value={formEdit.date_travail} onChange={(e) => setFormEdit({ ...formEdit, date_travail: e.target.value })} />
                    ) : rc.date_travail?.substring(0, 10)}
                  </td>
                  <td style={{ padding: '10px 0' }}>
                    {edition === rc.id ? (
                      <input style={inputStyle} type="text" value={formEdit.motif} onChange={(e) => setFormEdit({ ...formEdit, motif: e.target.value })} />
                    ) : rc.motif}
                  </td>
                  <td style={{ padding: '10px 0' }}>
                    {edition === rc.id ? (
                      <>
                        <button style={btnStyle(theme.colors.accent)} onClick={() => enregistrerModification(rc.id)}>Enregistrer</button>
                        <button style={btnStyle('#94a3b8')} onClick={() => setEdition(null)}>Annuler</button>
                      </>
                    ) : (
                      <>
                        <button style={btnStyle(theme.colors.success)} onClick={() => handleDecision(rc.id, 'valider')}>Valider</button>
                        <button style={btnStyle(theme.colors.danger)} onClick={() => handleDecision(rc.id, 'refuser')}>Refuser</button>
                        <button style={btnStyle('#f5a623')} onClick={() => ouvrirEdition(rc)}>Modifier</button>
                        <button style={btnStyle('#94a3b8')} onClick={() => supprimer(rc.id)}>Suppr.</button>
                      </>
                    )}
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

export default ValidationRCH;