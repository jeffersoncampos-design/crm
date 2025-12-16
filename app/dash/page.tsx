"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verificar autenticação
    const auth = localStorage.getItem("isAuthenticated");
    if (!auth) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    router.push("/login");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-black dark:text-white">
              Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
              Total de Clientes
            </h3>
            <p className="text-3xl font-bold text-black dark:text-white">0</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
              Vendas do Mês
            </h3>
            <p className="text-3xl font-bold text-black dark:text-white">R$ 0</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
              Tarefas Pendentes
            </h3>
            <p className="text-3xl font-bold text-black dark:text-white">0</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
              Taxa de Conversão
            </h3>
            <p className="text-3xl font-bold text-black dark:text-white">0%</p>
          </div>
        </div>

        {/* Área de Conteúdo Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
              Atividades Recentes
            </h2>
            <div className="space-y-4">
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                Nenhuma atividade recente.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-black dark:text-white mb-4">
              Próximas Tarefas
            </h2>
            <div className="space-y-4">
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                Nenhuma tarefa pendente.
              </p>
            </div>
          </div>
        </div>

        {/* Link para Funil de Vendas */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-black dark:text-white mb-2">
                Funil de Vendas
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                Acompanhe os atendimentos dos corretores e gerencie o pipeline de vendas
              </p>
            </div>
            <button
              onClick={() => router.push("/dash/funil")}
              className="px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Acessar Funil
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

