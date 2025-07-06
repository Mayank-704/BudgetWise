export interface Transaction {
  _id?: string;
  amount: number;
  currency: string;
  date: string;
  status: "credit" | "debit";
  description?: string;
}

export interface Page {
  _id?: string;
  name: string;
  transactions: Transaction[];
}

export interface Workspace {
  _id?: string;
  name: string;
  pages: Page[];
}
