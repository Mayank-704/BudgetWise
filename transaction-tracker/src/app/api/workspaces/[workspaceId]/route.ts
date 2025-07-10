import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Workspace from "@/lib/models/Workspace";

// GET: Get a workspace by ID
export async function GET(req: NextRequest, { params }: { params: Promise<{ workspaceId: string }> }) {
  await dbConnect();
  const { workspaceId } = await params;
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  return NextResponse.json(workspace);
}

// PATCH: Rename a workspace
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ workspaceId: string }> }) {
  await dbConnect();
  const { workspaceId } = await params;
  const { name } = await req.json();
  const workspace = await Workspace.findByIdAndUpdate(workspaceId, { name }, { new: true });
  if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  return NextResponse.json(workspace);
}

// DELETE: Delete a workspace
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ workspaceId: string }> }) {
  await dbConnect();
  const { workspaceId } = await params;
  const workspace = await Workspace.findByIdAndDelete(workspaceId);
  if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
