import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export interface SidebarItemProps {
  /** When provided, renders as Link and navigates. When omitted, renders as button (e.g. folder toggle only). */
  to?: string;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  meta?: string;
  isActive?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
  /** For folder rows: whether the folder is expanded (aria-expanded). */
  ariaExpanded?: boolean;
  /** Optional right-side actions (e.g. ••• menu) shown on hover. */
  actions?: React.ReactNode;
  /** Compact mode (collapsed sidebar): show only icon + optional active accent. */
  compact?: boolean;
  /** Tooltip when compact (e.g. notebook/note title). */
  titleAttr?: string;
  /** Role for tree: 'treeitem' when inside a tree. */
  role?: 'treeitem';
  /** For keyboard: Space toggles folder, Enter opens note. */
  onKeyDown?: (e: React.KeyboardEvent) => void;
  tabIndex?: number;
}

const rowBase =
  'flex h-[42px] min-h-[42px] items-center gap-3 rounded-[14px] border border-border px-3 text-left transition-all duration-[150ms] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]';

/* Active: neutral background; 3px left accent bar only; icon uses --icon-active */
const rowActive =
  'bg-[var(--surface2)] text-[var(--text)] border-l-[3px] border-l-[var(--accent)]';
const rowInactive =
  'border-l-[3px] border-l-transparent hover:bg-[var(--surface2)] active:bg-[var(--surface)] text-[var(--text)]';

export const SidebarItem: React.FC<SidebarItemProps> = ({
  to,
  icon,
  title,
  subtitle,
  meta,
  isActive,
  onClick,
  onDoubleClick,
  onContextMenu,
  children,
  ariaExpanded,
  actions,
  compact,
  titleAttr,
  role,
  onKeyDown,
  tabIndex,
}) => {
  const location = useLocation();
  const isCurrentPage = to ? location.pathname === to : false;
  const active = isActive ?? isCurrentPage;
  const className = `${rowBase} ${active ? rowActive : rowInactive} ${compact ? 'justify-center gap-0 px-0 w-full min-w-0' : ''}`;

  const content = (
    <>
      <span
        className={`flex shrink-0 items-center justify-center transition-colors ${compact ? 'h-8 w-8' : 'h-8 w-8'} ${active ? 'text-[var(--icon-active)]' : 'text-[var(--icon)] group-hover:text-[var(--accent)]'}`}
        aria-hidden
      >
        {icon}
      </span>
      {!compact && (
        <div className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-[var(--text)]">
            {title}
          </span>
          {subtitle && (
            <span className="block truncate text-xs text-[var(--muted)]">
              {subtitle}
            </span>
          )}
        </div>
      )}
      {!compact && meta && (
        <span className="shrink-0 text-xs text-[var(--muted)]">{meta}</span>
      )}
      {!compact && actions && (
        <div className="sidebar-item-actions shrink-0 opacity-0 transition-opacity duration-fast group-hover:opacity-100 focus-within:opacity-100">
          {actions}
        </div>
      )}
      {children}
    </>
  );

  const commonProps = {
    className,
    onContextMenu,
    onDoubleClick,
    'aria-current': active ? ('page' as const) : undefined,
    'aria-expanded': ariaExpanded,
    role,
    tabIndex: tabIndex ?? (role === 'treeitem' ? 0 : undefined),
    onKeyDown,
    title: titleAttr,
  };

  if (to !== undefined) {
    return (
      <div className="group relative">
        <Link
          to={to}
          onClick={onClick}
          {...commonProps}
          style={compact ? undefined : { paddingLeft: 'var(--space-3)' }}
        >
          {content}
        </Link>
      </div>
    );
  }

  return (
    <div className="group relative">
      <button
        type="button"
        onClick={onClick}
        {...commonProps}
        style={compact ? undefined : { paddingLeft: 'var(--space-3)' }}
      >
        {content}
      </button>
    </div>
  );
};
