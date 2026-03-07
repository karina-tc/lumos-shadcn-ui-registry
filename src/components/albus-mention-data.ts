import Fuse from "fuse.js";

export type MentionObjectType =
  | "app"
  | "identity"
  | "policy"
  | "entitlement"
  | "reports"
  | "access-review"
  | "access-request";

export interface MentionItem {
  id: string;
  name: string;
  tag: string;
  objectType: MentionObjectType;
}

const apps: MentionItem[] = [
  { id: "app-okta", name: "Okta", tag: "okta", objectType: "app" },
  { id: "app-salesforce", name: "Salesforce", tag: "salesforce", objectType: "app" },
  { id: "app-slack", name: "Slack", tag: "slack", objectType: "app" },
  { id: "app-github", name: "GitHub", tag: "github", objectType: "app" },
  { id: "app-zoom", name: "Zoom", tag: "zoom", objectType: "app" },
  { id: "app-notion", name: "Notion", tag: "notion", objectType: "app" },
  { id: "app-figma", name: "Figma", tag: "figma", objectType: "app" },
  { id: "app-jira", name: "Jira", tag: "jira", objectType: "app" },
  { id: "app-confluence", name: "Confluence", tag: "confluence", objectType: "app" },
  { id: "app-google-workspace", name: "Google Workspace", tag: "google-workspace", objectType: "app" },
  { id: "app-aws", name: "AWS", tag: "aws", objectType: "app" },
  { id: "app-aws-prod", name: "AWS (Production)", tag: "aws-production", objectType: "app" },
  { id: "app-aws-dev", name: "AWS (Development)", tag: "aws-development", objectType: "app" },
  { id: "app-datadog", name: "Datadog", tag: "datadog", objectType: "app" },
  { id: "app-datadog-apm", name: "Datadog APM", tag: "datadog-apm", objectType: "app" },
  { id: "app-datadog-logs", name: "Datadog Logs", tag: "datadog-logs", objectType: "app" },
  { id: "app-thetadog", name: "ThetaDog", tag: "thetadog", objectType: "app" },
  { id: "app-thetadog-analytics", name: "ThetaDog Analytics", tag: "thetadog-analytics", objectType: "app" },
  { id: "app-thetadog-security", name: "ThetaDog Security", tag: "thetadog-security", objectType: "app" },
  { id: "app-snowflake", name: "Snowflake", tag: "snowflake", objectType: "app" },
  { id: "app-netsuite", name: "NetSuite", tag: "netsuite", objectType: "app" },
  { id: "app-workday", name: "Workday", tag: "workday", objectType: "app" },
];

const identities: MentionItem[] = [
  { id: "id-contractors", name: "Contractors", tag: "contractors", objectType: "identity" },
  { id: "id-engineers", name: "Engineers", tag: "engineers", objectType: "identity" },
  { id: "id-admins", name: "Admins", tag: "admins", objectType: "identity" },
  { id: "id-vendors", name: "Vendors", tag: "vendors", objectType: "identity" },
  { id: "id-employees", name: "Employees", tag: "employees", objectType: "identity" },
  { id: "id-design-team", name: "Design Team", tag: "design-team", objectType: "identity" },
  { id: "id-sales-team", name: "Sales Team", tag: "sales-team", objectType: "identity" },
  { id: "id-exec-team", name: "Executive Team", tag: "exec-team", objectType: "identity" },
];

const policies: MentionItem[] = [
  { id: "pol-access-policy", name: "Access policy", tag: "access-policy", objectType: "policy" },
  { id: "pol-password-policy", name: "Password policy", tag: "password-policy", objectType: "policy" },
  { id: "pol-mfa-policy", name: "MFA policy", tag: "mfa-policy", objectType: "policy" },
  { id: "pol-data-classification", name: "Data classification policy", tag: "data-classification", objectType: "policy" },
  { id: "pol-acceptable-use", name: "Acceptable use policy", tag: "acceptable-use", objectType: "policy" },
];

const reports: MentionItem[] = [
  { id: "rep-contractor-access-policy", name: "Contractor access policy", tag: "contractor-access-policy", objectType: "reports" },
  { id: "rep-birthright-rules", name: "Birthright rules", tag: "birthright-rules", objectType: "reports" },
  { id: "rep-sod-guidelines", name: "Separation of duties guidelines", tag: "sod-guidelines", objectType: "reports" },
  { id: "rep-offboarding-checklist", name: "Offboarding checklist", tag: "offboarding-checklist", objectType: "reports" },
  { id: "rep-risk-matrix", name: "Risk matrix", tag: "risk-matrix", objectType: "reports" },
  { id: "rep-okta-integration-guide", name: "Okta integration guide", tag: "okta-integration-guide", objectType: "reports" },
  { id: "rep-vendor-management-policy", name: "Vendor management policy", tag: "vendor-management-policy", objectType: "reports" },
  { id: "rep-access-review-playbook", name: "Access review playbook", tag: "access-review-playbook", objectType: "reports" },
];

const entitlements: MentionItem[] = [
  { id: "ent-super-admin", name: "Super Admin", tag: "super-admin", objectType: "entitlement" },
  { id: "ent-standard-user", name: "Standard User", tag: "standard-user", objectType: "entitlement" },
  { id: "ent-read-only", name: "Read Only", tag: "read-only", objectType: "entitlement" },
  { id: "ent-billing-admin", name: "Billing Admin", tag: "billing-admin", objectType: "entitlement" },
  { id: "ent-security-admin", name: "Security Admin", tag: "security-admin", objectType: "entitlement" },
  { id: "ent-power-user", name: "Power User", tag: "power-user", objectType: "entitlement" },
  { id: "ent-devops-engineer", name: "DevOps Engineer", tag: "devops-engineer", objectType: "entitlement" },
  { id: "ent-finance-viewer", name: "Finance Viewer", tag: "finance-viewer", objectType: "entitlement" },
  { id: "ent-group-admin", name: "Group Admin", tag: "group-admin", objectType: "entitlement" },
  { id: "ent-help-desk", name: "Help Desk Admin", tag: "help-desk-admin", objectType: "entitlement" },
];

const accessReviews: MentionItem[] = [
  { id: "ar-q1-review", name: "Q1 2025 access review", tag: "q1-2025-review", objectType: "access-review" },
  { id: "ar-annual-compliance", name: "Annual compliance review", tag: "annual-compliance", objectType: "access-review" },
  { id: "ar-contractor-review", name: "Contractor access review", tag: "contractor-review", objectType: "access-review" },
  { id: "ar-privileged-review", name: "Privileged access review", tag: "privileged-review", objectType: "access-review" },
];

const accessRequests: MentionItem[] = [
  { id: "areq-pending", name: "Pending approvals", tag: "pending-approvals", objectType: "access-request" },
  { id: "areq-my-requests", name: "My requests", tag: "my-requests", objectType: "access-request" },
  { id: "areq-team-requests", name: "Team requests", tag: "team-requests", objectType: "access-request" },
  { id: "areq-open-requests", name: "Open requests", tag: "open-requests", objectType: "access-request" },
];

export const mentionIndex: MentionItem[] = [
  ...apps,
  ...identities,
  ...policies,
  ...entitlements,
  ...reports,
  ...accessReviews,
  ...accessRequests,
];

export const groupLabels: Record<MentionObjectType, string> = {
  app: "Apps",
  identity: "Identities",
  policy: "Policies",
  entitlement: "Entitlements",
  reports: "Reports",
  "access-review": "Access Reviews",
  "access-request": "Access Requests",
};

export const groupOrder: MentionObjectType[] = [
  "app",
  "identity",
  "policy",
  "entitlement",
  "reports",
  "access-review",
  "access-request",
];

const fuse = new Fuse(mentionIndex, {
  keys: [
    { name: "name", weight: 2 },
    { name: "tag", weight: 1 },
  ],
  threshold: 0.4,
  includeScore: true,
});

const categoryAliasData: Array<{ label: string; type: MentionObjectType }> = [
  { label: "apps", type: "app" },
  { label: "app", type: "app" },
  { label: "applications", type: "app" },
  { label: "identities", type: "identity" },
  { label: "identity", type: "identity" },
  { label: "users", type: "identity" },
  { label: "people", type: "identity" },
  { label: "policies", type: "policy" },
  { label: "policy", type: "policy" },
  { label: "entitlements", type: "entitlement" },
  { label: "entitlement", type: "entitlement" },
  { label: "permissions", type: "entitlement" },
  { label: "roles", type: "entitlement" },
  { label: "reports", type: "reports" },
  { label: "report", type: "reports" },
  { label: "knowledge", type: "reports" },
  { label: "docs", type: "reports" },
  { label: "documents", type: "reports" },
  { label: "reviews", type: "access-review" },
  { label: "access reviews", type: "access-review" },
  { label: "requests", type: "access-request" },
  { label: "access requests", type: "access-request" },
];

const categoryFuse = new Fuse(categoryAliasData, {
  keys: ["label"],
  threshold: 0.25,
});

export function matchCategory(query: string): MentionObjectType | null {
  const q = query.trim().toLowerCase();
  if (q.length < 3) return null;
  const results = categoryFuse.search(q);
  return results[0]?.item.type ?? null;
}

export interface AttributeDef {
  key: string;
  label: string;
  section: "attribute" | "property";
}

export const categoryAttributes: Record<MentionObjectType, AttributeDef[]> = {
  app: [
    { key: "category", label: "Category", section: "attribute" },
    { key: "risk-level", label: "Risk Level", section: "attribute" },
    { key: "status", label: "Status", section: "attribute" },
  ],
  identity: [
    { key: "status", label: "Status", section: "attribute" },
    { key: "identity-type", label: "Identity Type", section: "attribute" },
    { key: "team", label: "Team", section: "attribute" },
  ],
  policy: [
    { key: "risk-level", label: "Risk Level", section: "attribute" },
    { key: "business-process-area", label: "Business Process", section: "attribute" },
  ],
  entitlement: [
    { key: "type", label: "Type", section: "attribute" },
    { key: "app", label: "App", section: "attribute" },
    { key: "access-level", label: "Access Level", section: "attribute" },
  ],
  reports: [
    { key: "type", label: "Type", section: "attribute" },
    { key: "author", label: "Author", section: "attribute" },
    { key: "tags", label: "Tags", section: "attribute" },
  ],
  "access-review": [
    { key: "status", label: "Status", section: "attribute" },
    { key: "scope", label: "Scope", section: "attribute" },
  ],
  "access-request": [
    { key: "status", label: "Status", section: "attribute" },
    { key: "requester", label: "Requester", section: "attribute" },
    { key: "app", label: "App", section: "attribute" },
  ],
};

export const attributeValues: Record<MentionObjectType, Record<string, string[]>> = {
  app: {
    category: [
      "Accounting & Finance",
      "Marketing & Analytics",
      "Content & Social Media",
      "Sales & Support",
      "Design & Creativity",
      "IT & Security",
      "Developers",
      "HR & Learning",
      "Office & Legal",
      "Communication",
      "Collaboration",
      "Commerce & Marketplaces",
      "Internal",
      "Other",
    ],
    "risk-level": ["Very High", "High", "Medium", "Low", "Very Low", "Unknown"],
    status: ["Approved", "Blocklisted", "Deprecated", "Discovered", "In Review", "Needs Review"],
  },
  identity: {
    status: ["Active", "Staged", "Suspended", "Inactive"],
    "identity-type": ["Full-time", "Part-time", "Intern", "Contractor", "Freelance", "Service Account"],
    team: ["Engineering", "Design", "Sales", "Marketing", "Finance", "HR", "Legal"],
  },
  policy: {
    "risk-level": ["High", "Medium", "Low"],
    "business-process-area": ["Finance", "HR", "IT", "Legal", "Operations", "Security"],
  },
  entitlement: {
    type: ["Role", "Group", "Permission", "License"],
    app: ["Okta", "AWS", "Salesforce", "GitHub", "Datadog", "Snowflake"],
    "access-level": ["Full Access", "Read/Write", "Read Only", "Admin", "Custom"],
  },
  reports: {
    type: ["Policy", "Playbook", "Guide", "Checklist", "Matrix"],
    author: ["Lumos", "Admin", "Custom"],
    tags: ["Compliance", "Security", "Onboarding", "Risk", "Access"],
  },
  "access-review": {
    status: ["In Preparation", "In Progress", "Completed", "Scheduled", "Deleted"],
    scope: ["All Users", "Contractors", "Employees", "Vendors"],
  },
  "access-request": {
    status: ["Pending", "Approved", "Rejected", "Expired"],
    requester: ["Employee", "Contractor", "Any"],
    app: ["Okta", "Salesforce", "GitHub", "AWS"],
  },
};

export const popularItemIds: Record<MentionObjectType, string[]> = {
  app: ["app-aws", "app-google-workspace", "app-okta"],
  identity: ["id-employees", "id-engineers", "id-contractors"],
  policy: ["pol-access-policy", "pol-mfa-policy", "pol-password-policy"],
  entitlement: ["ent-super-admin", "ent-standard-user", "ent-read-only"],
  reports: ["rep-contractor-access-policy", "rep-birthright-rules", "rep-risk-matrix"],
  "access-review": ["ar-q1-review", "ar-annual-compliance", "ar-contractor-review"],
  "access-request": ["areq-pending", "areq-my-requests", "areq-open-requests"],
};

export function getPopularItems(category: MentionObjectType): MentionItem[] {
  const ids = popularItemIds[category];
  return ids
    .map((id) => mentionIndex.find((item) => item.id === id))
    .filter((item): item is MentionItem => item !== undefined);
}

export interface GroupedResults {
  type: MentionObjectType;
  label: string;
  items: MentionItem[];
}

export function searchMentions(query: string): GroupedResults[] {
  const q = query.trim();
  if (!q) return [];

  const results = fuse.search(q, { limit: 12 });

  const groups: GroupedResults[] = [];
  for (const type of groupOrder) {
    const items = results
      .filter((r) => r.item.objectType === type)
      .map((r) => r.item);
    if (items.length > 0) {
      groups.push({ type, label: groupLabels[type], items });
    }
  }
  return groups;
}

export function getMentionsByCategory(category: MentionObjectType): GroupedResults[] {
  const items = mentionIndex.filter((item) => item.objectType === category);
  if (items.length === 0) return [];
  return [{ type: category, label: groupLabels[category], items }];
}

// ---------------------------------------------------------------------------
// Attribute matching helpers
// ---------------------------------------------------------------------------

const attributeFuseCache: Partial<Record<MentionObjectType, Fuse<AttributeDef>>> = {};

export function matchAttribute(category: MentionObjectType, query: string): AttributeDef | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  const attrs = categoryAttributes[category];
  if (!attrs?.length) return null;
  if (!attributeFuseCache[category]) {
    attributeFuseCache[category] = new Fuse(attrs, { keys: ["key", "label"], threshold: 0.3 });
  }
  const results = attributeFuseCache[category]!.search(q);
  return results[0]?.item ?? null;
}

export function filterAttributeValues(
  category: MentionObjectType,
  attrKey: string,
  query: string,
): string[] {
  const values = attributeValues[category]?.[attrKey] ?? [];
  if (!query.trim()) return values;
  const f = new Fuse(values, { threshold: 0.4 });
  return f.search(query).map((r) => r.item);
}

// Per-category Fuse instances for item search (built lazily)
const categoryItemFuseCache: Partial<Record<MentionObjectType, Fuse<MentionItem>>> = {};

export function searchInCategory(category: MentionObjectType, query: string): MentionItem[] {
  const q = query.trim();
  if (!q) return getPopularItems(category);
  if (!categoryItemFuseCache[category]) {
    const items = mentionIndex.filter((i) => i.objectType === category);
    categoryItemFuseCache[category] = new Fuse(items, {
      keys: [{ name: "name", weight: 2 }, { name: "tag", weight: 1 }],
      threshold: 0.4,
    });
  }
  return categoryItemFuseCache[category]!.search(q).map((r) => r.item);
}
