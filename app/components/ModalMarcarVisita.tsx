"use client";

import { useState, useEffect } from "react";
import { TipoAtividade, Negocio } from "@/app/types/negocio";

interface ModalMarcarVisitaProps {
  clienteNome: string;
  onClose: () => void;
  onSalvar: (visita: {
    tipo: TipoAtividade;
    titulo: string;
    descricao?: string;
    dataAgendamento: string;
    localizacao?: string;
    observacoes?: string;
    negocioId?: string;
  }) => void;
}

export default function ModalMarcarVisita({
  clienteNome,
  onClose,
  onSalvar,
}: ModalMarcarVisitaProps) {
  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [negocioSelecionado, setNegocioSelecionado] = useState("");
  const [tipo, setTipo] = useState<TipoAtividade>("visita");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataAgendamento, setDataAgendamento] = useState("");
  const [horaAgendamento, setHoraAgendamento] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [observacoes, setObservacoes] = useState("");

  useEffect(() => {
    const negociosSalvos = localStorage.getItem("negocios");
    if (negociosSalvos) {
      setNegocios(JSON.parse(negociosSalvos));
      if (clienteNome && clienteNome !== "Novo Cliente") {
        const negocio = JSON.parse(negociosSalvos).find(
          (n: Negocio) => n.cliente === clienteNome
        );
        if (negocio) {
          setNegocioSelecionado(negocio.id);
        }
      }
    }
  }, [clienteNome]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !dataAgendamento) {
      alert("Preencha título e data");
      return;
    }
    if (!negocioSelecionado && negocios.length > 0) {
      alert("Selecione um cliente");
      return;
    }

    const dataHoraCompleta = horaAgendamento
      ? `${dataAgendamento}T${horaAgendamento}`
      : `${dataAgendamento}T09:00`;

    onSalvar({
      tipo,
      titulo,
      descricao: descricao || undefined,
      dataAgendamento: dataHoraCompleta,
      localizacao: localizacao || undefined,
      observacoes: observacoes || undefined,
      negocioId: negocioSelecionado || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-black dark:text-white">
              Agendar Atividade
            </h2>
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-black dark:hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          {negocios.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Cliente <span className="text-red-500">*</span>
              </label>
              <select
                value={negocioSelecionado}
                onChange={(e) => setNegocioSelecionado(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um cliente</option>
                {negocios.map((negocio) => (
                  <option key={negocio.id} value={negocio.id}>
                    {negocio.cliente}
                  </option>
                ))}
              </select>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Tipo de Atividade <span className="text-red-500">*</span>
              </label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as TipoAtividade)}
                required
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="visita">Visita</option>
                <option value="ligacao">Ligação</option>
                <option value="email">Email</option>
                <option value="reuniao">Reunião</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Visita ao imóvel em..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Data <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={dataAgendamento}
                  onChange={(e) => setDataAgendamento(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Hora
                </label>
                <input
                  type="time"
                  value={horaAgendamento}
                  onChange={(e) => setHoraAgendamento(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {tipo === "visita" || tipo === "reuniao" ? (
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Localização
                </label>
                <input
                  type="text"
                  value={localizacao}
                  onChange={(e) => setLocalizacao(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Endereço ou local"
                />
              </div>
            ) : null}

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Descrição
              </label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Detalhes da atividade..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Observações
              </label>
              <textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Observações adicionais..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-200 dark:bg-zinc-700 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Agendar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

