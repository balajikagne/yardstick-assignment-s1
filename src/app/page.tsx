import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="text-3xl font-bold">💰 Personal Finance Visualizer</h1>
      <p className="text-gray-600 max-w-md">
        Track your income and expenses with charts and full transaction history.
      </p>

      <Link href="/transactions">
        <Button className="text-lg px-6 py-4">View Transactions</Button>
      </Link>
    </div>
  );
}
