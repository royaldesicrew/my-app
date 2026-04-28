import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Catalog from '@/models/Catalog';

export async function GET() {
  try {
    await dbConnect();
    const catalogs = await Catalog.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json(catalogs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch catalogs' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const catalog = await Catalog.create(body);
    return NextResponse.json(catalog, { status: 201 });
  } catch (error) {
    console.error('Failed to create catalog:', error);
    return NextResponse.json({ error: 'Failed to create catalog' }, { status: 500 });
  }
}
