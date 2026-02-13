import React from 'react';
import { Link } from 'react-router-dom';

interface MetaRowProps {
  breadcrumb?: { label: string; href?: string }[];
  status?: string;
  lastUpdated?: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Compact row under title: breadcrumb, status, optional last updated, right-aligned actions.
 * All items subtle (muted), not large.
 */
export const MetaRow: React.FC<MetaRowProps> = ({
  breadcrumb = [],
  status,
  lastUpdated,
  children,
  className = '',
}) => {
  return (
    <div
      className={`meta-row flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--muted)] ${className}`}
    >
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        {breadcrumb.length > 0 && (
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5">
            {breadcrumb.map((item, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && (
                  <span className="text-[var(--muted)] opacity-60">/</span>
                )}
                {item.href != null ? (
                  <Link
                    to={item.href}
                    className="truncate hover:text-[var(--text)] focus-ring rounded px-0.5 py-0.5"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="truncate">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        {status && (
          <span aria-live="polite" className="shrink-0">
            {status}
          </span>
        )}
        {lastUpdated && (
          <span className="shrink-0 opacity-80">{lastUpdated}</span>
        )}
      </div>
      {children && (
        <div className="flex shrink-0 items-center gap-1">{children}</div>
      )}
    </div>
  );
};
