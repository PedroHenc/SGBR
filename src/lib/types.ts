export type TransactionType = 'revenue' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: Date;
  categoryId: string;
  collaboratorId: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Appointment {
  id: string;
  title: string;
  date: Date;
}

export interface Skill {
  id: string;
  name: string;
}

export interface Collaborator {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  skills?: string[]; // Array of skill IDs
}
