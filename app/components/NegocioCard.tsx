"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Negocio, StatusNegocio } from "@/app/types/negocio";

interface NegocioCardProps {
  negocio: Negocio;
  podeAvancar: boolean;
  podeRetroceder: boolean;
  onMoverNegocio: (negocioId: string, novoStatus: StatusNegocio) => void;
  onExcluirNegocio: (negocioId: string) => void;
}

const statusOrder: StatusNegocio[] = ["qualificando", "conhecendo", "agendando", "negociando"];

export default function NegocioCard({
  negocio,
  podeAvancar,
  podeRetroceder,
  onMoverNegocio,
  onExcluirNegocio,
}: NegocioCardProps) {
  const router = useRouter();
  const currentIndex = statusOrder.indexOf(negocio.status);
  const proximoStatus = podeAvancar ? statusOrder[currentIndex + 1] : null;
  const statusAnterior = podeRetroceder ? statusOrder[currentIndex - 1] : null;

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const [isDragging, setIsDragging] = useState(false);
  const [dragStartTime, setDragStartTime] = useState(0);

  const handleCardClick = (e: React.MouseEvent) => {
    // Não navegar se acabou de arrastar (dentro de 200ms)
    const timeSinceDrag = Date.now() - dragStartTime;
    if (timeSinceDrag < 200) {
      return;
    }
    router.push(`/dash/funil/${negocio.id}`);
  };

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    setDragStartTime(Date.now());
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", negocio.id);
    e.dataTransfer.setData("application/json", JSON.stringify({ id: negocio.id, status: negocio.status }));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div 
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleCardClick}
      className={`bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700 hover:shadow-lg transition-all cursor-grab active:cursor-grabbing ${
        isDragging ? "opacity-50 scale-95 rotate-2" : "hover:scale-[1.02]"
      }`}
      title="Arraste para mover entre colunas ou clique para ver detalhes"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-black dark:text-white text-sm">
          {negocio.cliente}
        </h4>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onExcluirNegocio(negocio.id);
          }}
          className="text-red-500 hover:text-red-700 text-xs z-10"
          title="Excluir"
        >
          ×
        </button>
      </div>

      <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-2">
        {negocio.corretor}
      </p>

      <p className="text-lg font-bold text-green-600 dark:text-green-400 mb-3">
        {formatarValor(negocio.valor)}
      </p>

      {negocio.observacoes && (
        <p className="text-xs text-zinc-500 dark:text-zinc-500 mb-3 line-clamp-2">
          {negocio.observacoes}
        </p>
      )}

      <div className="text-xs text-zinc-500 dark:text-zinc-500 mb-3">
        Criado em {formatarData(negocio.dataCriacao)}
      </div>

      <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
        {podeRetroceder && statusAnterior && (
          <button
            onClick={() => onMoverNegocio(negocio.id, statusAnterior)}
            className="flex-1 px-2 py-1 text-xs bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white rounded hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
          >
            ← Anterior
          </button>
        )}
        {podeAvancar && proximoStatus && (
          <button
            onClick={() => onMoverNegocio(negocio.id, proximoStatus)}
            className="flex-1 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Próximo →
          </button>
        )}
      </div>
    </div>
  );
}

