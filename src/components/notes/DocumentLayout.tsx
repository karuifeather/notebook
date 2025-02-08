import React from 'react';

/** Gutter width and gap used for alignment (single source of truth) */
export const DOC_LAYOUT_GUTTER = 44;
export const DOC_LAYOUT_GAP = 12;
export const DOC_LAYOUT_CONTENT_START = DOC_LAYOUT_GUTTER + DOC_LAYOUT_GAP;

interface DocumentLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Single container and content column for the note page.
 * - max-width 980px, centered, padding-inline 24px
 * - Inner grid: 44px gutter column + 1fr content, column-gap 12px
 * - Header and blocks share the same grid; header content and block content align to column 2.
 */
const DocumentLayout: React.FC<DocumentLayoutProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`document-layout ${className}`}>
      <div className="document-layout__grid">{children}</div>
    </div>
  );
};

export default DocumentLayout;
