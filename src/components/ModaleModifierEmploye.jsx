import { useState, useEffect } from 'react';
import { theme } from '../styles/theme';
import api from '../api/axiosConfig';

function ModaleModifierEmploye({ employe, departements, onClose, onSuccess }) {
  const [form, setForm] = useState({
    matricule: '', nom: '', prenom: '', email: '', role_id: 1, departement_id: '', nouveau_mot_de_passe: '',
  });
  const [message, setMessage] = useState('');

  const rolesMap = { Employe: 1, Chef: 2, RH: 3 };

  useEffect(() => {
    if (employe) {
      setForm({
        matricule: employe.matricule || '',
        nom: employe.nom || '',
        prenom: employe.prenom || '',
        email: employe.email || '',
        role_id: rolesMap[employe.role] || 1,
        departement_id: departements.find((d) => d.nom === employe.departement)?.id || '',
        nouveau_mot_de_passe: '',
      });
    }
  }, [employe, departements]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await api.put(`/rh/utilisateurs/${employe.id}`, form);
      onSuccess();
      onClose();
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.message || 'Erreur'));
    }
  };

  if (!employe) return null;

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    borderRadius: theme.radius,
    border: `1px solid ${theme.colors.border}`,
    fontSize: '14px',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    fontSize: '13px',
    color: theme.colors.text,
    fontWeight: 600,
    display: 'block',
    marginBottom: '6px',
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, overflowY: 'auto', padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: theme.colors.card, borderRadius: '14px', padding: '28px',
          width: '440px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: theme.colors.text, display: 'flex', alignItems: 'center', gap: '8px' }}>
            ✎ Modifier l'employé
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: theme.colors.textMuted }}
          >
            ✕
          </button>
        </div>
        <div style={{ height: '3px', borderRadius: '4px', background: theme.colors.gradient, margin: '14px 0 22px' }} />

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Matricule</label>
            <input
              style={inputStyle}
              value={form.matricule}
              onChange={(e) => setForm({ ...form, matricule: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Nom</label>
              <input
                style={inputStyle}
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Prénom</label>
              <input
                style={inputStyle}
                value={form.prenom}
                onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              style={inputStyle}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Rôle</label>
              <select
                style={inputStyle}
                value={form.role_id}
                onChange={(e) => setForm({ ...form, role_id: Number(e.target.value) })}
              >
                <option value={1}>Employé</option>
                <option value={2}>Chef</option>
                <option value={3}>RH</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Structure</label>
              <select
                style={inputStyle}
                value={form.departement_id}
                onChange={(e) => setForm({ ...form, departement_id: Number(e.target.value) })}
                required
              >
                <option value="">-- Sélectionner --</option>
                {departements.map((d) => (
                  <option key={d.id} value={d.id}>{d.nom}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Nouveau mot de passe (optionnel)</label>
            <input
              type="text"
              style={inputStyle}
              placeholder="Laisser vide pour ne pas changer"
              value={form.nouveau_mot_de_passe}
              onChange={(e) => setForm({ ...form, nouveau_mot_de_passe: e.target.value })}
            />
          </div>

          {message && <p style={{ color: theme.colors.danger, fontSize: '13px', marginBottom: '12px' }}>{message}</p>}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1, padding: '11px', borderRadius: theme.radius, border: 'none',
                background: '#e5e9ee', color: theme.colors.text, fontSize: '14px', fontWeight: 600, cursor: 'pointer',
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              style={{
                flex: 1, padding: '11px', borderRadius: theme.radius, border: 'none',
                background: theme.colors.accent, color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
              }}
            >
              💾 Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModaleModifierEmploye;