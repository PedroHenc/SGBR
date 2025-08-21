export type TransactionType = 'revenue' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: Date;
  categoryId: string;
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

export interface Collaborator {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
}
