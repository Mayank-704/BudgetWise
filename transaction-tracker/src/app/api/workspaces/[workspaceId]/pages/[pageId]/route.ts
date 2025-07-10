import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Workspace from "@/lib/models/Workspace";

// GET: Get a page by ID
export async function GET(req: NextRequest, { params }: { params: { workspaceId: string, pageId: string } }) {
  await dbConnect();
  const { workspaceId, pageId } = params;
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  const page = workspace.pages.id(pageId);
  if (!page) return NextResponse.json({ error: "Page not found" }, { status: 404 });
  return NextResponse.json(page);
}

// PATCH: Rename a page
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ workspaceId: string, pageId: string }> }) {
  await dbConnect();
  const { workspaceId, pageId } = await params;
  const { name } = await req.json();
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  const page = workspace.pages.id(pageId);
  if (!page) return NextResponse.json({ error: "Page not found" }, { status: 404 });
  page.name = name;
  await workspace.save();
  return NextResponse.json(page);
}

// DELETE: Delete a page
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ workspaceId: string, pageId: string }> }) {
  await dbConnect();
  const { workspaceId, pageId } = await params;
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  const page = workspace.pages.id(pageId);
  if (!page) return NextResponse.json({ error: "Page not found" }, { status: 404 });
  page.remove();
  await workspace.save();
  return NextResponse.json({ success: true });
}
