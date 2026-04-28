import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Catalog from '@/models/Catalog';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const catalog = await Catalog.findByIdAndUpdate(id, body, { new: true });
    if (!catalog) return NextResponse.json({ error: 'Catalog not found' }, { status: 404 });
    return NextResponse.json(catalog);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update catalog' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const catalog = await Catalog.findByIdAndDelete(id);
    if (!catalog) return NextResponse.json({ error: 'Catalog not found' }, { status: 404 });
    return NextResponse.json({ message: 'Catalog deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete catalog' }, { status: 500 });
  }
}
