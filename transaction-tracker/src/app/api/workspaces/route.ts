import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Workspace from "@/lib/models/Workspace";

export async function GET() {
  await dbConnect();
  const workspaces = await Workspace.find();
  return NextResponse.json(workspaces);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const { name } = await req.json();
  const workspace = await Workspace.create({ name, pages: [] });
  return NextResponse.json(workspace, { status: 201 });
}
