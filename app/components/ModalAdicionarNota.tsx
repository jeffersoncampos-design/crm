"use client";

import { useState } from "react";

interface ModalAdicionarNotaProps {
  clienteNome: string;
  onClose: () => void;
  onSalvar: (nota: string) => void;
}

export default function ModalAdicionarNota({
  clienteNome,
  onClose,
  onSalvar,
}: ModalAdicionarNotaProps) {
  const [nota, setNota] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nota.trim()) {
      alert("Digite uma nota");
      return;
    }
    onSalvar(nota);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-black dark:text-white">
              Adicionar Nota
            </h2>
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-black dark:hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            Cliente: <span className="font-semibold">{clienteNome}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Nota <span className="text-red-500">*</span>
              </label>
              <textarea
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                required
                rows={6}
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Digite sua nota aqui..."
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
                Salvar Nota
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

