"use client";

import { Corretor } from "@/app/types/negocio";

interface FiltrosFunilProps {
  corretores: Corretor[];
  filtroCorretor: string;
  filtroData: string;
  onFiltroCorretorChange: (corretor: string) => void;
  onFiltroDataChange: (data: string) => void;
}

export default function FiltrosFunil({
  corretores,
  filtroCorretor,
  filtroData,
  onFiltroCorretorChange,
  onFiltroDataChange,
}: FiltrosFunilProps) {
  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm font-medium text-black dark:text-white mb-2">
          Filtrar por Corretor
        </label>
        <select
          value={filtroCorretor}
          onChange={(e) => onFiltroCorretorChange(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os corretores</option>
          {corretores.map((corretor) => (
            <option key={corretor.id} value={corretor.nome}>
              {corretor.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm font-medium text-black dark:text-white mb-2">
          Filtrar por Data
        </label>
        <input
          type="date"
          value={filtroData}
          onChange={(e) => onFiltroDataChange(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {(filtroCorretor || filtroData) && (
        <button
          onClick={() => {
            onFiltroCorretorChange("");
            onFiltroDataChange("");
          }}
          className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          Limpar Filtros
        </button>
      )}
    </div>
  );
}

