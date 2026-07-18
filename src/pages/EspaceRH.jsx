import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { theme } from '../styles/theme';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';

function EspaceRH() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [departements, setDepartements] = useState([]);
  const [message, setMessage] = useState('');

  const [form, setForm] = useState({
    matricule: '', nom: '', prenom: '', email: '', mot_de_passe: '',
    role_id: 1, departement_id: '', chef_id: ''
  });

  const chargerDonnees = async () => {
    try {
      const [statsRes, deptRes] = await Promise.all([
        api.get('/rh/statistiques'),
        api.get('/rh/departements'),
      ]);
      setStats(statsRes.data);
      setDepartements(deptRes.data.departements);
    } catch (error) {
      console.error('Erreur chargement:', error);
    }
  };

  useEffect(() => {
    chargerDonnees();
  }, []);

  const handleCreerUtilisateur = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await api.post('/rh/utilisateurs', form);
      setMessage('✅ Utilisateur créé');
      setForm({ matricule: '', nom: '', prenom: '', email: '', mot_de_passe: '', role_id: 1, departement_id: '', chef_id: '' });
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

  return (
    <Layout>
      <h1 style={{ fontSize: '22px', fontWeight: 600, margin: '0 0 24px', color: theme.colors.text }}>
        Bonjour, {user?.prenom}
      </h1>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          <StatCard label="Employés actifs" value={stats.totaux.total_employes} variant="neutral" />
          <StatCard label="RC disponibles" value={stats.totaux.rc_disponibles} variant="success" />
          <StatCard label="RC en attente" value={stats.totaux.rc_en_attente} variant="warning" />
          <StatCard label="RC expirés" value={stats.totaux.rc_expires} variant="danger" />
        </div>
      )}

      <div style={cardStyle}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 16px', color: theme.colors.text }}>
          Créer un utilisateur
        </h2>
        <form onSubmit={handleCreerUtilisateur} style={{ display: 'grid', gap: '12px', gridTemplateColumns: '1fr 1fr' }}>
          <input style={inputStyle} placeholder="Matricule (ex: TT0005)" value={form.matricule} onChange={(e) => setForm({ ...form, matricule: e.target.value })} />
          <input style={inputStyle} placeholder="Nom" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} required />
          <input style={inputStyle} placeholder="Prénom" value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} required />
          <input style={inputStyle} placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input style={inputStyle} placeholder="Mot de passe" type="password" value={form.mot_de_passe} onChange={(e) => setForm({ ...form, mot_de_passe: e.target.value })} required />
          <select style={inputStyle} value={form.role_id} onChange={(e) => setForm({ ...form, role_id: Number(e.target.value) })}>
            <option value={1}>Employé</option>
            <option value={2}>Chef</option>
            <option value={3}>RH</option>
          </select>
          <select style={inputStyle} value={form.departement_id} onChange={(e) => setForm({ ...form, departement_id: Number(e.target.value) })} required>
            <option value="">-- Structure --</option>
            {departements.map((d) => (
              <option key={d.id} value={d.id}>{d.nom}</option>
            ))}
          </select>
          <button
            type="submit"
            style={{
              gridColumn: 'span 2',
              padding: '10px',
              borderRadius: theme.radius,
              border: 'none',
              background: theme.colors.accent,
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Créer l'utilisateur
          </button>
        </form>
        {message && <p style={{ marginTop: '10px', fontSize: '14px' }}>{message}</p>}
      </div>
    </Layout>
  );
}

export default EspaceRH;