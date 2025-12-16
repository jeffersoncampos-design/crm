export type StatusNegocio = "qualificando" | "conhecendo" | "agendando" | "negociando";

export type TipoAtividade = "visita" | "ligacao" | "email" | "reuniao" | "outro";

export interface HistoricoItem {
  id: string;
  tipo: "criacao" | "mudanca_status" | "atualizacao" | "observacao" | "nota" | "atividade";
  descricao: string;
  statusAnterior?: StatusNegocio;
  statusNovo?: StatusNegocio;
  data: string;
  usuario?: string;
  concluido?: boolean;
  atividadeId?: string;
}

export interface Atividade {
  id: string;
  negocioId: string;
  tipo: TipoAtividade;
  titulo: string;
  descricao?: string;
  dataAgendamento: string;
  dataConclusao?: string;
  concluido: boolean;
  responsavel: string;
  localizacao?: string;
  observacoes?: string;
}

export interface PerfilCliente {
  nome: string;
  email?: string;
  telefone?: string;
  empresa?: string;
  cargo?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  observacoesGerais?: string;
}

export interface BuscaCliente {
  tipoImovel?: string;
  bairro?: string;
  valorMinimo?: number;
  valorMaximo?: number;
  quartos?: number;
  banheiros?: number;
  vagas?: number;
  areaMinima?: number;
  areaMaxima?: number;
  observacoes?: string;
}

export interface Negocio {
  id: string;
  cliente: string;
  corretor: string;
  valor: number;
  status: StatusNegocio;
  observacoes?: string;
  dataCriacao: string;
  ultimaAtualizacao: string;
  historico: HistoricoItem[];
  perfil?: PerfilCliente;
  busca?: BuscaCliente;
}

export interface Corretor {
  id: string;
  nome: string;
}

