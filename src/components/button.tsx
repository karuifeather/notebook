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
    'button inline-block px-4 sm:px-5 md:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium rounded-full shadow-md transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none no-underline';
  const ctaClass =
    'cta text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700';
  const defaultClass =
    'text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-gray-700 dark:hover:bg-gray-600';

  return (
    <Link to={to} className={`${baseClass} ${cta ? ctaClass : defaultClass}`}>
      {children}
    </Link>
  );
};
