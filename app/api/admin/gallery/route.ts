import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Gallery from '@/models/Gallery';
import Category from '@/models/Category';
import Media from '@/models/Media';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get('category');

    let query = {};
    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug, type: 'Gallery' });
      if (category) {
        query = { categoryId: category._id };
      }
    }

    const items = await Gallery.find(query)
      .populate('mediaId')
      .populate('categoryId')
      .sort({ order: 1 });

    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch gallery items' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { mediaId, categoryId, title, description, order } = body;

    const item = await Gallery.create({
      mediaId,
      categoryId,
      title,
      description,
      order: order || 0,
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create gallery item' }, { status: 500 });
  }
}
