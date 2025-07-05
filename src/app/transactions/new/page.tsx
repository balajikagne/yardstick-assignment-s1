import TransactionForm from "@/components/TransactionForm";

export default function AddTransactionPage() {
  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Add Transaction</h2>
      <TransactionForm />
    </div>
  );
}
