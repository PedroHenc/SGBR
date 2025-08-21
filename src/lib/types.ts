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
}

export interface Appointment {
  id: string;
  title: string;
  date: Date;
}
