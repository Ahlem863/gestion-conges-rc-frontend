import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { theme } from '../styles/theme';
import Layout from '../components/Layout';

function DeclarerRC() {
  const [employes, setEmployes] = useState([]);
  const [form, setForm] = useState({ utilisateur_id: '', date_travail: '', motif: '', nombre_jours: 1 });
  const [message, setMessage] = useState('');

  const chargerEmployes = async () => {
    try {
      const res = await api.get('/rc/employes-structure');
      setEmployes(res.data.employes);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    chargerEmployes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await api.post('/rc/declarer-pour-employe', form);
      setMessage(`✅ ${res.data.message}`);
      setForm({ utilisateur_id: '', date_travail: '', motif: '', nombre_jours: 1 });
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.message || 'Erreur'));
    }
  };

  const inputStyle = {
    padding: '10px 12px',
    borderRadius: theme.radius,
    border: `1px solid ${theme.colors.border}`,
    fontSize: '14px',
    width: '100%',
    boxSizing: 'border-box',
  };

  const cardStyle = {
    background: theme.colors.card,
    borderRadius: theme.radius,
    boxShadow: theme.shadow,
    padding: '20px 24px',
  };

  return (
    <Layout>
      <h1 style={{ fontSize: '22px', fontWeight: 600, margin: '0 0 8px', color: theme.colors.text }}>
        Déclarer des RC
      </h1>
      <p style={{ fontSize: '13px', color: theme.colors.textMuted, margin: '0 0 24px' }}>
        L'employé sera notifié immédiatement. Le RH devra valider avant que les RC soient disponibles.
      </p>

      <div style={cardStyle}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px', maxWidth: '480px' }}>
          <div>
            <label style={{ fontSize: '13px', color: theme.colors.textMuted, display: 'block', marginBottom: '6px' }}>Employé</label>
            <select
              style={inputStyle}
              value={form.utilisateur_id}
              onChange={(e) => setForm({ ...form, utilisateur_id: Number(e.target.value) })}
              required
            >
              <option value="">-- Sélectionner --</option>
              {employes.map((e) => (
                <option key={e.id} value={e.id}>{e.matricule} - {e.prenom} {e.nom}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '13px', color: theme.colors.textMuted, display: 'block', marginBottom: '6px' }}>Date travaillée</label>
            <input
              style={inputStyle}
              type="date"
              value={form.date_travail}
              onChange={(e) => setForm({ ...form, date_travail: e.target.value })}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', color: theme.colors.textMuted, display: 'block', marginBottom: '6px' }}>Nombre de jours RC</label>
            <input
              style={inputStyle}
              type="number"
              min="1"
              value={form.nombre_jours}
              onChange={(e) => setForm({ ...form, nombre_jours: Number(e.target.value) })}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', color: theme.colors.textMuted, display: 'block', marginBottom: '6px' }}>Motif</label>
            <input
              style={inputStyle}
              type="text"
              placeholder="Ex: Travail jour férié - Aïd"
              value={form.motif}
              onChange={(e) => setForm({ ...form, motif: e.target.value })}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: '11px', borderRadius: theme.radius, border: 'none',
              background: theme.colors.accent, color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            Déclarer
          </button>
        </form>
        {message && <p style={{ marginTop: '14px', fontSize: '14px' }}>{message}</p>}
      </div>
    </Layout>
  );
}

export default DeclarerRC;