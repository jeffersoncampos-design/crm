"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // This effect only runs on the client side
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem("isAuthenticated");
      setIsAuthenticated(!!auth);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    router.push("/login");
  };

  if (!isAuthenticated) {
    return null;
  }

  const menuItems = [
    { path: "/dash", label: "Dashboard", icon: "📊" },
    { path: "/dash/funil", label: "Funil de Vendas", icon: "🎯" },
    { path: "/dash/atividades", label: "Atividades", icon: "📅" },
  ];

  const isActive = (path: string) => {
    if (path === "/dash") {
      return pathname === "/dash";
    }
    return pathname?.startsWith(path);
  };

  return (
    <div className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 min-h-screen flex flex-col">
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-xl font-bold text-black dark:text-white">CRM System</h1>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold"
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <span className="text-xl">🚪</span>
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
}

