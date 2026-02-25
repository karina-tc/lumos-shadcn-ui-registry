import type { ReactElement, ReactNode } from "react";

// blocks
import { blank } from "@/app/demo/[name]/blocks/blank";
import { dashboard } from "@/app/demo/[name]/blocks/dashboard";
import {
  lumosAppsIndex,
  lumosIdentitiesIndex,
  lumosAccountsIndex,
  lumosAccessReviewsIndex,
  lumosOnboardingIndex,
  lumosOffboardingIndex,
  lumosActivityLogIndex,
  lumosTasksIndex,
  lumosAccessPoliciesIndex,
  lumosAnalyticsIndex,
  lumosIntegrationsIndex,
  lumosSettingsIndex,
} from "@/app/demo/[name]/blocks/lumos-demos";

// components
import { brandHeader } from "@/app/demo/[name]/components/brand-header";
import { brandSidebar } from "@/app/demo/[name]/components/brand-sidebar";
import { lumosButton } from "@/app/demo/[name]/components/lumos-button";
import { lumosBadge } from "@/app/demo/[name]/components/lumos-badge";
import { lumosCard } from "@/app/demo/[name]/components/lumos-card";

// ui
import { accordion } from "@/app/demo/[name]/ui/accordion";
import { alert } from "@/app/demo/[name]/ui/alert";
import { avatar } from "@/app/demo/[name]/ui/avatar";
import { badge } from "@/app/demo/[name]/ui/badge";
import { breadcrumb } from "@/app/demo/[name]/ui/breadcrumb";
import { button } from "@/app/demo/[name]/ui/button";
import { calendar } from "@/app/demo/[name]/ui/calendar";
import { card } from "@/app/demo/[name]/ui/card";
import { chart } from "@/app/demo/[name]/ui/chart";
import { checkbox } from "@/app/demo/[name]/ui/checkbox";
import { dataTable } from "@/app/demo/[name]/ui/data-table";
import { datePicker } from "@/app/demo/[name]/ui/date-picker";
import { dialog } from "@/app/demo/[name]/ui/dialog";
import { dropdownMenu } from "@/app/demo/[name]/ui/dropdown-menu";
import { input } from "@/app/demo/[name]/ui/input";
import { menuBar } from "@/app/demo/[name]/ui/menu-bar";
import { select } from "@/app/demo/[name]/ui/select";
import { separator } from "@/app/demo/[name]/ui/separator";
import { skeleton } from "@/app/demo/[name]/ui/skeleton";
import { slider } from "@/app/demo/[name]/ui/slider";
import { sonner } from "@/app/demo/[name]/ui/sonner";
import { switchComponent } from "@/app/demo/[name]/ui/switch";
import { table } from "@/app/demo/[name]/ui/table";
import { tabs } from "@/app/demo/[name]/ui/tabs";
import { toggleGroup } from "@/app/demo/[name]/ui/toggle-group";
import { tooltip } from "@/app/demo/[name]/ui/tooltip";

interface Demo {
  name: string; // this must match the `registry.json` name
  components?: {
    [name: string]: ReactNode | ReactElement;
  };
}

export const demos: { [name: string]: Demo } = {
  // blocks
  blank,
  dashboard,
  "lumos-apps-index": lumosAppsIndex,
  "lumos-identities-index": lumosIdentitiesIndex,
  "lumos-accounts-index": lumosAccountsIndex,
  "lumos-access-reviews-index": lumosAccessReviewsIndex,
  "lumos-onboarding-index": lumosOnboardingIndex,
  "lumos-offboarding-index": lumosOffboardingIndex,
  "lumos-activity-log-index": lumosActivityLogIndex,
  "lumos-tasks-index": lumosTasksIndex,
  "lumos-access-policies-index": lumosAccessPoliciesIndex,
  "lumos-analytics-index": lumosAnalyticsIndex,
  "lumos-integrations-index": lumosIntegrationsIndex,
  "lumos-settings-index": lumosSettingsIndex,

  // components
  "brand-header": brandHeader,
  "brand-sidebar": brandSidebar,
  "lumos-button": lumosButton,
  "lumos-badge": lumosBadge,
  "lumos-card": lumosCard,

  // ui
  accordion,
  alert,
  avatar,
  badge,
  breadcrumb,
  button,
  calendar,
  card,
  chart,
  checkbox,
  dialog,
  "date-picker": datePicker,
  "data-table": dataTable,
  "dropdown-menu": dropdownMenu,
  input,
  "menu-bar": menuBar,
  select,
  separator,
  skeleton,
  slider,
  switch: switchComponent,
  sonner,
  table,
  tabs,
  "toggle-group": toggleGroup,
  tooltip,
};
