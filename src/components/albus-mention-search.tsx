"use client";

import {
  type GroupedResults,
  type MentionItem,
  type MentionObjectType,
  getMentionsByCategory,
  groupLabels,
  groupOrder,
} from "@/components/albus-mention-data";
import {
  type CSSProperties,
  forwardRef,
  useCallback,
  useEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";

export interface AlbusMentionSearchProps {
  /** Grouped search results (empty when no query) */
  groups: GroupedResults[];
  /** Index of active item for keyboard navigation */
  activeIndex: number;
  /** Fixed positioning style */
  style: CSSProperties;
  /** Whether a search query is active */
  hasQuery: boolean;
  /** Callback when an item is selected */
  onSelect: (item: MentionItem) => void;
  /** Callback when a category is selected from default view */
  onCategorySelect?: (category: MentionObjectType) => void;
}

export const AlbusMentionSearch = forwardRef<
  HTMLDivElement,
  AlbusMentionSearchProps
>(function AlbusMentionSearch(
  { groups, activeIndex, style, hasQuery, onSelect, onCategorySelect },
  ref,
) {
  if (typeof window === "undefined") return null;

  const [expandedCategory, setExpandedCategory] =
    useState<MentionObjectType | null>(null);

  // Reset expanded category when query changes
  useEffect(() => {
    if (hasQuery) setExpandedCategory(null);
  }, [hasQuery]);

  const handleCategoryClick = useCallback(
    (category: MentionObjectType) => {
      setExpandedCategory(category);
      onCategorySelect?.(category);
    },
    [onCategorySelect],
  );

  // Determine what to show
  const showDefaultView = !hasQuery && !expandedCategory;
  const showCategoryItems = !hasQuery && expandedCategory;
  const showSearchResults = hasQuery;

  const categoryItems = expandedCategory
    ? getMentionsByCategory(expandedCategory)
    : [];

  const displayGroups = showSearchResults
    ? groups
    : showCategoryItems
      ? categoryItems
      : [];

  const flatItems = displayGroups.flatMap((g) => g.items);
  let runningIndex = 0;

  return createPortal(
    <div
      ref={ref}
      aria-label="Mention search"
      style={style}
      tabIndex={-1}
      className="z-50 min-w-[280px] max-w-[320px] overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.02)]"
    >
      {/* Default view: category list + hint */}
      {showDefaultView && (
        <div>
          <div className="py-1">
            {groupOrder.map((type) => (
              <button
                key={type}
                type="button"
                className="flex w-full items-center gap-2.5 px-3 py-[7px] text-left text-[0.8125rem] text-neutral-700 transition-colors hover:bg-neutral-50 active:bg-neutral-100"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleCategoryClick(type);
                }}
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-neutral-400">
                  <CategoryIcon type={type} />
                </span>
                <span className="font-medium">{groupLabels[type]}</span>
              </button>
            ))}
          </div>
          <div className="border-neutral-100 border-t px-3 py-2.5">
            <p className="text-[0.6875rem] text-neutral-400 leading-relaxed">
              Search by name (<span className="text-neutral-500">@Okta</span>)
              or by attribute (
              <span className="text-neutral-500">@active-apps</span>)
            </p>
          </div>
        </div>
      )}

      {/* Category expanded view */}
      {showCategoryItems && (
        <div>
          <div className="flex items-center gap-1.5 border-neutral-100 border-b px-3 py-2">
            <button
              type="button"
              className="flex items-center gap-1 text-[0.6875rem] text-neutral-400 transition-colors hover:text-neutral-600"
              onMouseDown={(e) => {
                e.preventDefault();
                setExpandedCategory(null);
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className="shrink-0"
              >
                <path
                  d="M7.5 9L4.5 6L7.5 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back
            </button>
            <span className="text-neutral-300">|</span>
            <span className="font-medium text-[0.6875rem] text-neutral-600">
              {groupLabels[expandedCategory]}
            </span>
          </div>
          <div className="max-h-64 overflow-y-auto py-1">
            {flatItems.length === 0 && (
              <div className="px-3 py-2 text-[0.8125rem] text-neutral-400">
                No items
              </div>
            )}
            {displayGroups.map((group) => {
              const groupStartIndex = runningIndex;
              const groupEl = (
                <div key={group.type}>
                  {group.items.map((item, i) => {
                    const itemIndex = groupStartIndex + i;
                    const isActive = itemIndex === activeIndex;
                    return (
                      <MentionRow
                        key={item.id}
                        item={item}
                        isActive={isActive}
                        itemIndex={itemIndex}
                        onSelect={onSelect}
                      />
                    );
                  })}
                </div>
              );
              runningIndex += group.items.length;
              return groupEl;
            })}
          </div>
        </div>
      )}

      {/* Search results view */}
      {showSearchResults && (
        <div className="max-h-72 overflow-y-auto py-1">
          {flatItems.length === 0 && (
            <div className="px-3 py-3 text-[0.8125rem] text-neutral-400">
              No results
            </div>
          )}
          {displayGroups.map((group) => {
            const groupStartIndex = runningIndex;
            const groupEl = (
              <div key={group.type}>
                <div className="px-3 pt-2 pb-1 font-medium text-[0.6875rem] text-neutral-400 uppercase tracking-wider">
                  {group.label}
                </div>
                {group.items.map((item, i) => {
                  const itemIndex = groupStartIndex + i;
                  const isActive = itemIndex === activeIndex;
                  return (
                    <MentionRow
                      key={item.id}
                      item={item}
                      isActive={isActive}
                      itemIndex={itemIndex}
                      onSelect={onSelect}
                    />
                  );
                })}
              </div>
            );
            runningIndex += group.items.length;
            return groupEl;
          })}
        </div>
      )}
    </div>,
    document.body,
  );
});

// ---------------------------------------------------------------------------
// Mention row
// ---------------------------------------------------------------------------
function MentionRow({
  item,
  isActive,
  itemIndex,
  onSelect,
}: {
  item: MentionItem;
  isActive: boolean;
  itemIndex: number;
  onSelect: (item: MentionItem) => void;
}) {
  return (
    <div
      data-mention-option=""
      aria-selected={isActive}
      id={`mention-option-${itemIndex}`}
      className={`flex w-full cursor-pointer items-center gap-2.5 px-3 py-[7px] text-left text-[0.8125rem] transition-colors ${
        isActive
          ? "bg-neutral-100 text-neutral-900"
          : "text-neutral-700 hover:bg-neutral-50"
      }`}
      onMouseDown={(e) => {
        e.preventDefault();
        onSelect(item);
      }}
    >
      <span className="flex-1 truncate">{item.name}</span>
      <span className="shrink-0 text-[0.6875rem] text-neutral-400">
        @{item.tag}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Category icons (simple SVGs)
// ---------------------------------------------------------------------------
function CategoryIcon({ type }: { type: MentionObjectType }) {
  const className = "h-3.5 w-3.5";
  switch (type) {
    case "app":
      return (
        <svg
          className={className}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="2" width="5" height="5" rx="1" />
          <rect x="9" y="2" width="5" height="5" rx="1" />
          <rect x="2" y="9" width="5" height="5" rx="1" />
          <rect x="9" y="9" width="5" height="5" rx="1" />
        </svg>
      );
    case "identity":
      return (
        <svg
          className={className}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="8" cy="5" r="3" />
          <path d="M2.5 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
        </svg>
      );
    case "policy":
      return (
        <svg
          className={className}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8 1.5L2.5 4v4c0 3.5 2.5 5.5 5.5 6.5 3-1 5.5-3 5.5-6.5V4L8 1.5z" />
        </svg>
      );
    case "knowledge":
      return (
        <svg
          className={className}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 2h8a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z" />
          <path d="M5.5 5h5M5.5 7.5h5M5.5 10h3" />
        </svg>
      );
    case "entitlement":
      return (
        <svg
          className={className}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 8.5L6.5 12 13 4" />
        </svg>
      );
    case "access-review":
      return (
        <svg
          className={className}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="8" cy="8" r="6" />
          <path d="M8 4.5V8l2.5 1.5" />
        </svg>
      );
    case "access-request":
      return (
        <svg
          className={className}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8 3v10M3 8h10" />
        </svg>
      );
  }
}
