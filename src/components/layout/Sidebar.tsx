
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Bot, 
  Workflow, 
  LucideIcon,
  Plug, 
  BarChart3,
  Settings,
  Github,
  Terminal,
  Code
} from "lucide-react";

interface NavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  end?: boolean;
}

const NavItem = ({ to, icon: Icon, label, end = false }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => 
        cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all",
          isActive 
            ? "bg-sidebar-accent text-sidebar-accent-foreground" 
            : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        )
      }
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </NavLink>
  );
};

const Sidebar = () => {
  return (
    <div className="hidden lg:flex flex-col w-64 bg-sidebar border-r border-border">
      <div className="flex h-14 items-center border-b border-border px-4">
        <div className="flex items-center gap-2">
          <Terminal className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">AI Command</span>
        </div>
      </div>
      <div className="flex-1 overflow-auto py-4 px-3">
        <div className="space-y-1">
          <NavItem to="/" icon={LayoutDashboard} label="Dashboard" end />
          <NavItem to="/agents" icon={Bot} label="AI Agents" />
          <NavItem to="/workflows" icon={Workflow} label="Workflows" />
          <NavItem to="/integrations" icon={Plug} label="Integrations" />
          <NavItem to="/monitoring" icon={BarChart3} label="Logs & Monitoring" />
        </div>
        
        <div className="mt-6 pt-6 border-t border-sidebar-border">
          <div className="px-3 text-xs font-semibold text-muted-foreground mb-2">
            Resources
          </div>
          <div className="space-y-1">
            <a
              href="https://github.com/langchain-ai/langchain"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            >
              <Github className="h-4 w-4" />
              <span>LangChain</span>
            </a>
            <a
              href="https://n8n.io/integrations"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            >
              <Code className="h-4 w-4" />
              <span>n8n Workflows</span>
            </a>
            <NavItem to="/settings" icon={Settings} label="Settings" />
          </div>
        </div>
      </div>
      <div className="mt-auto p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
            AI
          </div>
          <div>
            <div className="font-medium text-sm">AI Platform</div>
            <div className="text-xs text-muted-foreground">v1.0.0</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
