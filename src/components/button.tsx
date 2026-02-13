import { Link } from 'react-router-dom';
import './styles/button.scss';

type ButtonProps = {
  to: string;
  children: React.ReactNode;
  cta?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
  to,
  children,
  cta = false,
}) => {
  const baseClass =
    'button inline-block px-4 sm:px-5 md:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium rounded-full shadow-md transition-all focus:ring-2 focus:ring-[var(--accent-ring)] focus:outline-none no-underline';
  const ctaClass = 'cta text-white';
  const defaultClass =
    'text-[var(--accent)] hover:text-[var(--accent-hover)] bg-[var(--surface2)] hover:bg-[var(--surface)]';

  return (
    <Link to={to} className={`${baseClass} ${cta ? ctaClass : defaultClass}`}>
      {children}
    </Link>
  );
};
