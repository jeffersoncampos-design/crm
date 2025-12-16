"use client";

import { useState } from "react";
import { Negocio, StatusNegocio } from "@/app/types/negocio";
import NegocioCard from "./NegocioCard";

interface KanbanColumnProps {
  titulo: string;
  cor: string;
  negocios: Negocio[];
  status: StatusNegocio;
  onMoverNegocio: (negocioId: string, novoStatus: StatusNegocio) => void;
  onExcluirNegocio: (negocioId: string) => void;
}

const statusOrder: StatusNegocio[] = ["qualificando", "conhecendo", "agendando", "negociando"];

export default function KanbanColumn({
  titulo,
  cor,
  negocios,
  status,
  onMoverNegocio,
  onExcluirNegocio,
}: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const currentIndex = statusOrder.indexOf(status);
  const podeAvancar = currentIndex < statusOrder.length - 1;
  const podeRetroceder = currentIndex > 0;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    try {
      const data = e.dataTransfer.getData("application/json");
      if (data) {
        const { id, status: statusAnterior } = JSON.parse(data);
        // Só mover se for para uma coluna diferente
        if (statusAnterior !== status) {
          onMoverNegocio(id, status);
        }
      } else {
        // Fallback para texto simples
        const negocioId = e.dataTransfer.getData("text/plain");
        if (negocioId) {
          const negocio = negocios.find((n) => n.id === negocioId);
          if (negocio && negocio.status !== status) {
            onMoverNegocio(negocioId, status);
          }
        }
      }
    } catch (error) {
      console.error("Erro ao processar drop:", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className={`${cor} text-white px-4 py-3 rounded-t-lg`}>
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">{titulo}</h3>
          <span className="bg-white/20 px-2 py-1 rounded text-sm">
            {negocios.length}
          </span>
        </div>
      </div>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`bg-white dark:bg-zinc-900 rounded-b-lg p-4 min-h-[500px] space-y-3 transition-all duration-200 ${
          isDragOver 
            ? "bg-blue-50 dark:bg-blue-900/30 border-2 border-dashed border-blue-500 ring-2 ring-blue-300 dark:ring-blue-700" 
            : ""
        }`}
      >
        {negocios.length === 0 ? (
          <div className="text-center text-zinc-400 dark:text-zinc-600 py-8">
            Nenhum negócio
          </div>
        ) : (
          negocios.map((negocio) => (
            <NegocioCard
              key={negocio.id}
              negocio={negocio}
              podeAvancar={podeAvancar}
              podeRetroceder={podeRetroceder}
              onMoverNegocio={onMoverNegocio}
              onExcluirNegocio={onExcluirNegocio}
            />
          ))
        )}
      </div>
    </div>
  );
}

