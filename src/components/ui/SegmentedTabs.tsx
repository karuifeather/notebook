import React from 'react';

export type SegmentedTabId = string;

interface SegmentedTabsProps {
  tabs: { id: SegmentedTabId; label: React.ReactNode; title?: string }[];
  activeId: SegmentedTabId;
  onChange: (id: SegmentedTabId) => void;
  className?: string;
}

export const SegmentedTabs: React.FC<SegmentedTabsProps> = ({
  tabs,
  activeId,
  onChange,
  className = '',
}) => {
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      onChange(tabs[index - 1].id);
    } else if (e.key === 'ArrowRight' && index < tabs.length - 1) {
      e.preventDefault();
      onChange(tabs[index + 1].id);
    }
  };

  return (
    <div
      role="tablist"
      className={`segmented-tabs flex h-9 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-0.5 ${className}`}
      style={{
        padding: 'var(--space-1)',
        minHeight: 36,
        maxHeight: 40,
      }}
    >
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeId === tab.id}
          tabIndex={activeId === tab.id ? 0 : -1}
          onClick={() => onChange(tab.id)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          title={tab.title}
          aria-label={tab.title}
          className={`segmented-tabs__tab flex flex-1 items-center justify-center rounded-[var(--radius-sm)] border-b-2 px-3 py-1.5 text-sm font-medium outline-none transition-all duration-[var(--transition-fast)] focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)] focus-visible:ring-inset ${
            activeId === tab.id
              ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--text)]'
              : 'border-transparent bg-transparent text-[var(--muted)] hover:bg-[var(--surface2)]/60 hover:text-[var(--text)]'
          }`}
          style={{ padding: 'var(--space-1) var(--space-3)' }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
