import React from 'react';

interface SurfaceCardProps {
  children: React.ReactNode;
  className?: string;
}

export const SurfaceCard: React.FC<SurfaceCardProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface2)] shadow-[var(--shadow-md)] transition-shadow duration-[var(--transition-base)] hover:shadow-[var(--shadow-lg)] ${className}`}
      style={{
        boxShadow: 'var(--shadow-md)',
      }}
    >
      {children}
    </div>
  );
};
