import { NextResponse } from "next/server";
import {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from "@/lib/actions";
import { connectToDB } from "@/lib/db";

// GET /api/transactions — fetch all transactions
export async function GET() {
  try {
    await connectToDB();
    const data = await getTransactions();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

// POST /api/transactions — create a new transaction
export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectToDB();
    const saved = await addTransaction(body);
    return NextResponse.json(saved);
  } catch {
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}

// PUT /api/transactions?id=... — update transaction
export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    await connectToDB();
    const updated = await updateTransaction(id, body);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}

// DELETE /api/transactions?id=... — delete transaction
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    await connectToDB();
    const deleted = await deleteTransaction(id);
    return NextResponse.json(deleted);
  } catch {
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}
