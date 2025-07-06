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
    <form className="space-y-4 bg-background p-4 rounded border mb-4" onSubmit={handleSubmit}>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="flex gap-2">
        <input
          type="number"
          min={0.01}
          step={0.01}
          className="input input-bordered w-1/2"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
        />
        <select
          className="select select-bordered w-1/2"
          value={currency}
          onChange={e => setCurrency(e.target.value)}
        >
          {currencyOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      {/* Show currency icon next to select (not inside <option>) */}
      <div className="flex items-center gap-2 mt-1">
        {currency === "USD" && <FaDollarSign />}
        {currency === "EUR" && <FaEuroSign />}
        {currency === "INR" && <FaRupeeSign />}
        {currency === "JPY" && <FaYenSign />}
      </div>
      </div>
      <div className="flex gap-2">
        <input
          type="date"
          className="input input-bordered w-1/2"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        <select
          className="select select-bordered w-1/2"
          value={status}
          onChange={e => setStatus(e.target.value as Transaction["status"])}
        >
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
        </select>
      </div>
      <input
        type="text"
        className="input input-bordered w-full"
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <div className="flex gap-2 justify-end">
        <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">{initial ? "Update" : "Add"}</button>
      </div>
    </form>
  );
};

export default TransactionForm;
