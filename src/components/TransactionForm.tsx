"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";

interface TransactionFormProps {
  initialData?: {
    _id?: string;
    amount: number;
    description: string;
    date: string;
  };
}

export default function TransactionForm({ initialData }: TransactionFormProps) {
  const [form, setForm] = useState({
    amount: initialData?.amount || "",
    description: initialData?.description || "",
    date: initialData?.date || "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.amount || !form.description || !form.date) {
      Swal.fire("Missing Fields", "All fields are required", "error");
      return;
    }

    setLoading(true);

    const method = initialData?._id ? "PUT" : "POST";
    const endpoint = initialData?._id
      ? `/api/transactions?id=${initialData._id}`
      : "/api/transactions";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Something went wrong");

      await Swal.fire({
        icon: "success",
        title: initialData?._id ? "Transaction Updated" : "Transaction Added",
        timer: 1500,
        showConfirmButton: false,
      });

      router.push("/transactions");
      router.refresh();
    } catch (err) {
      Swal.fire("Error", "Failed to save transaction", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-md mx-auto mt-4">
      <div>
        <Label>Amount</Label>
        <Input
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
          disabled={loading}
        />
      </div>
      <div>
        <Label>Description</Label>
        <Input
          name="description"
          value={form.description}
          onChange={handleChange}
          disabled={loading}
        />
      </div>
      <div>
        <Label>Date</Label>
        <Input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          disabled={loading}
        />
      </div>
      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Saving...
          </div>
        ) : (
          <>{initialData?._id ? "Update" : "Add"} Transaction</>
        )}
      </Button>
    </div>
  );
}
