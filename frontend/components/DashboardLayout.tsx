"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Link as LinkIcon,
  BarChart,
  LogOut,
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { signOut } from "next-auth/react";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  const [dark, setDark] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }

    const savedSidebar = localStorage.getItem("sidebar");
    if (savedSidebar === "collapsed") {
      setCollapsed(true);
    }
  }, []);

  const toggleTheme = () => {
    if (dark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDark(!dark);
  };

  const toggleSidebar = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("sidebar", next ? "collapsed" : "expanded");
  };

  return (
    <div className="flex min-h-screen">

      <div
        className={`${
          collapsed ? "w-20" : "w-64"
        } glass flex flex-col p-4 transition-all duration-300`}
      >

        <div className="flex items-center justify-between mb-8">
          {!collapsed && (
            <h2 className="text-lg font-semibold text-primary">
              UR-LinKs
            </h2>
          )}

          <button onClick={toggleSidebar}
          className="text-black dark:text-gray-200">
            {collapsed ? (
              <PanelLeftOpen size={18} />
            ) : (
              <PanelLeftClose size={18} />
            )}
          </button>
        </div>

        <nav className="space-y-2 text-sm">

          <Link
            href="/dashboard"
            className={`flex items-center gap-3 p-2 rounded-lg ${
              pathname === "/dashboard"
                ? "bg-black/10 dark:bg-white/20"
                : "hover:bg-black/5 dark:hover:bg-white/10"
            }`}
          >
            <LinkIcon size={18} />
            {!collapsed && <span className="text-primary">Dashboard</span>}
          </Link>

          <Link
            href="/analytics"
            className={`flex items-center gap-3 p-2 rounded-lg ${
              pathname === "/analytics"
                ? "bg-black/10 dark:bg-white/20"
                : "hover:bg-black/5 dark:hover:bg-white/10"
            }`}
          >
            <BarChart size={18} />
            {!collapsed && <span className="text-primary">Analytics</span>}
          </Link>

        </nav>

        <div className="mt-auto space-y-3">

          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 text-sm w-full p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
            {!collapsed && <span className="text-secondary">Theme</span>}
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              signOut({ callbackUrl: "/login" });
            }}
            className="flex items-center gap-3 text-sm w-full p-2 rounded-lg hover:bg-red-500/10"
          >
            <LogOut size={18} />
            {!collapsed && <span className="text-red-500">Logout</span>}
          </button>

        </div>

      </div>

      <div className="flex-1 p-8">
        <div className="glass-strong rounded-2xl p-6 min-h-full">
          {children}
        </div>
      </div>

    </div>
  );
}