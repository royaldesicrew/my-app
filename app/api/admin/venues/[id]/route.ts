import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Venue from '@/models/Venue';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const venue = await Venue.findById(id).populate('coverImageId');
    if (!venue) return NextResponse.json({ error: 'Venue not found' }, { status: 404 });
    return NextResponse.json(venue);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch venue' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const venue = await Venue.findByIdAndUpdate(id, body, { new: true });
    if (!venue) return NextResponse.json({ error: 'Venue not found' }, { status: 404 });
    return NextResponse.json(venue);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update venue' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const venue = await Venue.findByIdAndDelete(id);
    if (!venue) return NextResponse.json({ error: 'Venue not found' }, { status: 404 });
    return NextResponse.json({ message: 'Venue deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete venue' }, { status: 500 });
  }
}
