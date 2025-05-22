
import React from "react";
import Sidebar from "./Sidebar";
import { useLocation } from "react-router-dom";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const title = getPageTitle(location.pathname);
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

const getPageTitle = (pathname: string): string => {
  const routes: Record<string, string> = {
    "/": "Dashboard",
    "/agents": "AI Agents",
    "/workflows": "Workflows",
    "/integrations": "Integrations",
    "/monitoring": "Logs & Monitoring",
  };
  
  return routes[pathname] || "Not Found";
};

export default DashboardLayout;
