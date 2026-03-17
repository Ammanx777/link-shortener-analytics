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

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);


  return (
    <div className="flex min-h-screen">

      <div
  className={`${
    collapsed ? "w-20" : "w-64"
  } bg-white dark:bg-gray-900 border-r p-4 transition-all duration-300 flex flex-col`}
>

  {/* TOP BAR */}
  <div className="flex items-center justify-between mb-8">
    {!collapsed && (
      <h2 className="text-xl font-bold tracking-wide">UR-LinKs</h2>
    )}

    <button onClick={toggleSidebar}>
      {collapsed ? (
        <PanelLeftOpen size={20} />
      ) : (
        <PanelLeftClose size={20} />
      )}
    </button>
  </div>

  {/* NAV */}
  <nav className="space-y-2 text-sm">

    <Link
      href="/dashboard"
      className={`flex items-center gap-3 p-2 rounded transition ${
        pathname === "/dashboard"
          ? "bg-blue-600 text-white"
          : "hover:bg-gray-200 dark:hover:bg-gray-800"
      }`}
    >
      <LinkIcon size={18} />
      {!collapsed && "Dashboard"}
    </Link>

    <Link
      href="/analytics"
      className={`flex items-center gap-3 p-2 rounded transition ${
        pathname === "/analytics"
          ? "bg-blue-600 text-white"
          : "hover:bg-gray-200 dark:hover:bg-gray-800"
      }`}
    >
      <BarChart size={18} />
      {!collapsed && "Analytics"}
    </Link>

  </nav>

  {/* BOTTOM ACTIONS */}
  <div className="mt-auto space-y-3">

    <button
      onClick={toggleTheme}
      className="flex items-center gap-3 text-sm w-full p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
      {!collapsed && "Toggle Theme"}
    </button>

    <button
      onClick={() => {
        localStorage.removeItem("token");
        signOut({ callbackUrl: "/login" });
      }}
      className="flex items-center gap-3 text-red-500 text-sm w-full p-2 rounded hover:bg-red-100 dark:hover:bg-red-900"
    >
      <LogOut size={18} />
      {!collapsed && "Logout"}
    </button>

  </div>

</div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8 bg-gray-50 dark:bg-black">
        {children}
      </div>

    </div>
  );
}