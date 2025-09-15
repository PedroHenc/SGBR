export interface benneiro {
  id: number;
  nome: string;
  cargo: string;
  fotoPerfil?: string | null;
}

export interface Relatorios {
  id?: number;
  categoria?: string;
  cliente?: string;
  cpf?: number;
  lucro?: number;
  beneiro_id: number;
  edited_by?: string;
  created_at?: string;
  created_by?: string;
  veiculo?: string;
  escape?: string;
  leilao?: Boolean;
}
