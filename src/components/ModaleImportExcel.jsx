import { useState } from 'react';
import { theme } from '../styles/theme';
import api from '../api/axiosConfig';

function ModaleImportExcel({ onClose, onSuccess }) {
  const [fichier, setFichier] = useState(null);
  const [enCours, setEnCours] = useState(false);
  const [resultat, setResultat] = useState(null);
  const [erreur, setErreur] = useState('');

  const handleImporter = async () => {
    if (!fichier) return;
    setEnCours(true);
    setErreur('');
    setResultat(null);

    const formData = new FormData();
    formData.append('fichier', fichier);

    try {
      const res = await api.post('/import/excel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResultat(res.data);
      onSuccess();
    } catch (error) {
      setErreur(error.response?.data?.message || 'Erreur lors de l\'import');
    } finally {
      setEnCours(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
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
            📁 Importer un fichier Excel
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: theme.colors.textMuted }}>
            ✕
          </button>
        </div>
        <div style={{ height: '3px', borderRadius: '4px', background: theme.colors.gradient, margin: '14px 0 18px' }} />

        <p style={{ fontSize: '13px', color: theme.colors.textMuted, marginBottom: '16px' }}>
          Colonnes attendues : Matricule (A), Nom complet (B), Structure (C), Solde RC (F).
          Les employés inconnus seront créés automatiquement.
        </p>

        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setFichier(e.target.files[0])}
          style={{
            width: '100%', padding: '10px', borderRadius: theme.radius,
            border: `1px solid ${theme.colors.border}`, fontSize: '13px', marginBottom: '16px', boxSizing: 'border-box',
          }}
        />

        {erreur && <p style={{ color: theme.colors.danger, fontSize: '13px', marginBottom: '12px' }}>❌ {erreur}</p>}

        {resultat && (
          <div style={{ background: theme.colors.successBg, borderRadius: theme.radius, padding: '12px', marginBottom: '16px' }}>
            <p style={{ color: theme.colors.success, fontSize: '13px', margin: 0, fontWeight: 600 }}>✅ {resultat.message}</p>
            {resultat.erreurs?.length > 0 && (
              <ul style={{ fontSize: '12px', color: theme.colors.danger, marginTop: '8px', paddingLeft: '18px' }}>
                {resultat.erreurs.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '11px', borderRadius: theme.radius, border: 'none',
              background: '#e5e9ee', color: theme.colors.text, fontSize: '14px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            Fermer
          </button>
          <button
            onClick={handleImporter}
            disabled={!fichier || enCours}
            style={{
              flex: 1, padding: '11px', borderRadius: theme.radius, border: 'none',
              background: !fichier || enCours ? '#c5cdd8' : theme.colors.accent,
              color: '#fff', fontSize: '14px', fontWeight: 600,
              cursor: !fichier || enCours ? 'not-allowed' : 'pointer',
            }}
          >
            {enCours ? 'Import en cours...' : '📤 Importer'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModaleImportExcel;