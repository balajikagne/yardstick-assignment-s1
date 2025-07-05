"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

interface Transaction {
  _id: string;
  amount: number;
  description: string;
  date: string;
}

export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      if (Array.isArray(data)) {
        setTransactions(data);
      }
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This transaction will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/transactions?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      await Swal.fire("Deleted!", "Transaction has been deleted.", "success");

      fetchData();
    } catch (err) {
      Swal.fire("Error", "Something went wrong while deleting", "error");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="mt-6 space-y-4">
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
                ₹{txn.amount} • {new Date(txn.date).toLocaleDateString()}
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
    </div>
  );
}
