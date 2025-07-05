import { connectToDB } from "./db";
import mongoose, { Schema, model, models } from "mongoose";

// Define the Transaction schema
const transactionSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: String, // or Date, if you prefer
    required: true,
  },
});

// Use existing model if it exists to avoid overwrite error in dev
const Transaction = models.Transaction || model("Transaction", transactionSchema);

// Get all transactions
export async function getTransactions() {
  await connectToDB();
  return await Transaction.find().sort({ date: -1 });
}

// Add a new transaction
export async function addTransaction(data: {
  amount: number;
  description: string;
  date: string;
}) {
  await connectToDB();
  const newTxn = new Transaction(data);
  return await newTxn.save();
}

// Update a transaction
export async function updateTransaction(id: string, data: {
  amount: number;
  description: string;
  date: string;
}) {
  await connectToDB();
  return await Transaction.findByIdAndUpdate(id, data, { new: true });
}

// Delete a transaction
export async function deleteTransaction(id: string) {
  await connectToDB();
  return await Transaction.findByIdAndDelete(id);
}

// Get a single transaction by ID
export async function getTransactionById(id: string) {
  await connectToDB();
  return await Transaction.findById(id);
}
