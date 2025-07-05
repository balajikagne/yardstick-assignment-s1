import TransactionForm from "@/components/TransactionForm";
import { getTransactionById } from "@/lib/actions";
import { notFound } from "next/navigation";

export default async function EditTransactionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const transaction = await getTransactionById(id);
  if (!transaction) return notFound();

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Transaction</h2>
      <TransactionForm
        initialData={{
          _id: transaction._id.toString(),
          amount: transaction.amount,
          description: transaction.description,
          date:
            typeof transaction.date === "string"
              ? transaction.date
              : transaction.date.toISOString().split("T")[0],
        }}
      />
    </div>
  );
}
