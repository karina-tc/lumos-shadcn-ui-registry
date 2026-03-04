import Fuse from "fuse.js";

export type MentionObjectType = "app" | "knowledge" | "attribute" | "identity";

export interface MentionItem {
  id: string;
  name: string;
  tag: string;
  icon: string;
  objectType: MentionObjectType;
}

const apps: MentionItem[] = [
  { id: "app-okta", name: "Okta", tag: "okta", icon: "🔗", objectType: "app" },
  {
    id: "app-salesforce",
    name: "Salesforce",
    tag: "salesforce",
    icon: "🔗",
    objectType: "app",
  },
  {
    id: "app-slack",
    name: "Slack",
    tag: "slack",
    icon: "🔗",
    objectType: "app",
  },
  {
    id: "app-github",
    name: "GitHub",
    tag: "github",
    icon: "🔗",
    objectType: "app",
  },
  { id: "app-zoom", name: "Zoom", tag: "zoom", icon: "🔗", objectType: "app" },
  {
    id: "app-notion",
    name: "Notion",
    tag: "notion",
    icon: "🔗",
    objectType: "app",
  },
  {
    id: "app-figma",
    name: "Figma",
    tag: "figma",
    icon: "🔗",
    objectType: "app",
  },
  { id: "app-jira", name: "Jira", tag: "jira", icon: "🔗", objectType: "app" },
  {
    id: "app-confluence",
    name: "Confluence",
    tag: "confluence",
    icon: "🔗",
    objectType: "app",
  },
  {
    id: "app-google-workspace",
    name: "Google Workspace",
    tag: "google-workspace",
    icon: "🔗",
    objectType: "app",
  },
  { id: "app-aws", name: "AWS", tag: "aws", icon: "🔗", objectType: "app" },
  {
    id: "app-datadog",
    name: "Datadog",
    tag: "datadog",
    icon: "🔗",
    objectType: "app",
  },
  {
    id: "app-snowflake",
    name: "Snowflake",
    tag: "snowflake",
    icon: "🔗",
    objectType: "app",
  },
  {
    id: "app-netsuite",
    name: "NetSuite",
    tag: "netsuite",
    icon: "🔗",
    objectType: "app",
  },
  {
    id: "app-workday",
    name: "Workday",
    tag: "workday",
    icon: "🔗",
    objectType: "app",
  },
];

const knowledge: MentionItem[] = [
  {
    id: "kb-contractor-access-policy",
    name: "Contractor access policy",
    tag: "contractor-access-policy",
    icon: "📄",
    objectType: "knowledge",
  },
  {
    id: "kb-birthright-rules",
    name: "Birthright rules",
    tag: "birthright-rules",
    icon: "📄",
    objectType: "knowledge",
  },
  {
    id: "kb-sod-guidelines",
    name: "Separation of duties guidelines",
    tag: "sod-guidelines",
    icon: "📄",
    objectType: "knowledge",
  },
  {
    id: "kb-offboarding-checklist",
    name: "Offboarding checklist",
    tag: "offboarding-checklist",
    icon: "📄",
    objectType: "knowledge",
  },
  {
    id: "kb-risk-matrix",
    name: "Risk matrix",
    tag: "risk-matrix",
    icon: "📄",
    objectType: "knowledge",
  },
  {
    id: "kb-okta-integration-guide",
    name: "Okta integration guide",
    tag: "okta-integration-guide",
    icon: "📄",
    objectType: "knowledge",
  },
  {
    id: "kb-vendor-management-policy",
    name: "Vendor management policy",
    tag: "vendor-management-policy",
    icon: "📄",
    objectType: "knowledge",
  },
  {
    id: "kb-access-review-playbook",
    name: "Access review playbook",
    tag: "access-review-playbook",
    icon: "📄",
    objectType: "knowledge",
  },
];

const attributes: MentionItem[] = [
  {
    id: "attr-active",
    name: "Active apps",
    tag: "active-apps",
    icon: "🏷️",
    objectType: "attribute",
  },
  {
    id: "attr-inactive",
    name: "Inactive apps",
    tag: "inactive-apps",
    icon: "🏷️",
    objectType: "attribute",
  },
  {
    id: "attr-deprecated",
    name: "Deprecated apps",
    tag: "deprecated-apps",
    icon: "🏷️",
    objectType: "attribute",
  },
  {
    id: "attr-missing-owner",
    name: "Missing owner",
    tag: "missing-owner",
    icon: "🏷️",
    objectType: "attribute",
  },
  {
    id: "attr-unassigned",
    name: "Unassigned accounts",
    tag: "unassigned",
    icon: "🏷️",
    objectType: "attribute",
  },
];

const identities: MentionItem[] = [
  {
    id: "id-contractors",
    name: "Contractors",
    tag: "contractors",
    icon: "👥",
    objectType: "identity",
  },
  {
    id: "id-engineers",
    name: "Engineers",
    tag: "engineers",
    icon: "👥",
    objectType: "identity",
  },
  {
    id: "id-admins",
    name: "Admins",
    tag: "admins",
    icon: "👥",
    objectType: "identity",
  },
  {
    id: "id-vendors",
    name: "Vendors",
    tag: "vendors",
    icon: "👥",
    objectType: "identity",
  },
  {
    id: "id-employees",
    name: "Employees",
    tag: "employees",
    icon: "👥",
    objectType: "identity",
  },
  {
    id: "id-design-team",
    name: "Design Team",
    tag: "design-team",
    icon: "👥",
    objectType: "identity",
  },
  {
    id: "id-sales-team",
    name: "Sales Team",
    tag: "sales-team",
    icon: "👥",
    objectType: "identity",
  },
  {
    id: "id-exec-team",
    name: "Executive Team",
    tag: "exec-team",
    icon: "👥",
    objectType: "identity",
  },
];

export const mentionIndex: MentionItem[] = [
  ...apps,
  ...knowledge,
  ...attributes,
  ...identities,
];

export const groupLabels: Record<MentionObjectType, string> = {
  app: "Apps",
  knowledge: "Knowledge",
  attribute: "Attributes",
  identity: "Identities",
};

export const groupOrder: MentionObjectType[] = [
  "app",
  "knowledge",
  "attribute",
  "identity",
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
  if (!q) return getDefaultMentions();

  const results = fuse.search(q, { limit: 10 });

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

export function getDefaultMentions(): GroupedResults[] {
  const groups: GroupedResults[] = [];
  for (const type of groupOrder) {
    const items = mentionIndex
      .filter((item) => item.objectType === type)
      .slice(0, 3);
    if (items.length > 0) {
      groups.push({ type, label: groupLabels[type], items });
    }
  }
  return groups;
}
