import  { Schema, models, model } from "mongoose";

const TransactionSchema = new Schema({
  amount: { type: Number, required: true, min: 0.01 },
  currency: { type: String, required: true, default: "USD" },
  date: { type: Date, required: true },
  status: { type: String, enum: ["credit", "debit"], required: true },
  description: { type: String, default: "" },
}, { timestamps: true });

const PageSchema = new Schema({
  name: { type: String, required: true },
  transactions: [TransactionSchema],
}, { timestamps: true });

const WorkspaceSchema = new Schema({
  name: { type: String, required: true },
  pages: [PageSchema],
}, { timestamps: true });

export default models.Workspace || model("Workspace", WorkspaceSchema);
