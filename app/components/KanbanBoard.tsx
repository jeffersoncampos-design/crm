"use client";

import { Negocio, StatusNegocio } from "@/app/types/negocio";
import KanbanColumn from "./KanbanColumn";

interface KanbanBoardProps {
  negocios: Negocio[];
  onMoverNegocio: (negocioId: string, novoStatus: StatusNegocio) => void;
  onExcluirNegocio: (negocioId: string) => void;
}

const colunas: { status: StatusNegocio; titulo: string; cor: string }[] = [
  { status: "qualificando", titulo: "Qualificando", cor: "bg-blue-500" },
  { status: "conhecendo", titulo: "Conhecendo", cor: "bg-yellow-500" },
  { status: "agendando", titulo: "Agendando", cor: "bg-orange-500" },
  { status: "negociando", titulo: "Negociando", cor: "bg-green-500" },
];

export default function KanbanBoard({
  negocios,
  onMoverNegocio,
  onExcluirNegocio,
}: KanbanBoardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {colunas.map((coluna) => {
        const negociosColuna = negocios.filter((n) => n.status === coluna.status);
        return (
          <KanbanColumn
            key={coluna.status}
            titulo={coluna.titulo}
            cor={coluna.cor}
            negocios={negociosColuna}
            status={coluna.status}
            onMoverNegocio={onMoverNegocio}
            onExcluirNegocio={onExcluirNegocio}
          />
        );
      })}
    </div>
  );
}

