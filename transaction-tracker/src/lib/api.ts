import { Workspace, Page, Transaction } from "@/types";

const API = {
  async getWorkspaces(): Promise<Workspace[]> {
    const res = await fetch("/api/workspaces");
    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }
    try {
      return await res.json();
    } catch {
      return [];
    }
  },
  async createWorkspace(name: string): Promise<Workspace> {
    const res = await fetch("/api/workspaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    try {
      return await res.json();
    } catch {
      return { name, pages: [] } as Workspace;
    }
  },
  async getPages(workspaceId: string): Promise<Page[]> {
    const res = await fetch(`/api/workspaces/${workspaceId}/pages`);
    try {
      return await res.json();
    } catch {
      return [];
    }
  },
  async createPage(workspaceId: string, name: string): Promise<Page> {
    const res = await fetch(`/api/workspaces/${workspaceId}/pages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    try {
      return await res.json();
    } catch {
      return { name, transactions: [] } as Page;
    }
  },
  async getTransactions(workspaceId: string, pageId: string): Promise<Transaction[]> {
    const res = await fetch(`/api/workspaces/${workspaceId}/pages/${pageId}/transactions`);
    try {
      return await res.json();
    } catch {
      return [];
    }
  },
  async createTransaction(workspaceId: string, pageId: string, data: Partial<Transaction>): Promise<Transaction> {
    const res = await fetch(`/api/workspaces/${workspaceId}/pages/${pageId}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    try {
      return await res.json();
    } catch {
      return data as Transaction;
    }
  },
  async updateTransaction(workspaceId: string, pageId: string, transactionId: string, data: Partial<Transaction>): Promise<Transaction> {
    const res = await fetch(`/api/workspaces/${workspaceId}/pages/${pageId}/transactions/${transactionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    try {
      return await res.json();
    } catch {
      return data as Transaction;
    }
  },
  async deleteTransaction(workspaceId: string, pageId: string, transactionId: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/workspaces/${workspaceId}/pages/${pageId}/transactions/${transactionId}`, {
      method: "DELETE",
    });
    try {
      return await res.json();
    } catch {
      return { success: false };
    }
  },
};

export default API;
