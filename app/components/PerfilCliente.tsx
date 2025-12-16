"use client";

import { PerfilCliente as PerfilClienteType } from "@/app/types/negocio";
import { useState } from "react";

interface PerfilClienteProps {
  perfil?: PerfilClienteType;
  clienteNome: string;
  onSalvar: (perfil: PerfilClienteType) => void;
}

export default function PerfilCliente({
  perfil,
  clienteNome,
  onSalvar,
}: PerfilClienteProps) {
  const [editando, setEditando] = useState(!perfil);
  const [formData, setFormData] = useState<PerfilClienteType>({
    nome: clienteNome,
    email: perfil?.email || "",
    telefone: perfil?.telefone || "",
    empresa: perfil?.empresa || "",
    cargo: perfil?.cargo || "",
    endereco: perfil?.endereco || "",
    cidade: perfil?.cidade || "",
    estado: perfil?.estado || "",
    cep: perfil?.cep || "",
    observacoesGerais: perfil?.observacoesGerais || "",
  });

  const handleSalvar = () => {
    onSalvar(formData);
    setEditando(false);
  };

  if (!editando && perfil) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-black dark:text-white">
            Perfil do Cliente
          </h3>
          <button
            onClick={() => setEditando(true)}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Editar
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {perfil.email && (
            <div>
              <p className="text-zinc-600 dark:text-zinc-400">Email</p>
              <p className="text-black dark:text-white font-medium">{perfil.email}</p>
            </div>
          )}
          {perfil.telefone && (
            <div>
              <p className="text-zinc-600 dark:text-zinc-400">Telefone</p>
              <p className="text-black dark:text-white font-medium">{perfil.telefone}</p>
            </div>
          )}
          {perfil.empresa && (
            <div>
              <p className="text-zinc-600 dark:text-zinc-400">Empresa</p>
              <p className="text-black dark:text-white font-medium">{perfil.empresa}</p>
            </div>
          )}
          {perfil.cargo && (
            <div>
              <p className="text-zinc-600 dark:text-zinc-400">Cargo</p>
              <p className="text-black dark:text-white font-medium">{perfil.cargo}</p>
            </div>
          )}
          {perfil.endereco && (
            <div className="md:col-span-2">
              <p className="text-zinc-600 dark:text-zinc-400">Endereço</p>
              <p className="text-black dark:text-white font-medium">
                {perfil.endereco}
                {perfil.cidade && `, ${perfil.cidade}`}
                {perfil.estado && ` - ${perfil.estado}`}
                {perfil.cep && ` (${perfil.cep})`}
              </p>
            </div>
          )}
          {perfil.observacoesGerais && (
            <div className="md:col-span-2">
              <p className="text-zinc-600 dark:text-zinc-400">Observações</p>
              <p className="text-black dark:text-white">{perfil.observacoesGerais}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
      <h3 className="text-lg font-bold text-black dark:text-white mb-4">
        Perfil do Cliente
      </h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email || ""}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-1">
              Telefone
            </label>
            <input
              type="tel"
              value={formData.telefone || ""}
              onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-1">
              Empresa
            </label>
            <input
              type="text"
              value={formData.empresa || ""}
              onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-1">
              Cargo
            </label>
            <input
              type="text"
              value={formData.cargo || ""}
              onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-black dark:text-white mb-1">
              Endereço
            </label>
            <input
              type="text"
              value={formData.endereco || ""}
              onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-1">
              Cidade
            </label>
            <input
              type="text"
              value={formData.cidade || ""}
              onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-1">
              Estado
            </label>
            <input
              type="text"
              value={formData.estado || ""}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-1">
              CEP
            </label>
            <input
              type="text"
              value={formData.cep || ""}
              onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-black dark:text-white mb-1">
            Observações Gerais
          </label>
          <textarea
            value={formData.observacoesGerais || ""}
            onChange={(e) => setFormData({ ...formData, observacoesGerais: e.target.value })}
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
          {perfil && (
            <button
              onClick={() => {
                setFormData({
                  nome: clienteNome,
                  ...perfil,
                });
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

