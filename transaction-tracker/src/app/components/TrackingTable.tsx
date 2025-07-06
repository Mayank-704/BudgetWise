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
    <div className="overflow-x-auto rounded-lg border bg-card p-4">
      <div className="flex justify-between mb-2">
        <span className="font-semibold">Transactions</span>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setShowForm(true); }}>Add Transaction</button>
      </div>
      {showForm && (
        <TransactionForm
          initial={editing}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}
      <table className="min-w-full text-sm">
        <thead>
          <tr>
            <th>Amount</th>
            <th>Currency</th>
            <th>Date</th>
            <th>Status</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={6} className="text-center">Loading...</td></tr>
          ) : transactions.length === 0 ? (
            <tr><td colSpan={6} className="text-center">No transactions</td></tr>
          ) : (
            transactions.map((t) => (
              <tr key={t._id}>
                <td>{t.amount}</td>
                <td>{currencyIcons[t.currency] || t.currency}</td>
                <td>{t.date?.slice(0, 10)}</td>
                <td>{t.status}</td>
                <td>{t.description}</td>
                <td>
                  <button className="btn btn-xs btn-outline mr-2" onClick={() => { setEditing(t); setShowForm(true); }}>Edit</button>
                  <button className="btn btn-xs btn-error" onClick={() => handleDelete(t._id!)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};


export default TrackingTable;
