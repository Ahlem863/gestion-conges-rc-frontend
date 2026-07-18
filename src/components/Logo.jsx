function Logo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <linearGradient id="ttgrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2b6cb0" />
          <stop offset="30%" stopColor="#7c3aed" />
          <stop offset="55%" stopColor="#e11d48" />
          <stop offset="80%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#eab308" />
        </linearGradient>
      </defs>
      <path
        d="M15 50 C15 25, 40 8, 55 8 C78 8, 92 30, 92 50 C92 55, 88 58, 84 55 L60 42 C58 41, 55 41, 53 42 L20 58 C17 59, 15 56, 15 50 Z"
        fill="url(#ttgrad)"
      />
      <text x="42" y="42" fontSize="26" fontWeight="800" fill="#fff" textAnchor="middle" fontFamily="system-ui">
        TT
      </text>
    </svg>
  );
}

export default Logo;