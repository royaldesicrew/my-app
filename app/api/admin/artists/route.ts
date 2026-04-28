import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Artist from '@/models/Artist';

export async function GET() {
  try {
    await dbConnect();
    const artists = await Artist.find().populate('coverImageId').sort({ createdAt: -1 });
    return NextResponse.json(artists);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch artists' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // Clean body: empty strings for ObjectIds should be removed or set to null
    if (body.coverImageId === "") delete body.coverImageId;

    const artist = await Artist.create(body);
    return NextResponse.json(artist, { status: 201 });
  } catch (error) {
    console.error('Failed to create artist:', error);
    return NextResponse.json({ error: 'Failed to create artist' }, { status: 500 });
  }
}
