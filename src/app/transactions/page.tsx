import TransactionChart from "@/components/TransactionChart";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function TransactionsPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Personal Finance</h1>
        <Link href="/transactions/new">
          <Button>Add Transaction</Button>
        </Link>
      </div>

      {/* Wrap each async child in Suspense */}
      <Suspense fallback={<LoadingSpinner />}>
        <TransactionChart />
      </Suspense>

      
    </div>
  );
}
