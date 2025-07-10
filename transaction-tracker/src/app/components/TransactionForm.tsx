// TransactionForm.tsx
// Add/Edit transaction modal/form
import React, { useState } from "react";
import { Transaction } from "@/types";
import { FaDollarSign, FaEuroSign, FaRupeeSign, FaYenSign } from "react-icons/fa";


interface Props {
  initial?: Transaction | null;
  onSave: (data: Partial<Transaction>, id?: string) => void;
  onCancel: () => void;
}

const currencyOptions = [
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "INR", label: "INR" },
  { value: "JPY", label: "JPY" },
];

const TransactionForm = ({ initial, onSave, onCancel }: Props) => {
  const [amount, setAmount] = useState(initial?.amount || 0);
  const [currency, setCurrency] = useState(initial?.currency || "USD");
  const [date, setDate] = useState(initial?.date ? initial.date.slice(0, 10) : "");
  const [status, setStatus] = useState<Transaction["status"]>(initial?.status || "debit");
  const [description, setDescription] = useState(initial?.description || "");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return setError("Date is required");
    if (amount <= 0) return setError("Amount must be greater than 0");
    setError("");
    onSave({ amount, currency, date, status, description }, initial?._id);
  };

  return (
    <form className="space-y-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl border shadow mb-4 transition-all duration-300" onSubmit={handleSubmit}>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="block text-xs font-medium mb-1">Amount</label>
          <input
            type="number"
            min={0.01}
            step={0.01}
            className="input input-bordered w-full rounded-lg px-3 py-2"
            placeholder="Amount"
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium mb-1">Currency</label>
          <div className="flex items-center gap-2">
            <select
              className="select select-bordered w-full rounded-lg px-3 py-2"
              value={currency}
              onChange={e => setCurrency(e.target.value)}
            >
              {currencyOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {/* Show currency icon next to select (not inside <option>) */}
            <span className="ml-1">
              {currency === "USD" && <FaDollarSign />}
              {currency === "EUR" && <FaEuroSign />}
              {currency === "INR" && <FaRupeeSign />}
              {currency === "JPY" && <FaYenSign />}
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="block text-xs font-medium mb-1">Date</label>
          <input
            type="date"
            className="input input-bordered w-full rounded-lg px-3 py-2"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium mb-1">Status</label>
          <select
            className="select select-bordered w-full rounded-lg px-3 py-2"
            value={status}
            onChange={e => setStatus(e.target.value as Transaction["status"])}
          >
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">Description</label>
        <input
          type="text"
          className="input input-bordered w-full rounded-lg px-3 py-2"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>
      <div className="flex gap-2 justify-end mt-4">
        <button type="button" className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all duration-200" onClick={onCancel}>Cancel</button>
        <button type="submit" className="rounded-lg bg-primary text-white px-4 py-2 shadow hover:bg-primary/90 transition-all duration-200">{initial ? "Update" : "Add"}</button>
      </div>
    </form>
  );
};

export default TransactionForm;
