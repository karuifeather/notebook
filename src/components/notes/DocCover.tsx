import React, { useState } from 'react';

interface DocCoverProps {
  coverImage?: string | null;
  onEditCover?: () => void;
  className?: string;
}

/**
 * Full-width cover within canvas: 180–240px height, radius 16, gradient overlay.
 * "Edit cover" / "Add cover" as ghost button on hover (top-right) or when no cover, near title.
 */
export const DocCover: React.FC<DocCoverProps> = ({
  coverImage,
  onEditCover,
  className = '',
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const showButton = isHovered || !coverImage;

  return (
    <div
      className={`doc-cover relative overflow-hidden rounded-[16px] bg-[var(--surface2)] ${className}`}
      style={{
        height: coverImage ? 'clamp(180px, 22vw, 240px)' : 'auto',
        minHeight: coverImage ? undefined : 100,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {coverImage ? (
        <>
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-[var(--surface2)]" />
          )}
          <img
            src={coverImage}
            alt=""
            className={`h-full w-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          <div
            className="absolute inset-0 rounded-[16px] opacity-40"
            style={{
              background:
                'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.5) 100%)',
            }}
            aria-hidden
          />
        </>
      ) : (
        <div className="flex min-h-[100px] flex-col items-center justify-center gap-3 py-6 text-[var(--muted)]">
          <i className="fas fa-image text-3xl" aria-hidden />
        </div>
      )}
      {onEditCover && showButton && (
        <button
          type="button"
          onClick={onEditCover}
          className="doc-cover__edit-btn"
          aria-label={coverImage ? 'Edit cover' : 'Add cover'}
        >
          <i className={`fas ${coverImage ? 'fa-pen' : 'fa-plus'} text-xs`} />
          <span className="doc-cover__edit-label">
            {coverImage ? 'Edit cover' : 'Add cover'}
          </span>
        </button>
      )}
    </div>
  );
};
