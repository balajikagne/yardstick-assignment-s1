import TransactionForm from "@/components/TransactionForm";
import { getTransactionById } from "@/lib/actions";
import { notFound } from "next/navigation";

export default async function EditTransactionPage(props: {
  params: { id: string };
}) {
  const { id } = props.params;
  const transaction = await getTransactionById(id);
  

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
