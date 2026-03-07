"use client";

import {
  type AttributeDef,
  type MentionItem,
  type MentionObjectType,
  categoryAttributes,
  filterAttributeValues,
  getPopularItems,
  groupLabels,
  groupOrder,
  searchInCategory,
  searchMentions,
} from "@/components/albus-mention-data";
import { type MentionQueryState } from "@/components/albus-mention-parser";
import { type CSSProperties, forwardRef } from "react";
import { createPortal } from "react-dom";

// ---------------------------------------------------------------------------
// Nav item — the flat navigable list the parent uses for keyboard handling
// ---------------------------------------------------------------------------
export type NavItem =
  | { kind: "folder"; category: MentionObjectType }
  | { kind: "mention"; item: MentionItem }
  | { kind: "attr"; category: MentionObjectType; attr: AttributeDef }
  | { kind: "value"; category: MentionObjectType; attr: AttributeDef; value: string };

export function computeNavItems(parsedQuery: MentionQueryState): NavItem[] {
  switch (parsedQuery.mode) {
    case "initial":
      return [
        ...groupOrder.map((c) => ({ kind: "folder" as const, category: c })),
        ...groupOrder.flatMap((c) =>
          getPopularItems(c).map((item) => ({ kind: "mention" as const, item })),
        ),
      ];
    case "search": {
      const groups = searchMentions(parsedQuery.query);
      return groups.flatMap((g) => [
        ...g.items.map((item) => ({ kind: "mention" as const, item })),
        ...(categoryAttributes[g.type] ?? [])
          .slice(0, 3)
          .map((attr) => ({ kind: "attr" as const, category: g.type, attr })),
      ]);
    }
    case "category": {
      const items = searchInCategory(parsedQuery.category, parsedQuery.itemQuery);
      return [
        ...items.map((item) => ({ kind: "mention" as const, item })),
        ...(categoryAttributes[parsedQuery.category] ?? []).map((attr) => ({
          kind: "attr" as const,
          category: parsedQuery.category,
          attr,
        })),
      ];
    }
    case "attribute": {
      const values = filterAttributeValues(
        parsedQuery.category,
        parsedQuery.attribute.key,
        parsedQuery.valueQuery,
      );
      return values.map((v) => ({
        kind: "value" as const,
        category: parsedQuery.category,
        attr: parsedQuery.attribute,
        value: v,
      }));
    }
  }
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
export interface AlbusMentionSearchProps {
  parsedQuery: MentionQueryState;
  activeIndex: number;
  style: CSSProperties;
  onSelect: (item: MentionItem) => void;
  onAttributeValueSelect: (
    category: MentionObjectType,
    attribute: AttributeDef,
    value: string,
  ) => void;
  onAttributeClick: (attr: AttributeDef) => void;
}

// ---------------------------------------------------------------------------
// Root component
// ---------------------------------------------------------------------------
export const AlbusMentionSearch = forwardRef<HTMLDivElement, AlbusMentionSearchProps>(
  function AlbusMentionSearch(
    { parsedQuery, activeIndex, style, onSelect, onAttributeValueSelect, onAttributeClick },
    ref,
  ) {
    if (typeof window === "undefined") return null;

    const navItems = computeNavItems(parsedQuery);
    const mode = parsedQuery.mode;
    const showBack = mode === "category" || mode === "attribute";
    const showOpen = mode === "initial";

    return createPortal(
      <div
        ref={ref}
        aria-label="Mention search"
        style={style}
        tabIndex={-1}
        className="z-50 flex h-[300px] w-[260px] flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.10),0_0_0_1px_rgba(0,0,0,0.03)]"
      >
        {/* Scrollable content */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {mode === "initial" && (
            <InitialView navItems={navItems} activeIndex={activeIndex} onSelect={onSelect} onAttributeClick={onAttributeClick} />
          )}
          {mode === "search" && (
            <SearchView navItems={navItems} activeIndex={activeIndex} onSelect={onSelect} onAttributeClick={onAttributeClick} />
          )}
          {mode === "category" && parsedQuery.mode === "category" && (
            <CategoryView
              category={parsedQuery.category}
              navItems={navItems}
              activeIndex={activeIndex}
              onSelect={onSelect}
              onAttributeClick={onAttributeClick}
            />
          )}
          {mode === "attribute" && parsedQuery.mode === "attribute" && (
            <AttributeView
              category={parsedQuery.category}
              attribute={parsedQuery.attribute}
              navItems={navItems}
              activeIndex={activeIndex}
              onAttributeValueSelect={onAttributeValueSelect}
            />
          )}
        </div>

        {/* Sticky footer */}
        <div className="flex shrink-0 items-center gap-3 border-neutral-100 border-t bg-white px-3 py-[7px]">
          <Hint keys="↑↓" label="Navigate" />
          {showBack && <Hint keys="←" label="Back" />}
          {showOpen && <Hint keys="→" label="Open" />}
          <Hint keys="↵" label="Enter" />
        </div>
      </div>,
      document.body,
    );
  },
);

// ---------------------------------------------------------------------------
// Footer hint
// ---------------------------------------------------------------------------
function Hint({ keys, label }: { keys: string; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <kbd className="font-mono text-[0.625rem] text-neutral-400">{keys}</kbd>
      <span className="text-[0.625rem] text-neutral-400">{label}</span>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Initial view: all folders + popular items per category
// ---------------------------------------------------------------------------
function InitialView({
  navItems,
  activeIndex,
  onSelect,
  onAttributeClick,
}: {
  navItems: NavItem[];
  activeIndex: number;
  onSelect: (item: MentionItem) => void;
  onAttributeClick: (attr: AttributeDef) => void;
}) {
  // Folders first, then items grouped
  const folderCount = groupOrder.length;
  let itemIdx = folderCount; // items start after folders in navItems

  return (
    <div className="py-1">
      {/* Folder rows */}
      <div className="border-neutral-100 border-b pb-1">
        {groupOrder.map((type, fi) => (
          <FolderRow
            key={type}
            type={type}
            isActive={fi === activeIndex}
          />
        ))}
      </div>

      {/* Popular items grouped */}
      {groupOrder.map((type) => {
        const popular = getPopularItems(type);
        if (popular.length === 0) return null;
        const sectionStart = itemIdx;
        itemIdx += popular.length;
        return (
          <div key={type}>
            <SectionLabel>{groupLabels[type]}</SectionLabel>
            {popular.map((item, i) => (
              <ItemRow
                key={item.id}
                item={item}
                isActive={sectionStart + i === activeIndex}
                onSelect={onSelect}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Search view: matching folders + fuzzy results + attr rows
// ---------------------------------------------------------------------------
function SearchView({
  navItems,
  activeIndex,
  onSelect,
  onAttributeClick,
}: {
  navItems: NavItem[];
  activeIndex: number;
  onSelect: (item: MentionItem) => void;
  onAttributeClick: (attr: AttributeDef) => void;
}) {
  const groups = navItems.reduce<{ type: MentionObjectType; items: NavItem[] }[]>((acc, nav) => {
    if (nav.kind === "mention" || nav.kind === "attr") {
      const cat = nav.kind === "mention" ? nav.item.objectType : nav.category;
      const existing = acc.find((g) => g.type === cat);
      if (existing) {
        existing.items.push(nav);
      } else {
        acc.push({ type: cat, items: [nav] });
      }
    }
    return acc;
  }, []);

  const matchingFolders = [...new Set(groups.map((g) => g.type))];
  let localIdx = 0;

  if (navItems.length === 0) {
    return (
      <div className="px-3 py-3 text-[0.8125rem] text-neutral-400">No results</div>
    );
  }

  return (
    <div className="py-1">
      {matchingFolders.length > 0 && (
        <div className="border-neutral-100 border-b pb-1">
          {matchingFolders.map((type) => (
            <FolderRow key={type} type={type} isActive={false} />
          ))}
        </div>
      )}
      {groups.map((group) => (
        <div key={group.type}>
          <SectionLabel>{groupLabels[group.type]}</SectionLabel>
          {group.items.map((nav) => {
            const idx = localIdx++;
            if (nav.kind === "mention") {
              return (
                <ItemRow key={nav.item.id} item={nav.item} isActive={idx === activeIndex} onSelect={onSelect} />
              );
            }
            if (nav.kind === "attr") {
              return (
                <AttrRow key={nav.attr.key} attr={nav.attr} category={nav.category} isActive={idx === activeIndex} onAttributeClick={onAttributeClick} />
              );
            }
            return null;
          })}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Category view: single folder + items + attr rows
// ---------------------------------------------------------------------------
function CategoryView({
  category,
  navItems,
  activeIndex,
  onSelect,
  onAttributeClick,
}: {
  category: MentionObjectType;
  navItems: NavItem[];
  activeIndex: number;
  onSelect: (item: MentionItem) => void;
  onAttributeClick: (attr: AttributeDef) => void;
}) {
  const mentionItems = navItems.filter((n): n is Extract<NavItem, { kind: "mention" }> => n.kind === "mention");
  const attrItems = navItems.filter((n): n is Extract<NavItem, { kind: "attr" }> => n.kind === "attr");

  return (
    <div className="py-1">
      <div className="border-neutral-100 border-b pb-1">
        <FolderRow type={category} isActive={false} bold />
      </div>
      <SectionLabel>{groupLabels[category]}</SectionLabel>
      {mentionItems.length === 0 && (
        <div className="px-3 py-1.5 text-[0.8125rem] text-neutral-400">No results</div>
      )}
      {mentionItems.map((nav, i) => (
        <ItemRow key={nav.item.id} item={nav.item} isActive={i === activeIndex} onSelect={onSelect} />
      ))}
      {attrItems.length > 0 && (
        <>
          <SectionLabel>{groupLabels[category]} Attributes</SectionLabel>
          {attrItems.map((nav, i) => (
            <AttrRow
              key={nav.attr.key}
              attr={nav.attr}
              category={nav.category}
              isActive={mentionItems.length + i === activeIndex}
              onAttributeClick={onAttributeClick}
            />
          ))}
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Attribute view: breadcrumb + value list
// ---------------------------------------------------------------------------
function AttributeView({
  category,
  attribute,
  navItems,
  activeIndex,
  onAttributeValueSelect,
}: {
  category: MentionObjectType;
  attribute: AttributeDef;
  navItems: NavItem[];
  activeIndex: number;
  onAttributeValueSelect: (category: MentionObjectType, attribute: AttributeDef, value: string) => void;
}) {
  const values = navItems.filter((n): n is Extract<NavItem, { kind: "value" }> => n.kind === "value");

  return (
    <div>
      <div className="flex items-center gap-1.5 border-neutral-100 border-b px-3 py-2">
        <FolderIcon />
        <span className="text-[0.8125rem] font-medium text-neutral-600">
          {groupLabels[category]}{" "}
          <span className="font-normal text-neutral-400">{attribute.label}</span>
        </span>
      </div>
      <div className="py-1">
        {values.length === 0 && (
          <div className="px-3 py-1.5 text-[0.8125rem] text-neutral-400">No values</div>
        )}
        {values.map((nav, i) => (
          <div
            key={nav.value}
            className={`flex cursor-pointer items-center px-3 py-[6px] text-[0.8125rem] transition-colors ${
              i === activeIndex
                ? "bg-neutral-100 text-neutral-900"
                : "text-neutral-900 hover:bg-neutral-50"
            }`}
            onMouseDown={(e) => {
              e.preventDefault();
              onAttributeValueSelect(category, attribute, nav.value);
            }}
          >
            {nav.value}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared row components
// ---------------------------------------------------------------------------
function FolderRow({
  type,
  isActive,
  bold,
}: {
  type: MentionObjectType;
  isActive: boolean;
  bold?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-[5px] transition-colors ${
        isActive ? "bg-neutral-100" : ""
      }`}
    >
      <span className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center ${isActive ? "text-neutral-900" : "text-neutral-600"}`}>
        <FolderIcon />
      </span>
      <span
        className={`text-[0.8125rem] ${
          bold ? "font-semibold text-neutral-900" : isActive ? "font-medium text-neutral-900" : "text-neutral-900"
        }`}
      >
        {groupLabels[type]}
      </span>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 pt-2 pb-0.5 text-[0.6875rem] font-medium text-neutral-400">
      {children}
    </div>
  );
}

function ItemRow({
  item,
  isActive,
  onSelect,
}: {
  item: MentionItem;
  isActive: boolean;
  onSelect: (item: MentionItem) => void;
}) {
  return (
    <div
      data-mention-option=""
      aria-selected={isActive}
      className={`flex w-full cursor-pointer items-center gap-2 px-3 py-[6px] text-[0.8125rem] transition-colors ${
        isActive ? "bg-neutral-100 text-neutral-900" : "text-neutral-900 hover:bg-neutral-50"
      }`}
      onMouseDown={(e) => {
        e.preventDefault();
        onSelect(item);
      }}
    >
      <span className="flex-1 truncate">{item.name}</span>
      <span className="shrink-0 font-mono text-[0.6875rem] text-neutral-300">
        @{item.tag}
      </span>
    </div>
  );
}

function AttrRow({
  attr,
  category,
  isActive,
  onAttributeClick,
}: {
  attr: AttributeDef;
  category: MentionObjectType;
  isActive: boolean;
  onAttributeClick: (attr: AttributeDef) => void;
}) {
  return (
    <div
      className={`flex cursor-pointer items-center px-3 py-[6px] text-[0.8125rem] transition-colors ${
        isActive ? "bg-neutral-100 text-neutral-900" : "text-neutral-900 hover:bg-neutral-50"
      }`}
      onMouseDown={(e) => {
        e.preventDefault();
        onAttributeClick(attr);
      }}
    >
      {attr.label}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------
function FolderIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1.5 3.5C1.5 2.948 1.948 2.5 2.5 2.5H5.5L7 4H11.5C12.052 4 12.5 4.448 12.5 5V10.5C12.5 11.052 12.052 11.5 11.5 11.5H2.5C1.948 11.5 1.5 11.052 1.5 10.5V3.5Z" />
    </svg>
  );
}
