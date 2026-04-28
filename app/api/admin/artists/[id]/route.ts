import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Artist from '@/models/Artist';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const artist = await Artist.findById(id).populate('coverImageId');
    if (!artist) return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    return NextResponse.json(artist);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch artist' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    // Clean body
    if (body.coverImageId === "") body.coverImageId = null;

    const artist = await Artist.findByIdAndUpdate(id, body, { new: true });
    if (!artist) return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    return NextResponse.json(artist);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update artist' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const artist = await Artist.findByIdAndDelete(id);
    if (!artist) return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    return NextResponse.json({ message: 'Artist deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete artist' }, { status: 500 });
  }
}
