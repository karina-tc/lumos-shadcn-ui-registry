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
