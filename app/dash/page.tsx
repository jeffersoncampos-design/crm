"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/app/components/DashboardLayout";
import DraggableCard from "@/app/components/DraggableCard";

interface CardData {
  id: string;
  title: string;
  value: string | number;
}

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(true);
  const [cards, setCards] = useState<CardData[]>([
    { id: "1", title: "Total de Clientes", value: 0 },
    { id: "2", title: "Vendas do Mês", value: "R$ 0" },
    { id: "3", title: "Tarefas Pendentes", value: 0 },
    { id: "4", title: "Taxa de Conversão", value: "0%" },
  ]);
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // This effect only runs on the client side
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem("isAuthenticated");
      if (!auth) {
        router.push("/login");
      } else {
        setIsAuthenticated(true);
        carregarOrdemCards();
      }
      setIsLoading(false);
    }
  }, [router]);

  const carregarOrdemCards = () => {
    const ordemSalva = localStorage.getItem("dashboardCardsOrder");
    if (ordemSalva) {
      const ordem: string[] = JSON.parse(ordemSalva);
      setCards((prevCards) => {
        const cardsOrdenados = ordem.map((id) => prevCards.find((c) => c.id === id)).filter(Boolean) as CardData[];
        const cardsRestantes = prevCards.filter((c) => !ordem.includes(c.id));
        return [...cardsOrdenados, ...cardsRestantes];
      });
    }
  };

  const salvarOrdemCards = (novaOrdem: CardData[]) => {
    setCards(novaOrdem);
    localStorage.setItem("dashboardCardsOrder", JSON.stringify(novaOrdem.map((c) => c.id)));
  };

  const handleDragStart = (id: string) => {
    setDraggedCardId(id);
  };

  const handleDragEnd = () => {
    setDraggedCardId(null);
  };

  const handleDrop = (targetId: string) => {
    if (isLocked || !draggedCardId || draggedCardId === targetId) return;

    const novosCards = [...cards];
    const draggedIndex = novosCards.findIndex((c) => c.id === draggedCardId);
    const targetIndex = novosCards.findIndex((c) => c.id === targetId);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [removed] = novosCards.splice(draggedIndex, 1);
      novosCards.splice(targetIndex, 0, removed);
      salvarOrdemCards(novosCards);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-black dark:text-white">
              Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsLocked(!isLocked)}
                className={`p-2 rounded-lg transition-colors ${
                  isLocked
                    ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
                    : "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                }`}
                title={isLocked ? "Desbloquear edição" : "Bloquear edição"}
              >
                {isLocked ? "🔒" : "🔓"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cards.map((card) => (
            <DraggableCard
              key={card.id}
              id={card.id}
              title={card.title}
              value={card.value}
              isLocked={isLocked}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
            />
          ))}
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

      </main>
    </DashboardLayout>
  );
}

