"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Atividade, TipoAtividade, Negocio } from "@/app/types/negocio";
import DashboardLayout from "@/app/components/DashboardLayout";
import ModalMarcarVisita from "@/app/components/ModalMarcarVisita";

export default function AtividadesPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [dataSelecionada, setDataSelecionada] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showModal, setShowModal] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState("");

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
    const atividadesSalvas = localStorage.getItem("atividades");
    if (atividadesSalvas) {
      try {
        const todasAtividades: Atividade[] = JSON.parse(atividadesSalvas);
        // Filtrar atividades com datas inválidas
        const atividadesValidas = todasAtividades.filter((a) => {
          if (!a.dataAgendamento) return false;
          try {
            const date = new Date(a.dataAgendamento);
            return !isNaN(date.getTime());
          } catch {
            return false;
          }
        });
        
        // Se houver atividades inválidas, salvar apenas as válidas
        if (atividadesValidas.length !== todasAtividades.length) {
          localStorage.setItem("atividades", JSON.stringify(atividadesValidas));
        }
        
        setAtividades(atividadesValidas);
      } catch (error) {
        console.error("Erro ao carregar atividades:", error);
        setAtividades([]);
      }
    }

    const negociosSalvos = localStorage.getItem("negocios");
    if (negociosSalvos) {
      try {
        setNegocios(JSON.parse(negociosSalvos));
      } catch (error) {
        console.error("Erro ao carregar negócios:", error);
        setNegocios([]);
      }
    }
  };

  const salvarAtividade = (atividade: Atividade) => {
    const atividadesSalvas = localStorage.getItem("atividades");
    const todasAtividades: Atividade[] = atividadesSalvas
      ? JSON.parse(atividadesSalvas)
      : [];
    todasAtividades.push(atividade);
    localStorage.setItem("atividades", JSON.stringify(todasAtividades));
    setAtividades([...atividades, atividade]);
  };

  const atualizarAtividade = (atividadeId: string, concluido: boolean) => {
    const atividadesSalvas = localStorage.getItem("atividades");
    if (atividadesSalvas) {
      const todasAtividades: Atividade[] = JSON.parse(atividadesSalvas);
      const index = todasAtividades.findIndex((a) => a.id === atividadeId);
      if (index !== -1) {
        todasAtividades[index] = {
          ...todasAtividades[index],
          concluido,
          dataConclusao: concluido ? new Date().toISOString() : undefined,
        };
        localStorage.setItem("atividades", JSON.stringify(todasAtividades));
        setAtividades(
          atividades.map((a) =>
            a.id === atividadeId
              ? {
                  ...a,
                  concluido,
                  dataConclusao: concluido ? new Date().toISOString() : undefined,
                }
              : a
          )
        );
      }
    }
  };

  const handleMarcarVisita = (visita: {
    tipo: TipoAtividade;
    titulo: string;
    descricao?: string;
    dataAgendamento: string;
    localizacao?: string;
    observacoes?: string;
    negocioId?: string;
  }) => {
    const negocioId = visita.negocioId || negocios.find((n) => n.cliente === clienteSelecionado)?.id;
    if (!negocioId) {
      alert("Selecione um cliente");
      return;
    }
    const negocio = negocios.find((n) => n.id === negocioId);
    if (!negocio) return;

    const novaAtividade: Atividade = {
      id: Date.now().toString(),
      negocioId: negocioId,
      tipo: visita.tipo,
      titulo: visita.titulo,
      descricao: visita.descricao,
      dataAgendamento: visita.dataAgendamento,
      dataConclusao: undefined,
      concluido: false,
      responsavel: negocio.corretor,
      localizacao: visita.localizacao,
      observacoes: visita.observacoes,
    };

    salvarAtividade(novaAtividade);
    setShowModal(false);
    setClienteSelecionado("");
  };

  const formatarDataHora = (data: string) => {
    if (!data) return "Data inválida";
    try {
      const date = new Date(data);
      if (isNaN(date.getTime())) return "Data inválida";
      return date.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Data inválida";
    }
  };

  const formatarHora = (data: string) => {
    if (!data) return "--:--";
    try {
      const date = new Date(data);
      if (isNaN(date.getTime())) return "--:--";
      return date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "--:--";
    }
  };

  const formatarData = (data: string) => {
    if (!data) return "Data inválida";
    try {
      const date = new Date(data);
      if (isNaN(date.getTime())) return "Data inválida";
      return date.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch (error) {
      return "Data inválida";
    }
  };

  const getTipoAtividadeLabel = (tipo: TipoAtividade) => {
    const labels: Record<TipoAtividade, string> = {
      visita: "Visita",
      ligacao: "Ligação",
      email: "Email",
      reuniao: "Reunião",
      outro: "Outro",
    };
    return labels[tipo];
  };

  const getTipoCor = (tipo: TipoAtividade) => {
    const cores: Record<TipoAtividade, string> = {
      visita: "bg-blue-500",
      ligacao: "bg-green-500",
      email: "bg-orange-500",
      reuniao: "bg-purple-500",
      outro: "bg-gray-500",
    };
    return cores[tipo];
  };

  const atividadesDoDia = atividades.filter((a) => {
    if (!a.dataAgendamento) return false;
    try {
      const data = new Date(a.dataAgendamento);
      if (isNaN(data.getTime())) return false;
      const dataAtividade = data.toISOString().split("T")[0];
      return dataAtividade === dataSelecionada;
    } catch (error) {
      return false;
    }
  });

  const atividadesOrdenadas = [...atividadesDoDia].sort((a, b) => {
    try {
      const dataA = new Date(a.dataAgendamento);
      const dataB = new Date(b.dataAgendamento);
      if (isNaN(dataA.getTime()) || isNaN(dataB.getTime())) return 0;
      return dataA.getTime() - dataB.getTime();
    } catch (error) {
      return 0;
    }
  });

  const getNomeCliente = (negocioId: string) => {
    const negocio = negocios.find((n) => n.id === negocioId);
    return negocio?.cliente || "Cliente não encontrado";
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-black dark:text-white">
              Agenda de Atividades
            </h1>
            <button
              onClick={() => {
                setClienteSelecionado("");
                setShowModal(true);
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              + Nova Atividade
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        {/* Seletor de Data */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-black dark:text-white">
              Data:
            </label>
            <input
              type="date"
              value={dataSelecionada}
              onChange={(e) => setDataSelecionada(e.target.value)}
              className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex-1 text-right">
              <p className="text-lg font-semibold text-black dark:text-white">
                {formatarData(dataSelecionada)}
              </p>
            </div>
          </div>
        </div>

        {/* Lista de Atividades */}
        <div className="space-y-4">
          {atividadesOrdenadas.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-12 text-center">
              <p className="text-zinc-600 dark:text-zinc-400 mb-2">
                Nenhuma atividade agendada para este dia.
              </p>
              <button
                onClick={() => {
                  setClienteSelecionado("");
                  setShowModal(true);
                }}
                className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Agendar Primeira Atividade
              </button>
            </div>
          ) : (
            atividadesOrdenadas.map((atividade) => (
              <div
                key={atividade.id}
                className={`bg-white dark:bg-zinc-900 rounded-lg shadow p-6 border-l-4 ${
                  atividade.concluido
                    ? "border-green-500 opacity-75"
                    : getTipoCor(atividade.tipo).replace("bg-", "border-")
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <input
                        type="checkbox"
                        checked={atividade.concluido}
                        onChange={(e) =>
                          atualizarAtividade(atividade.id, e.target.checked)
                        }
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getTipoCor(
                          atividade.tipo
                        )}`}
                      >
                        {getTipoAtividadeLabel(atividade.tipo)}
                      </span>
                      <h3
                        className={`text-lg font-semibold ${
                          atividade.concluido
                            ? "line-through text-zinc-400 dark:text-zinc-600"
                            : "text-black dark:text-white"
                        }`}
                      >
                        {atividade.titulo}
                      </h3>
                    </div>
                    <div className="ml-8 space-y-1">
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        <span className="font-medium">Cliente:</span>{" "}
                        {getNomeCliente(atividade.negocioId)}
                      </p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        <span className="font-medium">Horário:</span>{" "}
                        {formatarHora(atividade.dataAgendamento)}
                      </p>
                      {atividade.localizacao && (
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          <span className="font-medium">📍 Local:</span>{" "}
                          {atividade.localizacao}
                        </p>
                      )}
                      {atividade.descricao && (
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                          {atividade.descricao}
                        </p>
                      )}
                      {atividade.observacoes && (
                        <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-2 italic">
                          {atividade.observacoes}
                        </p>
                      )}
                      <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-2">
                        Responsável: {atividade.responsavel}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      router.push(`/dash/funil/${atividade.negocioId}`)
                    }
                    className="ml-4 px-3 py-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    Ver Cliente →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <ModalMarcarVisita
          clienteNome={clienteSelecionado || "Novo Cliente"}
          onClose={() => {
            setShowModal(false);
            setClienteSelecionado("");
          }}
          onSalvar={handleMarcarVisita}
        />
      )}
    </DashboardLayout>
  );
}

