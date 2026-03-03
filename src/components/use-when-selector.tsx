"use client"

import { useState, useMemo } from "react"
import { ChevronRight, ChevronDown, Search, Check, RotateCcw } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

// Types
export interface UseWhenSelection {
  globalContext: boolean
  useCases: string[]
  productAreas: string[]
  apps: string[]
  entitlements: string[]
}

interface UseWhenSelectorProps {
  value: UseWhenSelection
  onChange: (value: UseWhenSelection) => void
}

// Data
const USE_CASES = [
  { id: "anomaly-detection", label: "Anomaly Detection" },
  { id: "cost-savings", label: "Cost Savings" },
  { id: "risk-analysis", label: "Risk Analysis" },
]

const PRODUCT_AREAS = [
  { id: "albus", label: "Albus", description: "Applies to conversations and analyses in Albus" },
  { id: "access-requests", label: "Access Requests", description: "Applies to app requests and approvals in AppStore" },
  { id: "access-reviews", label: "Access Reviews", description: "Applies to review decisions and suggestions" },
]

const APPS = [
  { id: "asana", label: "Asana", icon: "A", color: "#F06A6A" },
  { id: "asana-deprecated", label: "Asana (Deprecated)", icon: "A", color: "#F06A6A" },
  { id: "atlassian", label: "Atlassian", icon: "A", color: "#0052CC" },
  { id: "aws", label: "AWS", icon: "aws", color: "#FF9900" },
  { id: "aws-prod", label: "AWS (Prod)", icon: "aws", color: "#FF9900" },
  { id: "bitbucket", label: "Bitbucket", icon: "B", color: "#0052CC" },
  { id: "github", label: "Github", icon: "G", color: "#24292F" },
  { id: "google", label: "Google Workspace", icon: "G", color: "#4285F4" },
  { id: "slack", label: "Slack", icon: "S", color: "#4A154B" },
]

const ENTITLEMENTS = [
  // Groups
  { id: "ent-1", label: "Finance-Team", group: "groups" },
  { id: "ent-2", label: "Engineering-All", group: "groups" },
  { id: "ent-3", label: "HR-Managers", group: "groups" },
  { id: "ent-4", label: "IT-Support", group: "groups" },
  { id: "ent-5", label: "Slack-Billing-Users", group: "groups" },
  // Roles
  { id: "ent-6", label: "Read-Only Analyst", group: "roles" },
  { id: "ent-7", label: "Billing Administrator", group: "roles" },
  { id: "ent-8", label: "HR Manager", group: "roles" },
  { id: "ent-9", label: "Application Owner", group: "roles" },
  { id: "ent-10", label: "Security Auditor", group: "roles" },
  // Permissions
  { id: "ent-11", label: "View invoices", group: "permissions" },
  { id: "ent-12", label: "Create users", group: "permissions" },
  { id: "ent-13", label: "Edit payroll data", group: "permissions" },
  { id: "ent-14", label: "Approve purchase requests", group: "permissions" },
  { id: "ent-15", label: "Delete integrations", group: "permissions" },
  // Resources
  { id: "ent-16", label: "Payroll folder", group: "resources" },
  { id: "ent-17", label: "AWS production account", group: "resources" },
  { id: "ent-18", label: "GitHub repository", group: "resources" },
  { id: "ent-19", label: "Salesforce org", group: "resources" },
  { id: "ent-20", label: "Jira project", group: "resources" },
]

type MenuType = "main" | "use-case" | "product-areas" | "apps" | "entitlements"

export function UseWhenSelector({ value, onChange }: UseWhenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<MenuType>("main")
  const [appSearch, setAppSearch] = useState("")
  const [entitlementSearch, setEntitlementSearch] = useState("")
  const [entitlementFilter, setEntitlementFilter] = useState("all")

  // Filtered apps
  const filteredApps = useMemo(() => {
    if (!appSearch) return APPS
    return APPS.filter((app) =>
      app.label.toLowerCase().includes(appSearch.toLowerCase())
    )
  }, [appSearch])

  // Filtered entitlements
  const filteredEntitlements = useMemo(() => {
    let filtered = ENTITLEMENTS
    if (entitlementFilter !== "all") {
      filtered = filtered.filter((e) => e.group === entitlementFilter)
    }
    if (entitlementSearch) {
      filtered = filtered.filter((e) =>
        e.label.toLowerCase().includes(entitlementSearch.toLowerCase())
      )
    }
    return filtered
  }, [entitlementFilter, entitlementSearch])

  // Get all selected items for display
  const selectedItems = useMemo(() => {
    const items: { label: string; color?: string }[] = []
    
    if (value.globalContext) {
      items.push({ label: "Global Context" })
    }
    
    value.useCases.forEach((id) => {
      const item = USE_CASES.find((uc) => uc.id === id)
      if (item) items.push({ label: item.label })
    })
    
    value.productAreas.forEach((id) => {
      const item = PRODUCT_AREAS.find((pa) => pa.id === id)
      if (item) items.push({ label: item.label })
    })
    
    value.apps.forEach((id) => {
      const item = APPS.find((app) => app.id === id)
      if (item) items.push({ label: item.label })
    })
    
    value.entitlements.forEach((id) => {
      const item = ENTITLEMENTS.find((e) => e.id === id)
      if (item) items.push({ label: item.label })
    })
    
    return items
  }, [value])

  // Check if anything is selected
  const hasAnySelection = value.globalContext || 
    value.useCases.length > 0 || 
    value.productAreas.length > 0 || 
    value.apps.length > 0 || 
    value.entitlements.length > 0

  // Generate summary JSX with bold selections
  const summaryText = useMemo(() => {
    // Get labels for selected items
    const useCaseLabels = value.useCases.map(id => USE_CASES.find(uc => uc.id === id)?.label).filter(Boolean) as string[]
    const productAreaLabels = value.productAreas.map(id => PRODUCT_AREAS.find(pa => pa.id === id)?.label).filter(Boolean) as string[]
    const appLabels = value.apps.map(id => APPS.find(app => app.id === id)?.label).filter(Boolean) as string[]
    const entitlementLabels = value.entitlements.map(id => ENTITLEMENTS.find(e => e.id === id)?.label).filter(Boolean) as string[]

    // Build apps element
    const appsElement = appLabels.length > 0 
      ? <>specific apps (<span className="font-semibold">{appLabels.join(", ")}</span>)</>
      : <>all apps</>
    
    // Build entitlements element
    const entitlementsElement = entitlementLabels.length > 0 
      ? <>specific entitlements (<span className="font-semibold">{entitlementLabels.join(", ")}</span>)</>
      : <>all entitlements</>

    // If use cases or product areas are selected
    const contextLabels = [...useCaseLabels, ...productAreaLabels]
    if (contextLabels.length > 0) {
      if (appLabels.length > 0) {
        return <>Only in <span className="font-semibold">{contextLabels.join(", ")}</span> for {appsElement}</>
      }
      return <>Only in <span className="font-semibold">{contextLabels.join(", ")}</span></>
    }

    // Default: Global context selected
    if (value.globalContext) {
      return <>Everywhere in Lumos</>
    }

    // Specific apps selected but no context
    return <>Everywhere for {appsElement}</>

  }, [value])

  // Toggle handlers
  const toggleGlobalContext = () => {
    if (!value.globalContext) {
      // When selecting Global Context, clear Use Case and Product Areas
      onChange({ 
        ...value, 
        globalContext: true,
        useCases: [],
        productAreas: []
      })
    } else {
      onChange({ ...value, globalContext: false })
    }
  }

  const toggleUseCase = (id: string) => {
    const newUseCases = value.useCases.includes(id)
      ? value.useCases.filter((uc) => uc !== id)
      : [...value.useCases, id]
    // Deselect Global Context when selecting a Use Case
    onChange({ ...value, useCases: newUseCases, globalContext: newUseCases.length > 0 ? false : value.globalContext })
  }

  const toggleProductArea = (id: string) => {
    const newProductAreas = value.productAreas.includes(id)
      ? value.productAreas.filter((pa) => pa !== id)
      : [...value.productAreas, id]
    // Deselect Global Context when selecting a Product Area
    onChange({ ...value, productAreas: newProductAreas, globalContext: newProductAreas.length > 0 ? false : value.globalContext })
  }

  const toggleApp = (id: string) => {
    const newApps = value.apps.includes(id)
      ? value.apps.filter((app) => app !== id)
      : [...value.apps, id]
    // Deselect Global Context when any specific app is selected
    onChange({ ...value, apps: newApps, globalContext: newApps.length > 0 ? false : value.globalContext })
  }

  const toggleEntitlement = (id: string) => {
    const newEntitlements = value.entitlements.includes(id)
      ? value.entitlements.filter((e) => e !== id)
      : [...value.entitlements, id]
    onChange({ ...value, entitlements: newEntitlements })
  }

  // Check if menu item has selections
  const hasUseCaseSelections = value.useCases.length > 0
  const hasProductAreaSelections = value.productAreas.length > 0
  const hasAppSelections = value.apps.length > 0
  const hasEntitlementSelections = value.entitlements.length > 0

  return (
    <div className="flex flex-col gap-2 w-full">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "w-full flex items-center gap-2 h-10 px-3 text-left border rounded-full bg-white transition-all duration-200",
              isOpen
                ? "border-[#FE6519] ring-2 ring-[#FED0BA]"
                : "border-[#D3D6DE] hover:border-[#999]"
            )}
          >
            <span className="text-sm text-[#999]">Select from options</span>
            <ChevronDown className="h-4 w-4 text-[#666] flex-shrink-0 ml-auto" />
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="p-0 border-[#E5E7EB] shadow-lg rounded-xl overflow-hidden"
          align="start"
          sideOffset={4}
          style={{ width: "var(--radix-popover-trigger-width)" }}
        >
          {activeMenu === "main" && (
            <MainMenu
              globalContext={value.globalContext}
              hasUseCaseSelections={hasUseCaseSelections}
              hasProductAreaSelections={hasProductAreaSelections}
              hasAppSelections={hasAppSelections}
              hasEntitlementSelections={hasEntitlementSelections}
              onToggleGlobalContext={toggleGlobalContext}
              onNavigate={setActiveMenu}
              onClearAll={() => onChange({
                globalContext: true,
                useCases: [],
                productAreas: [],
                apps: [],
                entitlements: [],
              })}
            />
          )}

          {activeMenu === "use-case" && (
            <SubmenuWithCheckboxes
              title="Use Case"
              items={USE_CASES}
              selectedIds={value.useCases}
              onToggle={toggleUseCase}
              onClearAll={() => onChange({ ...value, useCases: [] })}
              onBack={() => setActiveMenu("main")}
            />
          )}

          {activeMenu === "product-areas" && (
            <SubmenuWithCheckboxes
              title="Product Areas"
              items={PRODUCT_AREAS}
              selectedIds={value.productAreas}
              onToggle={toggleProductArea}
              onClearAll={() => onChange({ ...value, productAreas: [] })}
              onBack={() => setActiveMenu("main")}
            />
          )}

          {activeMenu === "apps" && (
            <AppsSubmenu
              apps={filteredApps}
              selectedIds={value.apps}
              search={appSearch}
              onSearchChange={setAppSearch}
              onToggle={toggleApp}
              onClearAll={() => onChange({ ...value, apps: [] })}
              onBack={() => {
                setActiveMenu("main")
                setAppSearch("")
              }}
            />
          )}

          {activeMenu === "entitlements" && (
            <EntitlementsSubmenu
              entitlements={filteredEntitlements}
              selectedIds={value.entitlements}
              search={entitlementSearch}
              filter={entitlementFilter}
              onSearchChange={setEntitlementSearch}
              onFilterChange={setEntitlementFilter}
              onToggle={toggleEntitlement}
              onClearAll={() => onChange({ ...value, entitlements: [] })}
              onBack={() => {
                setActiveMenu("main")
                setEntitlementSearch("")
                setEntitlementFilter("all")
              }}
            />
          )}
        </PopoverContent>
      </Popover>

      {/* Summary Box */}
      <div className="px-3 bg-[#F7F8FA] border border-[#E5E7EB] border-solid border-t-0 border-b-0 border-r-0 rounded-none bg-background ml-1 py-1 border-l-2 border-chart-1 font-normal text-sm text-left">
        <p className="text-sm text-[#1a1a1a]">{summaryText}</p>
      </div>
    </div>
  )
}

// Main Menu Component
interface MainMenuProps {
  globalContext: boolean
  hasUseCaseSelections: boolean
  hasProductAreaSelections: boolean
  hasAppSelections: boolean
  hasEntitlementSelections: boolean
  onToggleGlobalContext: () => void
  onNavigate: (menu: MenuType) => void
  onClearAll: () => void
}

function MainMenu({
  globalContext,
  hasUseCaseSelections,
  hasProductAreaSelections,
  hasAppSelections,
  hasEntitlementSelections,
  onToggleGlobalContext,
  onNavigate,
  onClearAll,
}: MainMenuProps) {
  const globalDisabled = hasAppSelections
  const hasAnyNonGlobalSelection =
    hasUseCaseSelections || hasProductAreaSelections || hasAppSelections || hasEntitlementSelections

  return (
    <div className="py-1">
      {/* Global Context - No submenu */}
      <button
        type="button"
        onClick={globalDisabled ? undefined : onToggleGlobalContext}
        disabled={globalDisabled}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2.5 transition-colors",
          globalDisabled
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-[#F5F5F5]"
        )}
      >
        <div className="flex flex-col items-start">
          <span className="text-sm text-[#1a1a1a]">Global Context</span>
          <span className="text-xs text-[#999]">
            {globalDisabled ? "Unavailable when specific apps are selected" : "Everywhere in Lumos"}
          </span>
        </div>
        {globalContext && !globalDisabled && (
          <Check className="h-4 w-4 text-[#FE6519]" />
        )}
      </button>

      {/* Use Case */}
      

      {/* Product Areas */}
      <button
        type="button"
        onClick={() => onNavigate("product-areas")}
        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-[#F5F5F5] transition-colors"
      >
        <div className="flex flex-col items-start">
          <span className="text-sm text-[#1a1a1a]">Product Areas</span>
          <span className="text-xs text-[#999]">Selected Lumos products</span>
        </div>
        <div className="flex items-center gap-2">
          {hasProductAreaSelections && (
            <span className="w-2 h-2 rounded-full bg-[#FE6519]" />
          )}
          <ChevronRight className="h-4 w-4 text-[#999]" />
        </div>
      </button>

      {/* Specific Apps */}
      <button
        type="button"
        onClick={() => onNavigate("apps")}
        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-[#F5F5F5] transition-colors"
      >
        <div className="flex flex-col items-start">
          <span className="text-sm text-[#1a1a1a]">Specific Apps</span>
          <span className="text-xs text-[#999]">Selected apps</span>
        </div>
        <div className="flex items-center gap-2">
          {hasAppSelections && (
            <span className="w-2 h-2 rounded-full bg-[#FE6519]" />
          )}
          <ChevronRight className="h-4 w-4 text-[#999]" />
        </div>
      </button>

      {/* Specific Entitlements */}

      {/* Clear All Footer */}
      {hasAnyNonGlobalSelection && (
        <div className="border-t border-[#EFF1F3] px-3 py-2">
          <button
            type="button"
            onClick={onClearAll}
            className="flex items-center gap-1.5 text-[#FE6519] hover:text-[#e5581a] transition-colors text-sm font-medium text-muted-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear All Selections
          </button>
        </div>
      )}
    </div>
  )
}

// Submenu with Checkboxes
interface SubmenuWithCheckboxesProps {
  title: string
  items: { id: string; label: string; description?: string }[]
  selectedIds: string[]
  onToggle: (id: string) => void
  onClearAll: () => void
  onBack: () => void
}

function SubmenuWithCheckboxes({
  title,
  items,
  selectedIds,
  onToggle,
  onClearAll,
  onBack,
}: SubmenuWithCheckboxesProps) {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#EFF1F3]">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-2.5 hover:bg-[#F5F5F5] transition-colors"
        >
          <ChevronRight className="h-4 w-4 text-[#999] rotate-180" />
          <span className="text-sm font-medium text-[#1a1a1a]">{title}</span>
        </button>
        {selectedIds.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="px-3 py-2.5 text-[#FE6519] hover:text-[#e5581a] transition-colors text-sm font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Items */}
      <div className="py-1">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onToggle(item.id)}
            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#F5F5F5] transition-colors"
          >
            <div
              className={cn(
                "w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors",
                selectedIds.includes(item.id)
                  ? "bg-[#FE6519] border-[#FE6519]"
                  : "border-[#D3D6DE]"
              )}
            >
              {selectedIds.includes(item.id) && (
                <Check className="h-3 w-3 text-white" />
              )}
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm text-[#1a1a1a]">{item.label}</span>
              {item.description && (
                <span className="text-xs text-[#999]">{item.description}</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// Apps Submenu
interface AppsSubmenuProps {
  apps: typeof APPS
  selectedIds: string[]
  search: string
  onSearchChange: (value: string) => void
  onToggle: (id: string) => void
  onClearAll: () => void
  onBack: () => void
}

function AppsSubmenu({
  apps,
  selectedIds,
  search,
  onSearchChange,
  onToggle,
  onClearAll,
  onBack,
}: AppsSubmenuProps) {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#EFF1F3]">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-2.5 hover:bg-[#F5F5F5] transition-colors"
        >
          <ChevronRight className="h-4 w-4 text-[#999] rotate-180" />
          <span className="text-sm font-medium text-[#1a1a1a]">Specific Apps</span>
        </button>
        {selectedIds.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="px-3 py-2.5 text-[#FE6519] hover:text-[#e5581a] transition-colors text-sm font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Search */}
      <div className="px-3 py-2 border-b border-[#EFF1F3]">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#999]" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search apps"
            className="pl-8 h-8 text-sm border-[#D3D6DE] rounded-lg"
          />
        </div>
      </div>

      {/* Items */}
      <div className="py-1 max-h-[240px] overflow-y-auto">
        {apps.map((app) => (
          <button
            key={app.id}
            type="button"
            onClick={() => onToggle(app.id)}
            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#F5F5F5] transition-colors"
          >
            <div
              className={cn(
                "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                selectedIds.includes(app.id)
                  ? "bg-[#FE6519] border-[#FE6519]"
                  : "border-[#D3D6DE]"
              )}
            >
              {selectedIds.includes(app.id) && (
                <Check className="h-3 w-3 text-white" />
              )}
            </div>
            {/* App Icon */}
            <div
              className="w-5 h-5 rounded flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: app.color }}
            >
              {app.icon === "aws" ? (
                <span className="text-[8px]">aws</span>
              ) : (
                app.icon
              )}
            </div>
            <span className="text-sm text-[#1a1a1a]">{app.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// Entitlements Submenu
interface EntitlementsSubmenuProps {
  entitlements: typeof ENTITLEMENTS
  selectedIds: string[]
  search: string
  filter: string
  onSearchChange: (value: string) => void
  onFilterChange: (value: string) => void
  onToggle: (id: string) => void
  onClearAll: () => void
  onBack: () => void
}

function EntitlementsSubmenu({
  entitlements,
  selectedIds,
  search,
  filter,
  onSearchChange,
  onFilterChange,
  onToggle,
  onClearAll,
  onBack,
}: EntitlementsSubmenuProps) {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#EFF1F3]">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-2.5 hover:bg-[#F5F5F5] transition-colors"
        >
          <ChevronRight className="h-4 w-4 text-[#999] rotate-180" />
          <span className="text-sm font-medium text-[#1a1a1a]">Specific Entitlements</span>
        </button>
        {selectedIds.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="px-3 py-2.5 text-xs text-[#FE6519] hover:text-[#e5581a] transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Filter and Search Row */}
      <div className="px-3 py-2 border-b border-[#EFF1F3] flex items-center gap-2">
        <Select value={filter} onValueChange={onFilterChange}>
          <SelectTrigger className="h-8 text-sm border-[#D3D6DE] rounded-lg w-[120px] flex-shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Groups</SelectItem>
            <SelectItem value="groups">Groups</SelectItem>
            <SelectItem value="roles">Roles</SelectItem>
            <SelectItem value="permissions">Permissions</SelectItem>
            <SelectItem value="resources">Resources</SelectItem>
          </SelectContent>
        </Select>
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#999]" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search"
            className="pl-8 h-8 text-sm border-[#D3D6DE] rounded-lg"
          />
        </div>
      </div>

      {/* Items */}
      <div className="py-1 max-h-[200px] overflow-y-auto">
        {entitlements.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onToggle(item.id)}
            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#F5F5F5] transition-colors"
          >
            <div
              className={cn(
                "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                selectedIds.includes(item.id)
                  ? "bg-[#FE6519] border-[#FE6519]"
                  : "border-[#D3D6DE]"
              )}
            >
              {selectedIds.includes(item.id) && (
                <Check className="h-3 w-3 text-white" />
              )}
            </div>
            <span className="text-sm text-[#1a1a1a]">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
