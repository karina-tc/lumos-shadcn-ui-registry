"use client";

interface PageTabsProps {
  tabs: string[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function PageTabs({
  tabs,
  activeTab,
  onTabChange,
}: PageTabsProps) {
  const current = activeTab ?? tabs[0];

  return (
    <div className="flex gap-1 border-b border-border">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onTabChange?.(tab)}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            tab === current
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
