import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const { pathname } = useLocation();
  const isPlayground = pathname === '/playground';

  return (
    <header
      className="w-full z-50 backdrop-blur-lg border-b shadow-sm"
      style={{
        backgroundColor: 'var(--surface-2)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="landing-container flex items-center justify-between py-3">
        {/* Logo */}
        <Link
          to="/"
          aria-label="FeatherPad - Home"
          className="flex items-center text-lg font-extrabold tracking-tight text-gray-900 dark:text-white hover:opacity-90 transition-opacity"
        >
          <span className="text-[var(--accent)]">FeatherPad</span>
        </Link>

        {/* CTA Button */}
        <Link
          to={isPlayground ? '/app' : '/playground'}
          className="ml-auto inline-block rounded-full px-4 py-2 text-sm font-medium text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] focus:ring-2 focus:ring-[var(--accent-ring)] focus:outline-none transition-all"
        >
          {isPlayground ? 'Create a notebook' : 'Try now'}
        </Link>
      </div>
    </header>
  );
}
