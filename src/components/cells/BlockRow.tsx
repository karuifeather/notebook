import React from 'react';
import './styles/block-row.scss';

interface BlockRowProps {
  children: [React.ReactNode, React.ReactNode]; // [GutterControls, BlockContent]
  className?: string;
  'data-dragging'?: boolean;
}

/**
 * Notion-style block row: left gutter (44px) + content.
 * Gutter holds controls that show on hover/focus.
 */
const BlockRow: React.FC<BlockRowProps> = ({
  children,
  className = '',
  'data-dragging': dataDragging,
}) => {
  const [gutterControls, blockContent] = Array.isArray(children)
    ? children
    : [null, children];
  return (
    <div className={`block-row ${className}`} data-dragging={dataDragging}>
      <div className="block-row__gutter" aria-hidden="true">
        {gutterControls}
      </div>
      <div className="block-row__content">{blockContent}</div>
    </div>
  );
};

export default BlockRow;
