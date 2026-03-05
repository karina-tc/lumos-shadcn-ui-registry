import { describe, it, expect } from "vitest";
import { parseMentionQuery, buildPillLabel, buildMentionTag } from "@/components/albus-mention-parser";

describe("parseMentionQuery", () => {
  it("returns free mode for a simple word", () => {
    expect(parseMentionQuery("okta")).toEqual({
      mode: "free",
      query: "okta",
    });
  });

  it("returns free mode for empty string", () => {
    expect(parseMentionQuery("")).toEqual({
      mode: "free",
      query: "",
    });
  });

  it("detects scoped mode from category name match", () => {
    const result = parseMentionQuery("apps");
    expect(result.mode).toBe("scoped");
    if (result.mode === "scoped") {
      expect(result.category).toBe("app");
      expect(result.attribute).toBeNull();
      expect(result.value).toBeNull();
    }
  });

  it("detects scoped mode from explicit colon", () => {
    const result = parseMentionQuery("apps:");
    expect(result.mode).toBe("scoped");
    if (result.mode === "scoped") {
      expect(result.category).toBe("app");
      expect(result.attribute).toBeNull();
      expect(result.value).toBeNull();
    }
  });

  it("parses category + attribute from colon path", () => {
    const result = parseMentionQuery("apps: status");
    expect(result.mode).toBe("scoped");
    if (result.mode === "scoped") {
      expect(result.category).toBe("app");
      expect(result.attribute).toBe("status");
      expect(result.value).toBeNull();
    }
  });

  it("parses category + attribute + value from colon path", () => {
    const result = parseMentionQuery("apps: status approved");
    expect(result.mode).toBe("scoped");
    if (result.mode === "scoped") {
      expect(result.category).toBe("app");
      expect(result.attribute).toBe("status");
      expect(result.value).toBe("approved");
    }
  });

  it("stays free mode for an unrecognized word", () => {
    expect(parseMentionQuery("cloudflare")).toEqual({
      mode: "free",
      query: "cloudflare",
    });
  });

  it("handles aliases like 'policies' → policy category", () => {
    const result = parseMentionQuery("policies");
    expect(result.mode).toBe("scoped");
    if (result.mode === "scoped") {
      expect(result.category).toBe("policy");
    }
  });

  it("handles aliases like 'identities' → identity category", () => {
    const result = parseMentionQuery("identities");
    expect(result.mode).toBe("scoped");
    if (result.mode === "scoped") {
      expect(result.category).toBe("identity");
    }
  });
});

describe("buildPillLabel", () => {
  it("returns @search for empty free query", () => {
    expect(buildPillLabel({ mode: "free", query: "" })).toBe("@search");
  });

  it("returns @query for non-empty free query", () => {
    expect(buildPillLabel({ mode: "free", query: "okta" })).toBe("@okta");
  });

  it("returns scoped label with no attribute", () => {
    expect(
      buildPillLabel({ mode: "scoped", category: "app", attribute: null, value: null, rawAttributeQuery: "" })
    ).toBe("@apps: search");
  });

  it("returns scoped label with attribute", () => {
    expect(
      buildPillLabel({ mode: "scoped", category: "app", attribute: "status", value: null, rawAttributeQuery: "status" })
    ).toBe("@apps-status: search");
  });

  it("returns terminal label with value", () => {
    expect(
      buildPillLabel({ mode: "scoped", category: "app", attribute: "status", value: "approved", rawAttributeQuery: "status approved" })
    ).toBe("@approved-apps");
  });
});

describe("buildMentionTag", () => {
  it("builds a slug from category + attribute + value", () => {
    expect(buildMentionTag("app", "status", "approved")).toBe("approved-app");
  });

  it("slugifies multi-word values", () => {
    expect(buildMentionTag("app", "status", "In Review")).toBe("in-review-app");
  });

  it("handles access-review category", () => {
    expect(buildMentionTag("access-review", "status", "active")).toBe("active-access-review");
  });
});
