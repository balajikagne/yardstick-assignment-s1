import TransactionForm from "@/components/TransactionForm";
import { getTransactionById } from "@/lib/actions";
import { notFound } from "next/navigation";

export default async function EditTransactionPage({
  params,
}: {
  params: { id: string };
}) {
  const transaction = await getTransactionById(params.id);

  if (!transaction) return notFound();

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Transaction</h2>
      <TransactionForm
        initialData={{
          _id: transaction._id.toString(), // convert ObjectId
          amount: transaction.amount,
          description: transaction.description,
          date: transaction.date,
        }}
      />
    </div>
  );
}
