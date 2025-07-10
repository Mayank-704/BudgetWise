// TrackingTable.tsx
// Notion-like table for transactions

import React, { useEffect, useState } from "react";
import API from "@/lib/api";
import { Transaction } from "@/types";
import { FaDollarSign, FaEuroSign, FaRupeeSign, FaYenSign } from "react-icons/fa";
import TransactionForm from "./TransactionForm";
import { useAppStore } from "@/lib/store";

const currencyIcons: Record<string, React.ReactNode> = {
  USD: <FaDollarSign className="inline" />, 
  EUR: <FaEuroSign className="inline" />, 
  INR: <FaRupeeSign className="inline" />, 
  JPY: <FaYenSign className="inline" />,
};

const TrackingTable = () => {
  const workspaceId = useAppStore((s) => s.selectedWorkspaceId);
  const pageId = useAppStore((s) => s.selectedPageId);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!workspaceId || !pageId) return;
    setLoading(true);
    API.getTransactions(workspaceId, pageId)
      .then(setTransactions)
      .finally(() => setLoading(false));
  }, [workspaceId, pageId]);

  const handleSave = async (data: Partial<Transaction>, id?: string) => {
    if (!workspaceId || !pageId) return;
    setLoading(true);
    if (id) {
      await API.updateTransaction(workspaceId, pageId, id, data);
    } else {
      await API.createTransaction(workspaceId, pageId, data);
    }
    const updated = await API.getTransactions(workspaceId, pageId);
    setTransactions(updated);
    setShowForm(false);
    setEditing(null);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!workspaceId || !pageId) return;
    setLoading(true);
    await API.deleteTransaction(workspaceId, pageId, id);
    setTransactions(transactions.filter(t => t._id !== id));
    setLoading(false);
  };

  return (
    <div className="overflow-x-auto rounded-2xl border bg-white dark:bg-zinc-900 p-6 shadow transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <span className="font-semibold text-lg">Transactions</span>
        <button className="rounded-lg bg-primary text-white px-4 py-2 shadow hover:bg-primary/90 transition-all duration-200" onClick={() => { setEditing(null); setShowForm(true); }}>Add Transaction</button>
      </div>
      {showForm && (
        <TransactionForm
          initial={editing}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm rounded-lg">
          <thead>
            <tr className="bg-zinc-100 dark:bg-zinc-800">
              <th className="text-center align-middle py-3 px-2">Amount</th>
              <th className="text-center align-middle py-3 px-2">Currency</th>
              <th className="text-center align-middle py-3 px-2">Date</th>
              <th className="text-center align-middle py-3 px-2">Status</th>
              <th className="text-center align-middle py-3 px-2">Description</th>
              <th className="text-center align-middle py-3 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center align-middle py-4">Loading...</td></tr>
            ) : transactions.length === 0 ? (
              <tr><td colSpan={6} className="text-center align-middle py-4">No transactions</td></tr>
            ) : (
              transactions.map((t, idx) => (
                <tr key={t._id} className={`text-center align-middle transition-colors duration-200 ${idx % 2 === 0 ? 'bg-zinc-50 dark:bg-zinc-950' : 'bg-white dark:bg-zinc-900'} hover:bg-primary/10 dark:hover:bg-primary/20`}>
                  <td className="align-middle py-2 px-2">{t.amount}</td>
                  <td className="align-middle py-2 px-2">{currencyIcons[t.currency] || t.currency}</td>
                  <td className="align-middle py-2 px-2">{t.date?.slice(0, 10)}</td>
                  <td className="align-middle py-2 px-2 capitalize">{t.status}</td>
                  <td className="align-middle py-2 px-2">{t.description}</td>
                  <td className="align-middle py-2 px-2">
                    <button className="rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 px-2 py-1 mr-2 hover:bg-primary/20 transition-all duration-200" onClick={() => { setEditing(t); setShowForm(true); }}>Edit</button>
                    <button className="rounded bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 px-2 py-1 hover:bg-red-200 dark:hover:bg-red-800 transition-all duration-200" onClick={() => handleDelete(t._id!)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


export default TrackingTable;
