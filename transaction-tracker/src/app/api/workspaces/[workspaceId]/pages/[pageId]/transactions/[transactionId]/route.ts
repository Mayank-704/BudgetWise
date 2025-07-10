import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Workspace from "@/lib/models/Workspace";

// PATCH: Edit a transaction
export async function PATCH(
  req: NextRequest,
  context: {
    params: Promise<{
      workspaceId: string;
      pageId: string;
      transactionId: string;
    }>;
  }
) {
  await dbConnect();
  const { workspaceId, pageId, transactionId } = await context.params;
  const update = await req.json();
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace)
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  const page = workspace.pages.id(pageId);
  if (!page)
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  const transaction = page.transactions.id(transactionId);
  if (!transaction)
    return NextResponse.json(
      { error: "Transaction not found" },
      { status: 404 }
    );
  Object.assign(transaction, update);
  await workspace.save();
  return NextResponse.json(transaction);
}

// DELETE: Remove a transaction
export async function DELETE(
  req: NextRequest,
  context: {
    params: Promise<{
      workspaceId: string;
      pageId: string;
      transactionId: string;
    }>;
  }
) {
  await dbConnect();
  const { workspaceId, pageId, transactionId } = await context.params;
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace)
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  const page = workspace.pages.id(pageId);
  if (!page)
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  // Remove transaction using pull (Mongoose subdocument array)
  const initialLength = page.transactions.length;
  page.transactions.pull({ _id: transactionId });
  if (page.transactions.length === initialLength) {
    return NextResponse.json(
      { error: "Transaction not found" },
      { status: 404 }
    );
  }
  await workspace.save();
  return NextResponse.json({ success: true });
}
