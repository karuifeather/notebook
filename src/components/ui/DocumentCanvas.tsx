import React from 'react';

interface DocumentCanvasProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Centered document canvas for notebook/note pages.
 * max-width 920–1040px, margin auto, padding 28–40px top, 24px sides.
 * Content reads like a page, not a modal panel.
 */
export const DocumentCanvas: React.FC<DocumentCanvasProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`document-canvas ${className}`}
      style={{
        maxWidth: 'min(100%, 1040px)',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingTop: 'clamp(28px, 5vw, 40px)',
        paddingLeft: 24,
        paddingRight: 24,
      }}
    >
      {children}
    </div>
  );
};
