import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Venue from '@/models/Venue';

export async function GET() {
  try {
    await dbConnect();
    const venues = await Venue.find()
      .populate('coverImageId')
      .populate('mediaCollection.mediaId')
      .sort({ createdAt: -1 });
    return NextResponse.json(venues);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch venues' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    if (body.coverImageId === "") delete body.coverImageId;
    const venue = await Venue.create(body);
    return NextResponse.json(venue, { status: 201 });
  } catch (error) {
    console.error('Failed to create venue:', error);
    return NextResponse.json({ error: 'Failed to create venue' }, { status: 500 });
  }
}
