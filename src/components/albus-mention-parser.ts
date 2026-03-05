import { matchCategory, type MentionObjectType, groupLabels } from "@/components/albus-mention-data";

export type MentionQueryState =
  | { mode: "free"; query: string }
  | {
      mode: "scoped";
      category: MentionObjectType;
      attribute: string | null;
      value: string | null;
      rawAttributeQuery: string;
    };

/**
 * Parses the raw text after the @ trigger into a typed query state.
 *
 * Rules:
 * - If raw contains ":" AND the text left of ":" matches a known category → scoped mode.
 *   If the left side is unrecognized, falls through to free mode with the full raw string.
 *   Left of first ":" is category hint, right is split into attribute + value.
 * - If raw exactly/closely matches a category name → scoped mode.
 * - Otherwise → free search mode.
 */
export function parseMentionQuery(raw: string): MentionQueryState {
  const trimmed = raw.trim();

  // Colon-scoped: "apps: status approved"
  const colonIdx = trimmed.indexOf(":");
  if (colonIdx !== -1) {
    const categoryHint = trimmed.slice(0, colonIdx).trim();
    const rest = trimmed.slice(colonIdx + 1).trim();
    const category = matchCategory(categoryHint);
    if (category) {
      const parts = rest.split(/\s+/).filter(Boolean);
      const attribute = parts.length > 0 ? parts[0] : null;
      const value = parts.length > 1 ? parts.slice(1).join(" ") : null;
      return { mode: "scoped", category, attribute, value, rawAttributeQuery: rest };
    }
  }

  // Category name match (no colon)
  if (trimmed.length > 0) {
    const category = matchCategory(trimmed);
    if (category) {
      return { mode: "scoped", category, attribute: null, value: null, rawAttributeQuery: "" };
    }
  }

  // Free search
  return { mode: "free", query: trimmed };
}

/**
 * Returns the display text shown in the editor pill decoration.
 *
 * Examples:
 *   free, ""                          → "@search"
 *   free, "okta"                      → "@okta"
 *   scoped, app, null, null           → "@apps: search"
 *   scoped, app, "status", null       → "@apps-status: search"
 *   scoped, app, "status", "approved" → "@approved-apps" (terminal)
 */
export function buildPillLabel(state: MentionQueryState): string {
  if (state.mode === "free") {
    return state.query ? `@${state.query}` : "@search";
  }
  const { category, attribute, value } = state;
  const catLabel = groupLabels[category].toLowerCase();

  if (value) {
    return `@${value.toLowerCase().replace(/\s+/g, "-")}-${catLabel.replace(/\s+/g, "-")}`;
  }
  if (attribute) {
    return `@${catLabel.replace(/\s+/g, "-")}-${attribute.replace(/\s+/g, "-")}: search`;
  }
  return `@${catLabel.replace(/\s+/g, "-")}: search`;
}

/**
 * Builds the mention tag slug for the inserted mention node.
 * Used as the pill text after selection.
 *
 * Examples:
 *   ("app", "approved")   → "approved-app"
 *   ("app", "In Review")  → "in-review-app"
 */
export function buildMentionTag(
  category: MentionObjectType,
  value: string,
): string {
  const valueSlug = value.toLowerCase().replace(/\s+/g, "-");
  const catSlug = category.replace(/\s+/g, "-");
  return `${valueSlug}-${catSlug}`;
}
