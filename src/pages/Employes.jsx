import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { theme } from '../styles/theme';
import Layout from '../components/Layout';
import ModaleModifierEmploye from '../components/ModaleModifierEmploye';
import ModaleImportExcel from '../components/ModaleImportExcel';
import { useAuth } from '../context/AuthContext';

function Employes() {
  const { user } = useAuth();
  const estRH = user?.role_id === 3;
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [recherche, setRecherche] = useState('');
  const [employeSelectionne, setEmployeSelectionne] = useState(null);
  const [modaleImportOuverte, setModaleImportOuverte] = useState(false);

  const chargerDonnees = async () => {
    try {
      const [usersRes, deptRes, soldesRes] = await Promise.all([
        api.get('/rh/utilisateurs'),
        api.get('/rh/departements'),
        api.get('/rh/rc-par-employe'),
      ]);

      const soldesParId = {};
      soldesRes.data.employes.forEach((e) => {
        soldesParId[e.id] = e.solde_rc;
      });

      const utilisateursAvecSolde = usersRes.data.utilisateurs.map((u) => ({
        ...u,
        solde_rc: soldesParId[u.id] ?? 0,
      }));

      setUtilisateurs(utilisateursAvecSolde);
      setDepartements(deptRes.data.departements);
    } catch (error) {
      console.error('Erreur chargement:', error);
    }
  };

  useEffect(() => {
    chargerDonnees();
  }, []);

  const handleToggleActif = async (id) => {
    try {
      await api.put(`/rh/utilisateurs/${id}/toggle`);
      chargerDonnees();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSupprimer = async (id, nomComplet) => {
    const confirmation = window.confirm(
      `Voulez-vous vraiment supprimer définitivement ${nomComplet} ? Cette action est irréversible et effacera aussi son historique RC.`
    );
    if (!confirmation) return;

    try {
      await api.delete(`/rh/utilisateurs/${id}`);
      chargerDonnees();
    } catch (error) {
      alert('❌ ' + (error.response?.data?.message || 'Erreur lors de la suppression'));
    }
  };

  const filtres = utilisateurs.filter((u) =>
    `${u.prenom} ${u.nom} ${u.matricule}`.toLowerCase().includes(recherche.toLowerCase())
  );

  const cardStyle = {
    background: theme.colors.card,
    borderRadius: theme.radius,
    boxShadow: theme.shadow,
    overflow: 'hidden',
  };

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 600, margin: 0, color: theme.colors.text, display: 'flex', alignItems: 'center', gap: '8px' }}>
          👥 Gestion des Employés
        </h1>
        <input
          type="text"
          placeholder="Rechercher..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          style={{
            padding: '10px 14px',
            borderRadius: theme.radius,
            border: `1px solid ${theme.colors.border}`,
            fontSize: '14px',
            width: '260px',
          }}
        />
      </div>

      {estRH && (
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <button
            onClick={() => (window.location.href = '/rh')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: theme.colors.accent, color: '#fff', border: 'none',
              borderRadius: theme.radius, padding: '10px 18px', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            ＋ Ajouter un employé
          </button>
          <button
            onClick={() => setModaleImportOuverte(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: '#fff', color: theme.colors.text, border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radius, padding: '10px 18px', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            📁 Importer Excel
          </button>
        </div>
      )}

      <div style={cardStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ textAlign: 'left', background: theme.colors.bg }}>
              <th style={{ padding: '14px 20px', color: theme.colors.textMuted, fontWeight: 600, fontSize: '12px', letterSpacing: '0.5px' }}>MATRICULE</th>
              <th style={{ padding: '14px 20px', color: theme.colors.textMuted, fontWeight: 600, fontSize: '12px', letterSpacing: '0.5px' }}>NOM COMPLET</th>
              <th style={{ padding: '14px 20px', color: theme.colors.textMuted, fontWeight: 600, fontSize: '12px', letterSpacing: '0.5px' }}>DÉPARTEMENT</th>
              <th style={{ padding: '14px 20px', color: theme.colors.textMuted, fontWeight: 600, fontSize: '12px', letterSpacing: '0.5px' }}>RC VALIDES</th>
              <th style={{ padding: '14px 20px', color: theme.colors.textMuted, fontWeight: 600, fontSize: '12px', letterSpacing: '0.5px' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtres.map((u, i) => (
              <tr key={u.id} style={{ borderTop: `1px solid ${theme.colors.border}`, background: i % 2 === 0 ? '#fff' : theme.colors.bg }}>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ color: theme.colors.accent, fontWeight: 600 }}>{u.matricule}</span>
                </td>
                <td style={{ padding: '14px 20px', fontWeight: 600, color: theme.colors.text }}>{u.prenom} {u.nom}</td>
                <td style={{ padding: '14px 20px', color: theme.colors.accent }}>{u.departement}</td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    background: u.solde_rc > 0 ? theme.colors.successBg : theme.colors.bg,
                    border: `1px solid ${u.solde_rc > 0 ? theme.colors.success : theme.colors.border}`,
                    borderRadius: '20px', padding: '4px 12px', fontSize: '13px', fontWeight: 600,
                    color: u.solde_rc > 0 ? theme.colors.success : theme.colors.text,
                  }}>
                    🎯 {u.solde_rc} RC
                  </span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setEmployeSelectionne(u)}
                      title="Modifier"
                      style={{
                        width: '32px', height: '32px', borderRadius: '8px', border: 'none',
                        background: '#f5a623', color: '#fff', cursor: 'pointer', fontSize: '14px',
                      }}
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => handleSupprimer(u.id, `${u.prenom} ${u.nom}`)}
                      title="Supprimer définitivement"
                      style={{
                        width: '32px', height: '32px', borderRadius: '8px', border: 'none',
                        background: '#e0393e', color: '#fff', cursor: 'pointer', fontSize: '14px',
                      }}
                    >
                      🗑
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModaleModifierEmploye
        employe={employeSelectionne}
        departements={departements}
        onClose={() => setEmployeSelectionne(null)}
        onSuccess={chargerDonnees}
      />

      {modaleImportOuverte && (
        <ModaleImportExcel
          onClose={() => setModaleImportOuverte(false)}
          onSuccess={chargerDonnees}
        />
      )}
    </Layout>
  );
}

export default Employes;