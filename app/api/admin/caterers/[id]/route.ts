import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Caterer from '@/models/Caterer';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const caterer = await Caterer.findById(id).populate('coverImageId');
    if (!caterer) return NextResponse.json({ error: 'Caterer not found' }, { status: 404 });
    return NextResponse.json(caterer);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch caterer' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const caterer = await Caterer.findByIdAndUpdate(id, body, { new: true });
    if (!caterer) return NextResponse.json({ error: 'Caterer not found' }, { status: 404 });
    return NextResponse.json(caterer);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update caterer' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const caterer = await Caterer.findByIdAndDelete(id);
    if (!caterer) return NextResponse.json({ error: 'Caterer not found' }, { status: 404 });
    return NextResponse.json({ message: 'Caterer deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete caterer' }, { status: 500 });
  }
}
