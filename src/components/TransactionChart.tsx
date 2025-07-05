"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Swal from "sweetalert2";

interface Transaction {
  _id: string;
  amount: number;
  description: string;
  date: string;
}

export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/transactions");
      const data = await res.json();

      if (Array.isArray(data)) {
        setTransactions(data);
        processChartData(data);
      } else {
        throw new Error("Invalid response");
      }
    } catch (err) {
      console.error("Failed to fetch transactions", err);
      Swal.fire("Error", "Failed to fetch transactions", "error");
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (data: Transaction[]) => {
    const monthlyMap: { [key: string]: number } = {};

    data.forEach(({ amount, date }) => {
      const month = new Date(date).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      monthlyMap[month] = (monthlyMap[month] || 0) + amount;
    });

    const chartData = Object.entries(monthlyMap).map(([month, total]) => ({
      month,
      total,
    }));

    setMonthlyData(chartData);
  };

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This transaction will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`/api/transactions?id=${id}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Failed to delete");

        await Swal.fire("Deleted!", "Transaction has been deleted.", "success");
        fetchData();
      } catch (err) {
        Swal.fire("Error", "Failed to delete transaction", "error");
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="mt-6 space-y-6">
      <h2 className="text-lg font-bold">Monthly Expenses</h2>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[300px]">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mb-4" />
          <p className="text-gray-500">Loading transactions...</p>
        </div>
      ) : (
        <>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <h2 className="text-lg font-bold">Transaction List</h2>
          {transactions.length === 0 ? (
            <p>No transactions found.</p>
          ) : (
            transactions.map((txn) => (
              <div
                key={txn._id}
                className="border p-3 rounded-md flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{txn.description}</p>
                  <p>
                    ₹{txn.amount} •{" "}
                    {new Date(txn.date).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <div className="space-x-2">
                  <Link href={`/transactions/${txn._id}`}>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(txn._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}
