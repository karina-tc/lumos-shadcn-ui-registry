import Fuse from "fuse.js";

export type MentionObjectType =
  | "app"
  | "identity"
  | "policy"
  | "knowledge"
  | "entitlement"
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
  {
    id: "app-salesforce",
    name: "Salesforce",
    tag: "salesforce",
    objectType: "app",
  },
  { id: "app-slack", name: "Slack", tag: "slack", objectType: "app" },
  { id: "app-github", name: "GitHub", tag: "github", objectType: "app" },
  { id: "app-zoom", name: "Zoom", tag: "zoom", objectType: "app" },
  { id: "app-notion", name: "Notion", tag: "notion", objectType: "app" },
  { id: "app-figma", name: "Figma", tag: "figma", objectType: "app" },
  { id: "app-jira", name: "Jira", tag: "jira", objectType: "app" },
  {
    id: "app-confluence",
    name: "Confluence",
    tag: "confluence",
    objectType: "app",
  },
  {
    id: "app-google-workspace",
    name: "Google Workspace",
    tag: "google-workspace",
    objectType: "app",
  },
  { id: "app-aws", name: "AWS", tag: "aws", objectType: "app" },
  { id: "app-datadog", name: "Datadog", tag: "datadog", objectType: "app" },
  {
    id: "app-snowflake",
    name: "Snowflake",
    tag: "snowflake",
    objectType: "app",
  },
  { id: "app-netsuite", name: "NetSuite", tag: "netsuite", objectType: "app" },
  { id: "app-workday", name: "Workday", tag: "workday", objectType: "app" },
];

const identities: MentionItem[] = [
  {
    id: "id-contractors",
    name: "Contractors",
    tag: "contractors",
    objectType: "identity",
  },
  {
    id: "id-engineers",
    name: "Engineers",
    tag: "engineers",
    objectType: "identity",
  },
  { id: "id-admins", name: "Admins", tag: "admins", objectType: "identity" },
  { id: "id-vendors", name: "Vendors", tag: "vendors", objectType: "identity" },
  {
    id: "id-employees",
    name: "Employees",
    tag: "employees",
    objectType: "identity",
  },
  {
    id: "id-design-team",
    name: "Design Team",
    tag: "design-team",
    objectType: "identity",
  },
  {
    id: "id-sales-team",
    name: "Sales Team",
    tag: "sales-team",
    objectType: "identity",
  },
  {
    id: "id-exec-team",
    name: "Executive Team",
    tag: "exec-team",
    objectType: "identity",
  },
];

const policies: MentionItem[] = [
  {
    id: "pol-access-policy",
    name: "Access policy",
    tag: "access-policy",
    objectType: "policy",
  },
  {
    id: "pol-password-policy",
    name: "Password policy",
    tag: "password-policy",
    objectType: "policy",
  },
  {
    id: "pol-mfa-policy",
    name: "MFA policy",
    tag: "mfa-policy",
    objectType: "policy",
  },
  {
    id: "pol-data-classification",
    name: "Data classification policy",
    tag: "data-classification",
    objectType: "policy",
  },
  {
    id: "pol-acceptable-use",
    name: "Acceptable use policy",
    tag: "acceptable-use",
    objectType: "policy",
  },
];

const knowledge: MentionItem[] = [
  {
    id: "kb-contractor-access-policy",
    name: "Contractor access policy",
    tag: "contractor-access-policy",
    objectType: "knowledge",
  },
  {
    id: "kb-birthright-rules",
    name: "Birthright rules",
    tag: "birthright-rules",
    objectType: "knowledge",
  },
  {
    id: "kb-sod-guidelines",
    name: "Separation of duties guidelines",
    tag: "sod-guidelines",
    objectType: "knowledge",
  },
  {
    id: "kb-offboarding-checklist",
    name: "Offboarding checklist",
    tag: "offboarding-checklist",
    objectType: "knowledge",
  },
  {
    id: "kb-risk-matrix",
    name: "Risk matrix",
    tag: "risk-matrix",
    objectType: "knowledge",
  },
  {
    id: "kb-okta-integration-guide",
    name: "Okta integration guide",
    tag: "okta-integration-guide",
    objectType: "knowledge",
  },
  {
    id: "kb-vendor-management-policy",
    name: "Vendor management policy",
    tag: "vendor-management-policy",
    objectType: "knowledge",
  },
  {
    id: "kb-access-review-playbook",
    name: "Access review playbook",
    tag: "access-review-playbook",
    objectType: "knowledge",
  },
];

const entitlements: MentionItem[] = [
  {
    id: "ent-admin-role",
    name: "Admin role",
    tag: "admin-role",
    objectType: "entitlement",
  },
  {
    id: "ent-read-only",
    name: "Read-only",
    tag: "read-only",
    objectType: "entitlement",
  },
  {
    id: "ent-editor",
    name: "Editor",
    tag: "editor",
    objectType: "entitlement",
  },
  {
    id: "ent-viewer",
    name: "Viewer",
    tag: "viewer",
    objectType: "entitlement",
  },
  {
    id: "ent-super-admin",
    name: "Super admin",
    tag: "super-admin",
    objectType: "entitlement",
  },
  {
    id: "ent-billing-admin",
    name: "Billing admin",
    tag: "billing-admin",
    objectType: "entitlement",
  },
];

const accessReviews: MentionItem[] = [
  {
    id: "ar-q1-review",
    name: "Q1 2025 access review",
    tag: "q1-2025-review",
    objectType: "access-review",
  },
  {
    id: "ar-annual-compliance",
    name: "Annual compliance review",
    tag: "annual-compliance",
    objectType: "access-review",
  },
  {
    id: "ar-contractor-review",
    name: "Contractor access review",
    tag: "contractor-review",
    objectType: "access-review",
  },
  {
    id: "ar-privileged-review",
    name: "Privileged access review",
    tag: "privileged-review",
    objectType: "access-review",
  },
];

const accessRequests: MentionItem[] = [
  {
    id: "areq-pending",
    name: "Pending approvals",
    tag: "pending-approvals",
    objectType: "access-request",
  },
  {
    id: "areq-my-requests",
    name: "My requests",
    tag: "my-requests",
    objectType: "access-request",
  },
  {
    id: "areq-team-requests",
    name: "Team requests",
    tag: "team-requests",
    objectType: "access-request",
  },
  {
    id: "areq-open-requests",
    name: "Open requests",
    tag: "open-requests",
    objectType: "access-request",
  },
];

export const mentionIndex: MentionItem[] = [
  ...apps,
  ...identities,
  ...policies,
  ...knowledge,
  ...entitlements,
  ...accessReviews,
  ...accessRequests,
];

export const groupLabels: Record<MentionObjectType, string> = {
  app: "Apps",
  identity: "Identities",
  policy: "Policies",
  knowledge: "Knowledge",
  entitlement: "Entitlements",
  "access-review": "Access Reviews",
  "access-request": "Access Requests",
};

export const groupOrder: MentionObjectType[] = [
  "app",
  "identity",
  "policy",
  "knowledge",
  "entitlement",
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
  { label: "knowledge", type: "knowledge" },
  { label: "docs", type: "knowledge" },
  { label: "entitlements", type: "entitlement" },
  { label: "entitlement", type: "entitlement" },
  { label: "permissions", type: "entitlement" },
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
  if (!q) return null;
  const results = categoryFuse.search(q);
  return results[0]?.item.type ?? null;
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

export function getMentionsByCategory(
  category: MentionObjectType,
): GroupedResults[] {
  const items = mentionIndex.filter((item) => item.objectType === category);
  if (items.length === 0) return [];
  return [{ type: category, label: groupLabels[category], items }];
}

export interface AttributeDef {
  key: string;
  label: string;
  section: "attribute" | "property";
}

export const categoryAttributes: Record<MentionObjectType, AttributeDef[]> = {
  app: [
    { key: "category", label: "Category", section: "attribute" },
    { key: "business-criticality", label: "Criticality", section: "attribute" },
    { key: "status", label: "Status", section: "attribute" },
    { key: "tags", label: "Tags", section: "attribute" },
    { key: "entitlements", label: "Entitlements", section: "property" },
  ],
  identity: [
    { key: "department", label: "Department", section: "attribute" },
    { key: "role", label: "Role", section: "attribute" },
    { key: "status", label: "Status", section: "attribute" },
  ],
  policy: [
    { key: "type", label: "Type", section: "attribute" },
    { key: "status", label: "Status", section: "attribute" },
    { key: "enforcement", label: "Enforcement", section: "attribute" },
  ],
  knowledge: [
    { key: "type", label: "Type", section: "attribute" },
    { key: "author", label: "Author", section: "attribute" },
    { key: "tags", label: "Tags", section: "attribute" },
  ],
  entitlement: [
    { key: "app", label: "App", section: "attribute" },
    { key: "type", label: "Type", section: "attribute" },
    { key: "risk-level", label: "Risk Level", section: "attribute" },
  ],
  "access-review": [
    { key: "status", label: "Status", section: "attribute" },
    { key: "reviewer", label: "Reviewer", section: "attribute" },
    { key: "scope", label: "Scope", section: "attribute" },
  ],
  "access-request": [
    { key: "status", label: "Status", section: "attribute" },
    { key: "requester", label: "Requester", section: "attribute" },
    { key: "app", label: "App", section: "attribute" },
  ],
};

export const attributeValues: Partial<Record<MentionObjectType, Record<string, string[]>>> = {
  app: {
    category: ["HR", "Finance", "Engineering", "IT", "Security", "Sales", "Marketing"],
    "business-criticality": ["Critical", "High", "Medium", "Low"],
    status: ["Approved", "Blacklisted", "Deprecated", "Discovered", "In Review", "Needs Review"],
    tags: ["SOC2", "HIPAA", "PCI", "Internal", "External", "Cloud"],
    entitlements: ["Admin role", "Read-only", "Editor", "Viewer", "Super admin", "Billing admin"],
  },
  identity: {
    department: ["Engineering", "Design", "Sales", "Marketing", "Finance", "HR", "Legal"],
    role: ["Admin", "Member", "Viewer", "Owner"],
    status: ["Active", "Inactive", "Pending", "Suspended"],
  },
  policy: {
    type: ["Access", "Password", "MFA", "Data Classification", "Acceptable Use"],
    status: ["Active", "Inactive", "Draft"],
    enforcement: ["Strict", "Advisory", "Disabled"],
  },
  knowledge: {
    type: ["Policy", "Playbook", "Guide", "Checklist", "Matrix"],
    author: ["Lumos", "Admin", "Custom"],
    tags: ["Compliance", "Security", "Onboarding", "Risk", "Access"],
  },
  entitlement: {
    app: ["Okta", "Salesforce", "GitHub", "AWS", "Google Workspace"],
    type: ["Role", "Group", "Permission"],
    "risk-level": ["Critical", "High", "Medium", "Low"],
  },
  "access-review": {
    status: ["Active", "Completed", "Draft", "Overdue"],
    reviewer: ["Admin", "Manager", "Owner"],
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
  knowledge: ["kb-contractor-access-policy", "kb-birthright-rules", "kb-risk-matrix"],
  entitlement: ["ent-admin-role", "ent-editor", "ent-read-only"],
  "access-review": ["ar-q1-review", "ar-annual-compliance", "ar-contractor-review"],
  "access-request": ["areq-pending", "areq-my-requests", "areq-open-requests"],
};

export function getPopularItems(category: MentionObjectType): MentionItem[] {
  const ids = popularItemIds[category] ?? [];
  return ids
    .map((id) => mentionIndex.find((item) => item.id === id))
    .filter((item): item is MentionItem => item !== undefined);
}
