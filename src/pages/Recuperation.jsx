import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { theme } from '../styles/theme';
import Layout from '../components/Layout';

function Recuperation() {
  const [employes, setEmployes] = useState([]);
  const [detailsId, setDetailsId] = useState(null);
  const [historique, setHistorique] = useState([]);

  const charger = async () => {
    try {
      const res = await api.get('/rh/rc-par-employe');
      setEmployes(res.data.employes);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    charger();
  }, []);

  const voirDetails = async (id) => {
    if (detailsId === id) {
      setDetailsId(null);
      return;
    }
    try {
      const res = await api.get(`/rc/historique/${id}`);
      setHistorique(res.data.historique);
      setDetailsId(id);
    } catch (error) {
      console.error(error);
    }
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
      'En attente': { bg: theme.colors.warningBg, text: theme.colors.warning },
      'Expiré': { bg: theme.colors.dangerBg, text: theme.colors.danger },
      'Compensé': { bg: theme.colors.dangerBg, text: theme.colors.danger },
      'Utilisé': { bg: theme.colors.accentBg, text: theme.colors.accent },
    };
    const style = map[statut] || { bg: '#eee', text: '#555' };
    return (
      <span style={{ fontSize: '12px', padding: '3px 8px', borderRadius: '20px', background: style.bg, color: style.text }}>
        {statut}
      </span>
    );
  };

  return (
    <Layout>
      <h1 style={{ fontSize: '22px', fontWeight: 600, margin: '0 0 24px', color: theme.colors.text }}>
        Récupérations (RC) &amp; Soldes
      </h1>

      <div style={cardStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: `1px solid ${theme.colors.border}` }}>
              <th style={{ padding: '10px 0', color: theme.colors.textMuted, fontWeight: 500 }}>Employé</th>
              <th style={{ padding: '10px 0', color: theme.colors.textMuted, fontWeight: 500 }}>Matricule</th>
              <th style={{ padding: '10px 0', color: theme.colors.textMuted, fontWeight: 500 }}>Structure</th>
              <th style={{ padding: '10px 0', color: theme.colors.textMuted, fontWeight: 500 }}>Solde RC</th>
              <th style={{ padding: '10px 0', color: theme.colors.textMuted, fontWeight: 500 }}>Détails</th>
            </tr>
          </thead>
          <tbody>
            {employes.map((emp) => (
              <>
                <tr key={emp.id} style={{ borderBottom: `1px solid ${theme.colors.border}` }}>
                  <td style={{ padding: '12px 0', fontWeight: 500 }}>{emp.prenom} {emp.nom}</td>
                  <td style={{ padding: '12px 0', color: theme.colors.accent }}>{emp.matricule}</td>
                  <td style={{ padding: '12px 0' }}>{emp.departement}</td>
                  <td style={{ padding: '12px 0' }}>
                    <span style={{
                      fontSize: '13px', padding: '4px 10px', borderRadius: '20px',
                      background: emp.solde_rc > 0 ? theme.colors.successBg : '#f0f0f0',
                      color: emp.solde_rc > 0 ? theme.colors.success : theme.colors.textMuted,
                      fontWeight: 600,
                    }}>
                      {emp.solde_rc} RC valide{emp.solde_rc > 1 ? 's' : ''}
                    </span>
                  </td>
                  <td style={{ padding: '12px 0' }}>
                    <button
                      onClick={() => voirDetails(emp.id)}
                      style={{
                        background: theme.colors.accent, color: '#fff', border: 'none',
                        borderRadius: theme.radius, padding: '6px 14px', fontSize: '13px', cursor: 'pointer',
                      }}
                    >
                      {detailsId === emp.id ? 'Masquer' : 'Détails'}
                    </button>
                  </td>
                </tr>

                {detailsId === emp.id && (
                  <tr key={`${emp.id}-details`}>
                    <td colSpan={5} style={{ padding: '0 0 16px', background: theme.colors.bg }}>
                      <div style={{ padding: '16px', borderRadius: theme.radius }}>
                        {historique.length === 0 ? (
                          <p style={{ color: theme.colors.textMuted, fontSize: '13px', margin: 0 }}>
                            Aucun historique RC pour cet employé.
                          </p>
                        ) : (
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                            <thead>
                              <tr style={{ textAlign: 'left' }}>
                                <th style={{ padding: '6px 0', color: theme.colors.textMuted, fontWeight: 500 }}>Date travaillée</th>
                                <th style={{ padding: '6px 0', color: theme.colors.textMuted, fontWeight: 500 }}>Motif</th>
                                <th style={{ padding: '6px 0', color: theme.colors.textMuted, fontWeight: 500 }}>Acquisition</th>
                                <th style={{ padding: '6px 0', color: theme.colors.textMuted, fontWeight: 500 }}>Expiration</th>
                                <th style={{ padding: '6px 0', color: theme.colors.textMuted, fontWeight: 500 }}>Statut</th>
                              </tr>
                            </thead>
                            <tbody>
                              {historique.map((rc) => (
                                <tr key={rc.id}>
                                  <td style={{ padding: '6px 0' }}>{rc.date_travail?.substring(0, 10)}</td>
                                  <td style={{ padding: '6px 0', color: theme.colors.textMuted }}>{rc.motif}</td>
                                  <td style={{ padding: '6px 0' }}>{rc.date_acquisition?.substring(0, 10)}</td>
                                  <td style={{ padding: '6px 0' }}>{rc.date_expiration?.substring(0, 10)}</td>
                                  <td style={{ padding: '6px 0' }}>{statutBadge(rc.statut)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Recuperation;