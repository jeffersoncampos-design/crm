"use client";

import { BuscaCliente as BuscaClienteType } from "@/app/types/negocio";
import { useState } from "react";

interface BuscaClienteProps {
  busca?: BuscaClienteType;
  onSalvar: (busca: BuscaClienteType) => void;
}

export default function BuscaCliente({ busca, onSalvar }: BuscaClienteProps) {
  const [editando, setEditando] = useState(!busca);
  const [formData, setFormData] = useState<BuscaClienteType>({
    tipoImovel: busca?.tipoImovel || "",
    bairro: busca?.bairro || "",
    valorMinimo: busca?.valorMinimo || undefined,
    valorMaximo: busca?.valorMaximo || undefined,
    quartos: busca?.quartos || undefined,
    banheiros: busca?.banheiros || undefined,
    vagas: busca?.vagas || undefined,
    areaMinima: busca?.areaMinima || undefined,
    areaMaxima: busca?.areaMaxima || undefined,
    observacoes: busca?.observacoes || "",
  });

  const formatarValor = (valor?: number) => {
    if (!valor) return "";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const handleSalvar = () => {
    onSalvar(formData);
    setEditando(false);
  };

  if (!editando && busca) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-black dark:text-white">
            O que ele busca
          </h3>
          <button
            onClick={() => setEditando(true)}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Editar
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {busca.tipoImovel && (
            <div>
              <p className="text-zinc-600 dark:text-zinc-400">Tipo de Imóvel</p>
              <p className="text-black dark:text-white font-medium">{busca.tipoImovel}</p>
            </div>
          )}
          {busca.bairro && (
            <div>
              <p className="text-zinc-600 dark:text-zinc-400">Bairro</p>
              <p className="text-black dark:text-white font-medium">{busca.bairro}</p>
            </div>
          )}
          {(busca.valorMinimo || busca.valorMaximo) && (
            <div>
              <p className="text-zinc-600 dark:text-zinc-400">Faixa de Valor</p>
              <p className="text-black dark:text-white font-medium">
                {busca.valorMinimo && formatarValor(busca.valorMinimo)}
                {busca.valorMinimo && busca.valorMaximo && " até "}
                {busca.valorMaximo && formatarValor(busca.valorMaximo)}
              </p>
            </div>
          )}
          {(busca.quartos || busca.banheiros || busca.vagas) && (
            <div>
              <p className="text-zinc-600 dark:text-zinc-400">Características</p>
              <p className="text-black dark:text-white font-medium">
                {busca.quartos && `${busca.quartos} quartos`}
                {busca.quartos && busca.banheiros && ", "}
                {busca.banheiros && `${busca.banheiros} banheiros`}
                {busca.vagas && `, ${busca.vagas} vagas`}
              </p>
            </div>
          )}
          {(busca.areaMinima || busca.areaMaxima) && (
            <div>
              <p className="text-zinc-600 dark:text-zinc-400">Área</p>
              <p className="text-black dark:text-white font-medium">
                {busca.areaMinima && `${busca.areaMinima}m²`}
                {busca.areaMinima && busca.areaMaxima && " até "}
                {busca.areaMaxima && `${busca.areaMaxima}m²`}
              </p>
            </div>
          )}
          {busca.observacoes && (
            <div className="md:col-span-2">
              <p className="text-zinc-600 dark:text-zinc-400">Observações</p>
              <p className="text-black dark:text-white">{busca.observacoes}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
      <h3 className="text-lg font-bold text-black dark:text-white mb-4">
        O que ele busca
      </h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-1">
              Tipo de Imóvel
            </label>
            <input
              type="text"
              value={formData.tipoImovel || ""}
              onChange={(e) => setFormData({ ...formData, tipoImovel: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white"
              placeholder="Ex: Apartamento, Casa..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-1">
              Bairro
            </label>
            <input
              type="text"
              value={formData.bairro || ""}
              onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-1">
              Valor Mínimo
            </label>
            <input
              type="number"
              value={formData.valorMinimo || ""}
              onChange={(e) =>
                setFormData({ ...formData, valorMinimo: e.target.value ? Number(e.target.value) : undefined })
              }
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-1">
              Valor Máximo
            </label>
            <input
              type="number"
              value={formData.valorMaximo || ""}
              onChange={(e) =>
                setFormData({ ...formData, valorMaximo: e.target.value ? Number(e.target.value) : undefined })
              }
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-1">
              Quartos
            </label>
            <input
              type="number"
              value={formData.quartos || ""}
              onChange={(e) =>
                setFormData({ ...formData, quartos: e.target.value ? Number(e.target.value) : undefined })
              }
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-1">
              Banheiros
            </label>
            <input
              type="number"
              value={formData.banheiros || ""}
              onChange={(e) =>
                setFormData({ ...formData, banheiros: e.target.value ? Number(e.target.value) : undefined })
              }
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-1">
              Vagas
            </label>
            <input
              type="number"
              value={formData.vagas || ""}
              onChange={(e) =>
                setFormData({ ...formData, vagas: e.target.value ? Number(e.target.value) : undefined })
              }
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-1">
              Área Mínima (m²)
            </label>
            <input
              type="number"
              value={formData.areaMinima || ""}
              onChange={(e) =>
                setFormData({ ...formData, areaMinima: e.target.value ? Number(e.target.value) : undefined })
              }
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-1">
              Área Máxima (m²)
            </label>
            <input
              type="number"
              value={formData.areaMaxima || ""}
              onChange={(e) =>
                setFormData({ ...formData, areaMaxima: e.target.value ? Number(e.target.value) : undefined })
              }
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-black dark:text-white mb-1">
            Observações
          </label>
          <textarea
            value={formData.observacoes || ""}
            onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSalvar}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            Salvar
          </button>
          {busca && (
            <button
              onClick={() => {
                setFormData(busca);
                setEditando(false);
              }}
              className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 text-sm"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

