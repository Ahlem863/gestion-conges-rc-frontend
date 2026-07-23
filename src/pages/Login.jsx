import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { theme } from '../styles/theme';
import Logo from '../components/Logo';

function Login() {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');

    try {
      const response = await api.post('/auth/login', {
        email,
        mot_de_passe: motDePasse,
      });

      login(response.data.user, response.data.token);

      const role = response.data.user.role_id;
if (role === 1) {
  navigate('/dashboard');
} else if (role === 2) {
  navigate('/declarer');
} else if (role === 3) {
  navigate('/rh');
}
    } catch (error) {
      setErreur(error.response?.data?.message || 'Erreur de connexion');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    borderRadius: theme.radius,
    border: `1px solid ${theme.colors.border}`,
    fontSize: '14px',
    boxSizing: 'border-box',
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: theme.colors.sidebar,
      fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{
        background: theme.colors.card,
        borderRadius: '16px',
        padding: '40px',
        width: '360px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.25)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <Logo size={56} />
        </div>
        <p style={{ textAlign: 'center', fontWeight: 700, fontSize: '16px', margin: '4px 0 0', color: theme.colors.text, letterSpacing: '0.5px' }}>
          TUNISIE TÉLÉCOM
        </p>
        <p style={{ textAlign: 'center', fontSize: '12px', color: theme.colors.textMuted, margin: '2px 0 24px' }}>
          Gestion des congés RC
        </p>

        <div style={{ height: '3px', borderRadius: '4px', background: theme.colors.gradient, marginBottom: '28px' }} />

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', color: theme.colors.textMuted, display: 'block', marginBottom: '6px' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', color: theme.colors.textMuted, display: 'block', marginBottom: '6px' }}>Mot de passe</label>
            <input
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          {erreur && <p style={{ color: theme.colors.danger, fontSize: '13px', marginBottom: '16px' }}>{erreur}</p>}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: theme.radius,
              border: 'none',
              background: theme.colors.accent,
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Se connecter
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '11px', color: theme.colors.textMuted, marginTop: '24px', marginBottom: 0 }}>
          La vie est émotions
        </p>
      </div>
    </div>
  );
}

export default Login;