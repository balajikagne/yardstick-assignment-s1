import TransactionForm from "@/components/TransactionForm";
import { getTransactionById } from "@/lib/actions";
import { notFound } from "next/navigation";

// Use this type for route params
interface PageProps {
  params: {
    id: string;
  };
}

export default async function EditTransactionPage({ params }: PageProps) {
  const transaction = await getTransactionById(params.id);

  if (!transaction) return notFound();

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Transaction</h2>
      <TransactionForm
        initialData={JSON.parse(JSON.stringify(transaction))}
      />
    </div>
  );
}
