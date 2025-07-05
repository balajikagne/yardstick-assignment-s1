import { connectToDB } from "./db";
import { Schema, model, models, Document } from "mongoose";

// Define the Transaction TypeScript type
interface ITransaction extends Document {
  amount: number;
  description: string;
  date: string;
}

// Define the Mongoose schema
const transactionSchema = new Schema<ITransaction>({
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: String, // You can change to Date if needed
    required: true,
  },
});

// Use existing model if available to avoid overwrite error
const Transaction =
  models.Transaction || model<ITransaction>("Transaction", transactionSchema);

// Get all transactions
export async function getTransactions() {
  await connectToDB();
  return Transaction.find().sort({ date: -1 });
}

// Add a new transaction
export async function addTransaction(data: {
  amount: number;
  description: string;
  date: string;
}) {
  await connectToDB();
  const newTxn = new Transaction(data);
  return newTxn.save();
}

// Update an existing transaction
export async function updateTransaction(
  id: string,
  data: { amount: number; description: string; date: string }
) {
  await connectToDB();
  return Transaction.findByIdAndUpdate(id, data, { new: true });
}

// Delete a transaction
export async function deleteTransaction(id: string) {
  await connectToDB();
  return Transaction.findByIdAndDelete(id);
}

// Get transaction by ID
export async function getTransactionById(id: string) {
  await connectToDB();
  return Transaction.findById(id);
}
