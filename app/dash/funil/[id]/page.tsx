"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Negocio,
  HistoricoItem,
  StatusNegocio,
  Atividade,
  TipoAtividade,
  PerfilCliente,
  BuscaCliente,
} from "@/app/types/negocio";
import PerfilClienteComponent from "@/app/components/PerfilCliente";
import BuscaClienteComponent from "@/app/components/BuscaCliente";
import ModalMarcarVisita from "@/app/components/ModalMarcarVisita";
import ModalAdicionarNota from "@/app/components/ModalAdicionarNota";
import ModalEnviarEmail from "@/app/components/ModalEnviarEmail";

export default function DetalhesNegocioPage() {
  const params = useParams();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [negocio, setNegocio] = useState<Negocio | null>(null);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModalVisita, setShowModalVisita] = useState(false);
  const [showModalNota, setShowModalNota] = useState(false);
  const [showModalEmail, setShowModalEmail] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    if (!auth) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
      carregarDados();
    }
  }, [router, params.id]);

  const carregarDados = () => {
    const negociosSalvos = localStorage.getItem("negocios");
    if (negociosSalvos) {
      const negocios: Negocio[] = JSON.parse(negociosSalvos);
      const negocioEncontrado = negocios.find((n) => n.id === params.id);
      if (negocioEncontrado) {
        const negocioComHistorico = {
          ...negocioEncontrado,
          historico: negocioEncontrado.historico || [],
        };
        setNegocio(negocioComHistorico);
      }
    }

    const atividadesSalvas = localStorage.getItem("atividades");
    if (atividadesSalvas) {
      const todasAtividades: Atividade[] = JSON.parse(atividadesSalvas);
      const atividadesDoNegocio = todasAtividades.filter(
        (a) => a.negocioId === params.id
      );
      setAtividades(atividadesDoNegocio);
    }

    setLoading(false);
  };

  const salvarNegocio = (negocioAtualizado: Negocio) => {
    const negociosSalvos = localStorage.getItem("negocios");
    if (negociosSalvos) {
      const negocios: Negocio[] = JSON.parse(negociosSalvos);
      const index = negocios.findIndex((n) => n.id === negocioAtualizado.id);
      if (index !== -1) {
        negocios[index] = negocioAtualizado;
        localStorage.setItem("negocios", JSON.stringify(negocios));
        setNegocio(negocioAtualizado);
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

    // Adicionar ao histórico
    if (negocio) {
      const novoHistorico: HistoricoItem = {
        id: Date.now().toString(),
        tipo: "atividade",
        descricao: `${atividade.titulo} - ${getTipoAtividadeLabel(atividade.tipo)}`,
        data: new Date().toISOString(),
        usuario: atividade.responsavel,
        atividadeId: atividade.id,
        concluido: false,
      };
      const negocioAtualizado = {
        ...negocio,
        historico: [...negocio.historico, novoHistorico],
        ultimaAtualizacao: new Date().toISOString(),
      };
      salvarNegocio(negocioAtualizado);
    }
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
              ? { ...a, concluido, dataConclusao: concluido ? new Date().toISOString() : undefined }
              : a
          )
        );

        // Atualizar histórico
        if (negocio) {
          const historicoAtualizado = negocio.historico.map((h) =>
            h.atividadeId === atividadeId ? { ...h, concluido } : h
          );
          const negocioAtualizado = {
            ...negocio,
            historico: historicoAtualizado,
            ultimaAtualizacao: new Date().toISOString(),
          };
          salvarNegocio(negocioAtualizado);
        }
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
    if (!negocio) return;

    const novaAtividade: Atividade = {
      id: Date.now().toString(),
      negocioId: visita.negocioId || negocio.id,
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
    setShowModalVisita(false);
  };

  const handleAdicionarNota = (nota: string) => {
    if (!negocio) return;

    const novoHistorico: HistoricoItem = {
      id: Date.now().toString(),
      tipo: "nota",
      descricao: nota,
      data: new Date().toISOString(),
      usuario: negocio.corretor,
    };

    const negocioAtualizado = {
      ...negocio,
      historico: [...negocio.historico, novoHistorico],
      ultimaAtualizacao: new Date().toISOString(),
    };

    salvarNegocio(negocioAtualizado);
    setShowModalNota(false);
  };

  const handleEnviarEmail = (email: { para: string; assunto: string; mensagem: string }) => {
    if (!negocio) return;

    // Simular envio de email
    alert(`Email enviado para ${email.para}\nAssunto: ${email.assunto}`);

    const novoHistorico: HistoricoItem = {
      id: Date.now().toString(),
      tipo: "atualizacao",
      descricao: `Email enviado: ${email.assunto}`,
      data: new Date().toISOString(),
      usuario: negocio.corretor,
    };

    const negocioAtualizado = {
      ...negocio,
      historico: [...negocio.historico, novoHistorico],
      ultimaAtualizacao: new Date().toISOString(),
    };

    salvarNegocio(negocioAtualizado);
    setShowModalEmail(false);
  };

  const handleSalvarPerfil = (perfil: PerfilCliente) => {
    if (!negocio) return;
    const negocioAtualizado = {
      ...negocio,
      perfil,
      ultimaAtualizacao: new Date().toISOString(),
    };
    salvarNegocio(negocioAtualizado);
  };

  const handleSalvarBusca = (busca: BuscaCliente) => {
    if (!negocio) return;
    const negocioAtualizado = {
      ...negocio,
      busca,
      ultimaAtualizacao: new Date().toISOString(),
    };
    salvarNegocio(negocioAtualizado);
  };

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const formatarDataHora = (data: string) => {
    return new Date(data).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  const getStatusColor = (status: StatusNegocio) => {
    const colors: Record<StatusNegocio, string> = {
      qualificando: "bg-blue-500",
      conhecendo: "bg-yellow-500",
      agendando: "bg-orange-500",
      negociando: "bg-green-500",
    };
    return colors[status];
  };

  const getTipoIcone = (tipo: HistoricoItem["tipo"]) => {
    switch (tipo) {
      case "criacao":
        return "➕";
      case "mudanca_status":
        return "🔄";
      case "atualizacao":
        return "✏️";
      case "observacao":
        return "💬";
      case "nota":
        return "📝";
      case "atividade":
        return "📅";
      default:
        return "📝";
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

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <p className="text-zinc-600 dark:text-zinc-400">Carregando...</p>
      </div>
    );
  }

  if (!negocio) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black">
        <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <button
                onClick={() => router.push("/dash/funil")}
                className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
              >
                ← Voltar
              </button>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-8 text-center">
            <p className="text-zinc-600 dark:text-zinc-400">Negócio não encontrado</p>
          </div>
        </main>
      </div>
    );
  }

  const historicoOrdenado = [...(negocio.historico || [])].sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
  );

  const tempoNoSistema = Math.floor(
    (new Date().getTime() - new Date(negocio.dataCriacao).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const mudancasStatus = historicoOrdenado.filter(
    (h) => h.tipo === "mudanca_status"
  ).length;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push("/dash/funil")}
                className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white mr-4"
              >
                ← Voltar
              </button>
              <h1 className="text-2xl font-bold text-black dark:text-white">
                {negocio.cliente}
              </h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.push("/dash/atividades")}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                📅 Ver Atividades
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Botões de Ação */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setShowModalVisita(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            📅 Marcar Visita/Atividade
          </button>
          <button
            onClick={() => setShowModalNota(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            📝 Adicionar Nota
          </button>
          <button
            onClick={() => setShowModalEmail(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
          >
            ✉️ Enviar Email
          </button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
              Tempo no Sistema
            </p>
            <p className="text-2xl font-bold text-black dark:text-white">
              {tempoNoSistema} {tempoNoSistema === 1 ? "dia" : "dias"}
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
              Mudanças de Status
            </p>
            <p className="text-2xl font-bold text-black dark:text-white">
              {mudancasStatus}
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
              Valor do Negócio
            </p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatarValor(negocio.valor)}
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
              Total de Eventos
            </p>
            <p className="text-2xl font-bold text-black dark:text-white">
              {historicoOrdenado.length}
            </p>
          </div>
        </div>

        {/* Perfil e Busca */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <PerfilClienteComponent
            perfil={negocio.perfil}
            clienteNome={negocio.cliente}
            onSalvar={handleSalvarPerfil}
          />
          <BuscaClienteComponent busca={negocio.busca} onSalvar={handleSalvarBusca} />
        </div>

        {/* Informações do Negócio */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-black dark:text-white mb-4">
            Informações do Negócio
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                  Corretor Responsável
                </p>
                <p className="text-lg font-semibold text-black dark:text-white">
                  {negocio.corretor}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                  Status Atual
                </p>
                <span
                  className={`inline-block px-4 py-2 rounded-lg text-white font-semibold ${getStatusColor(negocio.status)}`}
                >
                  {getStatusLabel(negocio.status)}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                  Data de Entrada
                </p>
                <p className="text-base text-black dark:text-white">
                  {formatarDataHora(negocio.dataCriacao)}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                  Última Atualização
                </p>
                <p className="text-base text-black dark:text-white">
                  {formatarDataHora(negocio.ultimaAtualizacao)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Histórico Completo */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-black dark:text-white mb-6">
            Histórico Completo de Atividades
          </h2>
          {historicoOrdenado.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-600 dark:text-zinc-400 mb-2">
                Nenhum histórico registrado ainda.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {historicoOrdenado.map((item) => {
                const atividade = item.atividadeId
                  ? atividades.find((a) => a.id === item.atividadeId)
                  : null;

                return (
                  <div
                    key={item.id}
                    className={`flex gap-4 p-4 rounded-lg transition-colors ${
                      item.concluido
                        ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                        : "bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                    }`}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center text-xl border-2 border-zinc-200 dark:border-zinc-700">
                        {getTipoIcone(item.tipo)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {(item.tipo === "atividade" || item.tipo === "nota") && (
                            <input
                              type="checkbox"
                              checked={item.concluido || false}
                              onChange={(e) => {
                                if (item.atividadeId) {
                                  atualizarAtividade(item.atividadeId, e.target.checked);
                                }
                              }}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                          )}
                          <p
                            className={`text-base font-semibold ${
                              item.concluido
                                ? "text-green-700 dark:text-green-400 line-through"
                                : "text-black dark:text-white"
                            }`}
                          >
                            {item.descricao}
                          </p>
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-500 whitespace-nowrap ml-4">
                          {formatarDataHora(item.data)}
                        </p>
                      </div>
                      {item.tipo === "mudanca_status" &&
                        item.statusAnterior &&
                        item.statusNovo && (
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs px-3 py-1 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium">
                              {getStatusLabel(item.statusAnterior)}
                            </span>
                            <span className="text-zinc-400 text-lg">→</span>
                            <span className="text-xs px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium">
                              {getStatusLabel(item.statusNovo)}
                            </span>
                          </div>
                        )}
                      {atividade && (
                        <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                          {atividade.localizacao && (
                            <p>📍 {atividade.localizacao}</p>
                          )}
                          {atividade.descricao && <p>{atividade.descricao}</p>}
                        </div>
                      )}
                      {item.usuario && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-zinc-500 dark:text-zinc-500">
                            Responsável:
                          </span>
                          <span className="text-xs font-medium text-black dark:text-white">
                            {item.usuario}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Modais */}
      {showModalVisita && (
        <ModalMarcarVisita
          clienteNome={negocio.cliente}
          onClose={() => setShowModalVisita(false)}
          onSalvar={handleMarcarVisita}
        />
      )}
      {showModalNota && (
        <ModalAdicionarNota
          clienteNome={negocio.cliente}
          onClose={() => setShowModalNota(false)}
          onSalvar={handleAdicionarNota}
        />
      )}
      {showModalEmail && (
        <ModalEnviarEmail
          clienteNome={negocio.cliente}
          clienteEmail={negocio.perfil?.email}
          onClose={() => setShowModalEmail(false)}
          onEnviar={handleEnviarEmail}
        />
      )}
    </div>
  );
}
