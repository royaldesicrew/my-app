import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Caterer from '@/models/Caterer';

export async function GET() {
  try {
    await dbConnect();
    const caterers = await Caterer.find()
      .populate('coverImageId')
      .populate('mediaCollection.mediaId')
      .sort({ createdAt: -1 });
    return NextResponse.json(caterers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch caterers' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const caterer = await Caterer.create(body);
    return NextResponse.json(caterer, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create caterer' }, { status: 500 });
  }
}
