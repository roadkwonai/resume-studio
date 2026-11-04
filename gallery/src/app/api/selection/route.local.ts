import { NextResponse } from "next/server";
import { byId } from "@/templates";
import { readSelection, writeSelection } from "@/selection";

export async function GET() {
  return NextResponse.json({ template: await readSelection() });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { template?: unknown } | null;
  const id = typeof body?.template === "string" ? body.template : "";
  if (!byId(id)) return NextResponse.json({ error: "unknown template" }, { status: 400 });
  await writeSelection(id);
  return NextResponse.json({ template: id });
}
