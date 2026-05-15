// Layout barrel — import everything from one place:
// import { DashboardLayout, Sidebar, Header } from "@/features/dashboard/components/Layout";

export { default as Sidebar } from "./Sidebar";
export type { SidebarProps, NavId } from "./Sidebar";

export { default as Header } from "./Header";
export type { HeaderProps } from "./Header";

export { default as DashboardLayout } from "./DashboardLayout";
export type { DashboardLayoutProps } from "./DashboardLayout";