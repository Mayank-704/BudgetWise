import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Workspace from "@/lib/models/Workspace";

// GET: List pages in a workspace
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ workspaceId: string }> }
) {
  await dbConnect();
  const { workspaceId } = await context.params;
  if (!workspaceId || workspaceId === "null") {
    return NextResponse.json([], { status: 200 });
  }
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace)
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  return NextResponse.json(workspace.pages);
}

// POST: Add a new page to a workspace
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ workspaceId: string }> }
) {
  await dbConnect();
  const { workspaceId } = await context.params;
  if (!workspaceId || workspaceId === "null") {
    return NextResponse.json({ error: "Invalid workspaceId" }, { status: 400 });
  }
  const { name } = await req.json();
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace)
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  workspace.pages.push({ name, transactions: [] });
  await workspace.save();
  return NextResponse.json(workspace.pages[workspace.pages.length - 1], {
    status: 201,
  });
}
