import { useEffect, useState } from 'react';
import { theme } from '../styles/theme';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import api from '../api/axiosConfig';

function Layout({ children }) {
  const { user, logout } = useAuth();

  const menuParRole = {
    1: [
      { label: 'Mon espace', path: '/dashboard', icon: '🏠' },
    ],
    2: [
      { label: 'Déclarer RC', path: '/declarer', icon: '📝' },
      { label: 'Valider congés', path: '/validation', icon: '✅' },
      { label: 'Employés', path: '/rh/employes', icon: '👥' },
      { label: 'Récupération', path: '/rh/recuperation', icon: '🎯' },
    ],
    3: [
      { label: 'Tableau de bord', path: '/rh', icon: '🏠' },
      { label: 'Employés', path: '/rh/employes', icon: '👥' },
      { label: 'RC à valider', path: '/rh/validation-rc', icon: '✅' },
      { label: 'Congés (info)', path: '/rh/conges-info', icon: '📋' },
      { label: 'Récupération', path: '/rh/recuperation', icon: '🎯' },
      { label: 'Statistiques', path: '/rh/statistiques', icon: '📊' },
      { label: 'Rapports', path: '/rh/rapports', icon: '📄' },
    ],
  };

  const menu = menuParRole[user?.role_id] || [];

  const [heure, setHeure] = useState(new Date());
  const [nbEnAttente, setNbEnAttente] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setHeure(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (user?.role_id === 2 || user?.role_id === 3) {
      const chargerCompteur = async () => {
        try {
          const res = await api.get('/rc/en-attente');
          setNbEnAttente(res.data.rc_en_attente.length);
        } catch (error) {
          console.error(error);
        }
      };
      chargerCompteur();
      const interval = setInterval(chargerCompteur, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const cheminActuel = window.location.pathname;

  const allerVers = (path) => {
    window.location.href = path;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', background: theme.colors.bg }}>
      <div style={{ width: '230px', background: theme.colors.sidebar, color: theme.colors.sidebarText, padding: '24px 16px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
            <Logo size={44} />
          </div>
          <p style={{ color: '#fff', fontWeight: 700, fontSize: '15px', margin: 0, letterSpacing: '0.5px' }}>TUNISIE TÉLÉCOM</p>
          <p style={{ fontSize: '11px', margin: '2px 0 0', opacity: 0.6 }}>Gestion des congés</p>
        </div>

        <div style={{ height: '3px', borderRadius: '4px', background: theme.colors.gradient, marginBottom: '24px' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {menu.map((item, i) => {
            const actif = cheminActuel === item.path;
            return (
              <div
                key={i}
                onClick={() => allerVers(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: theme.radius,
                  color: actif ? '#fff' : theme.colors.sidebarText,
                  background: actif ? theme.colors.sidebarActive : 'transparent',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: actif ? 600 : 400,
                }}
              >
                <span>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.path === '/validation' && nbEnAttente > 0 && (
                  <span style={{
                    background: theme.colors.danger,
                    color: '#fff',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 7px',
                    minWidth: '18px',
                    textAlign: 'center',
                  }}>
                    {nbEnAttente}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 'auto' }}>
          <div
            onClick={() => allerVers('/parametres')}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
              borderRadius: theme.radius, color: theme.colors.sidebarText, cursor: 'pointer', fontSize: '14px',
            }}
          >
            <span>⚙️</span> Paramètres
          </div>

          <div style={{ textAlign: 'center', margin: '16px 0', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ color: '#fff', fontSize: '18px', fontWeight: 600, margin: 0 }}>
              {heure.toLocaleTimeString('fr-FR')}
            </p>
            <p style={{ fontSize: '12px', opacity: 0.6, margin: '2px 0 0' }}>
              {heure.toLocaleDateString('fr-FR')}
            </p>
          </div>

          <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ fontSize: '13px', color: '#fff', margin: '0 0 6px' }}>{user?.prenom} {user?.nom}</p>
            <button
              onClick={logout}
              style={{
                background: 'rgba(255,255,255,0.08)', border: 'none', color: theme.colors.sidebarText,
                fontSize: '12px', cursor: 'pointer', padding: '6px 10px', borderRadius: theme.radius, width: '100%',
              }}
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '32px' }}>
        {children}
      </div>
    </div>
  );
}

export default Layout;