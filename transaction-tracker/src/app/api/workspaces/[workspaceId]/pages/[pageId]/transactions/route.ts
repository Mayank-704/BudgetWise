import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Workspace from "@/lib/models/Workspace";

// GET: List transactions in a page
export async function GET(req: NextRequest, { params }: { params: { workspaceId: string, pageId: string } }) {
  await dbConnect();
  const { workspaceId, pageId } = params;
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  const page = workspace.pages.id(pageId);
  if (!page) return NextResponse.json({ error: "Page not found" }, { status: 404 });
  return NextResponse.json(page.transactions);
}

// POST: Add a new transaction to a page
export async function POST(req: NextRequest, { params }: { params: { workspaceId: string, pageId: string } }) {
  await dbConnect();
  const { workspaceId, pageId } = params;
  const { amount, currency, date, status, description } = await req.json();
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  const page = workspace.pages.id(pageId);
  if (!page) return NextResponse.json({ error: "Page not found" }, { status: 404 });
  page.transactions.push({ amount, currency, date, status, description });
  await workspace.save();
  return NextResponse.json(page.transactions[page.transactions.length - 1], { status: 201 });
}
