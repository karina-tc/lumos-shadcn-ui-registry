# Lumos Admin Nav Inventory
Date: 2026-02-25
Source: /Users/karina.tovar/Desktop/lumos/frontend/src/config/navbar/constants.tsx

## PRODUCTS
| Label | Path | Layout |
|-------|------|--------|
| Ask Albus | /ai-assistant | Chat/conversation interface |
| Analytics | /analytics | Dashboard (charts, tabbed reports) |
| AppStore (admin) | /admin-app-store | Table grid |
| Access Reviews | /access_reviews | Table grid |
| Onboarding | /user_onboardings | Table grid |
| Movers | /user_movers | Table grid |
| Offboarding | /user_offboardings | Table grid |

## INVENTORY
| Label | Path | Layout |
|-------|------|--------|
| Apps | /apps | Table grid (tabs: apps, spend, ignored) |
| Identities | /identities | Table grid |
| Access Policies | /onboarding_rules | Table grid |
| Accounts | /accounts | Table grid (tabs: all, inactive, terminated, unmatched) |
| Managed Agreements | /vendors | Table grid |
| Spend Records | /spend_records | Table grid |
| Knowledge Hub | /knowledge-hub | Content hub |

## WORKSPACE
| Label | Path | Layout |
|-------|------|--------|
| Activity Log | /activity_log | Table grid |
| Integrations | /integrations | Card panels (grouped by category) |
| Settings | /settings/:page | Settings form pages |
| Tasks | /admin-tasks | Table grid |

## Blocks to build (grouped by layout pattern)
### Table index (standard)
- lumos-apps-index
- lumos-identities-index
- lumos-accounts-index
- lumos-access-reviews-index
- lumos-onboarding-index
- lumos-offboarding-index
- lumos-activity-log-index
- lumos-tasks-index
- lumos-access-policies-index
- lumos-spend-records-index

### Special layouts
- lumos-analytics-index (dashboard with charts)
- lumos-integrations-index (card grid)
- lumos-settings-index (form/settings panel)
