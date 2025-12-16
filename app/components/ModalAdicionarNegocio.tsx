"use client";

import { useState } from "react";
import { Corretor, StatusNegocio } from "@/app/types/negocio";

interface ModalAdicionarNegocioProps {
  corretores: Corretor[];
  onClose: () => void;
  onAdicionar: (negocio: {
    cliente: string;
    corretor: string;
    valor: number;
    status: StatusNegocio;
    observacoes?: string;
  }) => void;
}

export default function ModalAdicionarNegocio({
  corretores,
  onClose,
  onAdicionar,
}: ModalAdicionarNegocioProps) {
  const [cliente, setCliente] = useState("");
  const [corretor, setCorretor] = useState("");
  const [valor, setValor] = useState("");
  const [status, setStatus] = useState<StatusNegocio>("qualificando");
  const [observacoes, setObservacoes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliente || !corretor || !valor) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    onAdicionar({
      cliente,
      corretor,
      valor: parseFloat(valor.replace(/[^\d,.-]/g, "").replace(",", ".")),
      status,
      observacoes: observacoes || undefined,
    });

    // Limpar formulário
    setCliente("");
    setCorretor("");
    setValor("");
    setStatus("qualificando");
    setObservacoes("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-black dark:text-white">
              Adicionar Negócio
            </h2>
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-black dark:hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Cliente <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nome do cliente"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Corretor <span className="text-red-500">*</span>
              </label>
              <select
                value={corretor}
                onChange={(e) => setCorretor(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um corretor</option>
                {corretores.map((c) => (
                  <option key={c.id} value={c.nome}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Valor <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="R$ 0,00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusNegocio)}
                required
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="qualificando">Qualificando</option>
                <option value="conhecendo">Conhecendo</option>
                <option value="agendando">Agendando</option>
                <option value="negociando">Negociando</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Observações
              </label>
              <textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Observações sobre o negócio..."
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
                Adicionar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

