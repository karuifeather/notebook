import { Link } from 'react-router-dom';

import './button.scss';

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
    'button px-6 py-3 font-medium rounded-lg shadow transition no-underline';
  const ctaClass =
    'cta text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600';
  const defaultClass =
    'text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-gray-700 dark:hover:bg-gray-600';

  return (
    <Link to={to} className={`${baseClass} ${cta ? ctaClass : defaultClass}`}>
      {children}
    </Link>
  );
};
