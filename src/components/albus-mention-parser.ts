import {
  type AttributeDef,
  type MentionObjectType,
  groupLabels,
  matchAttribute,
  matchCategory,
} from "@/components/albus-mention-data";

export type MentionQueryState =
  | { mode: "initial" }
  | { mode: "search"; query: string }
  | { mode: "category"; category: MentionObjectType; itemQuery: string }
  | {
      mode: "attribute";
      category: MentionObjectType;
      attribute: AttributeDef;
      valueQuery: string;
    };

/**
 * Parses the raw text after the @ trigger into a typed query state.
 *
 * Rules (space-separated, natural language):
 * - Empty input              → initial (show folders + popular items)
 * - First token = category   → category mode (show items + attribute chips)
 * - First token = category + second token = attribute → attribute mode (show values)
 * - No category match        → free search across all items
 *
 * Examples:
 *   ""                → { mode: "initial" }
 *   "apps"            → { mode: "category", category: "app", itemQuery: "" }
 *   "apps okta"       → { mode: "category", category: "app", itemQuery: "okta" }
 *   "apps status"     → { mode: "attribute", category: "app", attribute: status, valueQuery: "" }
 *   "apps status app" → { mode: "attribute", category: "app", attribute: status, valueQuery: "app" }
 *   "okta"            → { mode: "search", query: "okta" }
 */
export function parseMentionQuery(raw: string): MentionQueryState {
  const trimmed = raw.trim();
  if (!trimmed) return { mode: "initial" };

  const tokens = trimmed.split(/\s+/);
  const firstToken = tokens[0];

  const category = matchCategory(firstToken);
  if (category) {
    if (tokens.length === 1) {
      return { mode: "category", category, itemQuery: "" };
    }

    const secondToken = tokens[1];
    const attribute = matchAttribute(category, secondToken);
    if (attribute) {
      const valueQuery = tokens.slice(2).join(" ");
      return { mode: "attribute", category, attribute, valueQuery };
    }

    // Second token doesn't match an attribute — treat as item search within category
    return { mode: "category", category, itemQuery: tokens.slice(1).join(" ") };
  }

  return { mode: "search", query: trimmed };
}

/**
 * Returns the display text shown in the editor pill decoration.
 *
 * Examples:
 *   initial                                    → "@search"
 *   search, "okta"                             → "@okta"
 *   category, app, ""                          → "@apps: search"
 *   category, app, "okta"                      → "@apps: okta"
 *   attribute, app, status, ""                 → "@apps-status: search"
 *   attribute, app, status, "approved"         → "@approved-apps"
 */
export function buildPillLabel(state: MentionQueryState): string {
  if (state.mode === "initial") return "@search";
  if (state.mode === "search") return `@${state.query}`;

  const catLabel = groupLabels[state.category].toLowerCase().replace(/\s+/g, "-");

  if (state.mode === "category") {
    return state.itemQuery
      ? `@${catLabel}: ${state.itemQuery}`
      : `@${catLabel}: search`;
  }

  // attribute mode
  const { attribute, valueQuery } = state;
  if (valueQuery) {
    return `@${valueQuery.toLowerCase().replace(/\s+/g, "-")}-${catLabel}`;
  }
  return `@${catLabel}-${attribute.key}: search`;
}

/**
 * Builds the mention tag slug for the inserted mention node.
 *
 * Examples:
 *   ("app", "approved")   → "approved-app"
 *   ("app", "In Review")  → "in-review-app"
 */
export function buildMentionTag(category: MentionObjectType, value: string): string {
  const valueSlug = value.toLowerCase().replace(/\s+/g, "-");
  const catSlug = category.replace(/\s+/g, "-");
  return `${valueSlug}-${catSlug}`;
}
