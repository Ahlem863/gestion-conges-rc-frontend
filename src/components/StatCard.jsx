import { theme } from '../styles/theme';

function StatCard({ label, value, variant = 'neutral' }) {
  const variants = {
    neutral: { bg: theme.colors.card, text: theme.colors.text },
    success: { bg: theme.colors.successBg, text: theme.colors.success },
    warning: { bg: theme.colors.warningBg, text: theme.colors.warning },
    danger: { bg: theme.colors.dangerBg, text: theme.colors.danger },
    accent: { bg: theme.colors.accentBg, text: theme.colors.accent },
  };
  const style = variants[variant];

  return (
    <div style={{ background: style.bg, borderRadius: theme.radius, padding: '16px 18px', boxShadow: theme.shadow }}>
      <p style={{ fontSize: '13px', color: variant === 'neutral' ? theme.colors.textMuted : style.text, margin: '0 0 6px' }}>{label}</p>
      <p style={{ fontSize: '26px', fontWeight: 600, color: style.text, margin: 0 }}>{value}</p>
    </div>
  );
}

export default StatCard;