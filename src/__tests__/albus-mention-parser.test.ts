import { describe, it, expect } from "vitest";
import { parseMentionQuery, buildPillLabel, buildMentionTag } from "@/components/albus-mention-parser";

describe("parseMentionQuery", () => {
  it("returns initial mode for empty string", () => {
    expect(parseMentionQuery("")).toEqual({ mode: "initial" });
  });

  it("returns initial mode for whitespace-only input", () => {
    expect(parseMentionQuery("   ")).toEqual({ mode: "initial" });
  });

  it("returns search mode for a non-category word", () => {
    expect(parseMentionQuery("okta")).toEqual({ mode: "search", query: "okta" });
  });

  it("returns search mode for an unrecognized multi-word query", () => {
    expect(parseMentionQuery("cloudflare something")).toEqual({
      mode: "search",
      query: "cloudflare something",
    });
  });

  it("returns category mode for 'apps'", () => {
    const result = parseMentionQuery("apps");
    expect(result.mode).toBe("category");
    if (result.mode === "category") {
      expect(result.category).toBe("app");
      expect(result.itemQuery).toBe("");
    }
  });

  it("returns category mode for alias 'identities'", () => {
    const result = parseMentionQuery("identities");
    expect(result.mode).toBe("category");
    if (result.mode === "category") {
      expect(result.category).toBe("identity");
      expect(result.itemQuery).toBe("");
    }
  });

  it("returns category mode for alias 'policies'", () => {
    const result = parseMentionQuery("policies");
    expect(result.mode).toBe("category");
    if (result.mode === "category") {
      expect(result.category).toBe("policy");
    }
  });

  it("returns category mode for alias 'reports'", () => {
    const result = parseMentionQuery("reports");
    expect(result.mode).toBe("category");
    if (result.mode === "category") {
      expect(result.category).toBe("reports");
    }
  });

  it("returns category mode for alias 'knowledge' (maps to reports)", () => {
    const result = parseMentionQuery("knowledge");
    expect(result.mode).toBe("category");
    if (result.mode === "category") {
      expect(result.category).toBe("reports");
    }
  });

  it("returns category mode with itemQuery for 'apps okta'", () => {
    const result = parseMentionQuery("apps okta");
    expect(result.mode).toBe("category");
    if (result.mode === "category") {
      expect(result.category).toBe("app");
      expect(result.itemQuery).toBe("okta");
    }
  });

  it("returns attribute mode for 'apps status'", () => {
    const result = parseMentionQuery("apps status");
    expect(result.mode).toBe("attribute");
    if (result.mode === "attribute") {
      expect(result.category).toBe("app");
      expect(result.attribute.key).toBe("status");
      expect(result.valueQuery).toBe("");
    }
  });

  it("returns attribute mode with valueQuery for 'apps status approved'", () => {
    const result = parseMentionQuery("apps status approved");
    expect(result.mode).toBe("attribute");
    if (result.mode === "attribute") {
      expect(result.category).toBe("app");
      expect(result.attribute.key).toBe("status");
      expect(result.valueQuery).toBe("approved");
    }
  });

  it("returns attribute mode for 'identities status'", () => {
    const result = parseMentionQuery("identities status");
    expect(result.mode).toBe("attribute");
    if (result.mode === "attribute") {
      expect(result.category).toBe("identity");
      expect(result.attribute.key).toBe("status");
    }
  });

  it("returns category mode when second token doesn't match an attribute", () => {
    // "apps okta" — "okta" is not an attribute of app
    const result = parseMentionQuery("apps okta");
    expect(result.mode).toBe("category");
    if (result.mode === "category") {
      expect(result.itemQuery).toBe("okta");
    }
  });

  it("returns search mode for short non-category word (< 3 chars)", () => {
    expect(parseMentionQuery("ok")).toEqual({ mode: "search", query: "ok" });
  });
});

describe("buildPillLabel", () => {
  it("returns @search for initial mode", () => {
    expect(buildPillLabel({ mode: "initial" })).toBe("@search");
  });

  it("returns @query for search mode", () => {
    expect(buildPillLabel({ mode: "search", query: "okta" })).toBe("@okta");
  });

  it("returns category label with search for empty itemQuery", () => {
    expect(
      buildPillLabel({ mode: "category", category: "app", itemQuery: "" })
    ).toBe("@apps: search");
  });

  it("returns category label with itemQuery when present", () => {
    expect(
      buildPillLabel({ mode: "category", category: "app", itemQuery: "okta" })
    ).toBe("@apps: okta");
  });

  it("returns attribute label for attribute mode with no value", () => {
    expect(
      buildPillLabel({
        mode: "attribute",
        category: "app",
        attribute: { key: "status", label: "Status", section: "attribute" },
        valueQuery: "",
      })
    ).toBe("@apps-status: search");
  });

  it("returns terminal label when valueQuery is set", () => {
    expect(
      buildPillLabel({
        mode: "attribute",
        category: "app",
        attribute: { key: "status", label: "Status", section: "attribute" },
        valueQuery: "approved",
      })
    ).toBe("@approved-apps");
  });

  it("slugifies multi-word valueQuery", () => {
    expect(
      buildPillLabel({
        mode: "attribute",
        category: "app",
        attribute: { key: "status", label: "Status", section: "attribute" },
        valueQuery: "In Review",
      })
    ).toBe("@in-review-apps");
  });

  it("handles multi-word category (access-review)", () => {
    expect(
      buildPillLabel({ mode: "category", category: "access-review", itemQuery: "" })
    ).toBe("@access-reviews: search");
  });
});

describe("buildMentionTag", () => {
  it("builds a slug from category + value", () => {
    expect(buildMentionTag("app", "approved")).toBe("approved-app");
  });

  it("slugifies multi-word values", () => {
    expect(buildMentionTag("app", "In Review")).toBe("in-review-app");
  });

  it("handles access-review category", () => {
    expect(buildMentionTag("access-review", "active")).toBe("active-access-review");
  });
});
