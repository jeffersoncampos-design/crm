"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Negocio, StatusNegocio, Corretor } from "@/app/types/negocio";
import DashboardLayout from "@/app/components/DashboardLayout";
import KanbanBoard from "@/app/components/KanbanBoard";
import FiltrosFunil from "@/app/components/FiltrosFunil";
import ModalAdicionarNegocio from "@/app/components/ModalAdicionarNegocio";

export default function FunilVendasPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [corretores, setCorretores] = useState<Corretor[]>([]);
  const [filtroCorretor, setFiltroCorretor] = useState<string>("");
  const [filtroData, setFiltroData] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    if (!auth) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
      carregarDados();
    }
  }, [router]);

  const carregarDados = () => {
    // Carregar negócios do localStorage
    const negociosSalvos = localStorage.getItem("negocios");
    if (negociosSalvos) {
      const negociosCarregados: Negocio[] = JSON.parse(negociosSalvos);
      // Garantir que todos os negócios tenham histórico
      const negociosComHistorico = negociosCarregados.map((negocio) => {
        if (!negocio.historico || negocio.historico.length === 0) {
          return {
            ...negocio,
            historico: [
              {
                id: Date.now().toString(),
                tipo: "criacao" as const,
                descricao: `Negócio criado para ${negocio.cliente}`,
                data: negocio.dataCriacao,
                usuario: negocio.corretor,
              },
            ],
          };
        }
        return negocio;
      });
      setNegocios(negociosComHistorico);
      // Salvar de volta se houve atualização
      if (negociosCarregados.some((n) => !n.historico || n.historico.length === 0)) {
        localStorage.setItem("negocios", JSON.stringify(negociosComHistorico));
      }
    } else {
      // Dados iniciais de exemplo
      const dadosIniciais: Negocio[] = [];
      setNegocios(dadosIniciais);
    }

    // Carregar corretores do localStorage
    const corretoresSalvos = localStorage.getItem("corretores");
    if (corretoresSalvos) {
      setCorretores(JSON.parse(corretoresSalvos));
    } else {
      // Corretores iniciais
      const corretoresIniciais: Corretor[] = [
        { id: "1", nome: "João Silva" },
        { id: "2", nome: "Maria Santos" },
        { id: "3", nome: "Pedro Oliveira" },
      ];
      setCorretores(corretoresIniciais);
      localStorage.setItem("corretores", JSON.stringify(corretoresIniciais));
    }
  };

  const salvarNegocios = (novosNegocios: Negocio[]) => {
    setNegocios(novosNegocios);
    localStorage.setItem("negocios", JSON.stringify(novosNegocios));
  };

  const handleAdicionarNegocio = (novoNegocio: Omit<Negocio, "id" | "dataCriacao" | "ultimaAtualizacao" | "historico">) => {
    const agora = new Date().toISOString();
    const negocio: Negocio = {
      ...novoNegocio,
      id: Date.now().toString(),
      dataCriacao: agora,
      ultimaAtualizacao: agora,
      historico: [
        {
          id: Date.now().toString(),
          tipo: "criacao",
          descricao: `Negócio criado para ${novoNegocio.cliente} com valor de ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(novoNegocio.valor)}`,
          data: agora,
          usuario: novoNegocio.corretor,
        },
        {
          id: (Date.now() + 1).toString(),
          tipo: "mudanca_status",
          descricao: `Status inicial definido como "${getStatusLabel(novoNegocio.status)}"`,
          statusNovo: novoNegocio.status,
          data: agora,
          usuario: novoNegocio.corretor,
        },
      ],
    };
    const novosNegocios = [...negocios, negocio];
    salvarNegocios(novosNegocios);
    setShowModal(false);
  };

  const getStatusLabel = (status: StatusNegocio) => {
    const labels: Record<StatusNegocio, string> = {
      qualificando: "Qualificando",
      conhecendo: "Conhecendo",
      agendando: "Agendando",
      negociando: "Negociando",
    };
    return labels[status];
  };

  const handleMoverNegocio = (negocioId: string, novoStatus: StatusNegocio) => {
    const agora = new Date().toISOString();
    const novosNegocios = negocios.map((negocio) => {
      if (negocio.id === negocioId) {
        const statusAnterior = negocio.status;
        const novoHistorico = {
          id: Date.now().toString(),
          tipo: "mudanca_status" as const,
          descricao: `Status alterado de "${getStatusLabel(statusAnterior)}" para "${getStatusLabel(novoStatus)}"`,
          statusAnterior,
          statusNovo: novoStatus,
          data: agora,
          usuario: negocio.corretor,
        };
        return {
          ...negocio,
          status: novoStatus,
          ultimaAtualizacao: agora,
          historico: [...(negocio.historico || []), novoHistorico],
        };
      }
      return negocio;
    });
    salvarNegocios(novosNegocios);
  };

  const handleExcluirNegocio = (negocioId: string) => {
    const novosNegocios = negocios.filter((negocio) => negocio.id !== negocioId);
    salvarNegocios(novosNegocios);
  };

  const negociosFiltrados = negocios.filter((negocio) => {
    if (filtroCorretor && negocio.corretor !== filtroCorretor) return false;
    if (filtroData) {
      const dataNegocio = new Date(negocio.dataCriacao).toISOString().split("T")[0];
      if (dataNegocio !== filtroData) return false;
    }
    return true;
  });

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
              Funil de Vendas
            </h1>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              + Adicionar Negócio
            </button>
          </div>
        </div>
      </header>

      {/* Filtros */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <FiltrosFunil
            corretores={corretores}
            filtroCorretor={filtroCorretor}
            filtroData={filtroData}
            onFiltroCorretorChange={setFiltroCorretor}
            onFiltroDataChange={setFiltroData}
          />
        </div>
      </div>

      {/* Kanban Board */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <KanbanBoard
          negocios={negociosFiltrados}
          onMoverNegocio={handleMoverNegocio}
          onExcluirNegocio={handleExcluirNegocio}
        />
      </main>

      {/* Modal Adicionar Negócio */}
      {showModal && (
        <ModalAdicionarNegocio
          corretores={corretores}
          onClose={() => setShowModal(false)}
          onAdicionar={handleAdicionarNegocio}
        />
      )}
    </DashboardLayout>
  );
}

