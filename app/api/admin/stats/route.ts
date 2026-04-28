import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Venue from '@/models/Venue';
import Caterer from '@/models/Caterer';
import Media from '@/models/Media';
import Category from '@/models/Category';
import GalleryItem from '@/models/Gallery';
import Artist from '@/models/Artist';
import Booking from '@/models/Booking';
import Blog from '@/models/Blog';

export async function GET() {
  try {
    await dbConnect();
    
    const [venues, caterers, media, galleryItems, categories, artists, bookings, blogs] = await Promise.all([
      Venue.countDocuments(),
      Caterer.countDocuments(),
      Media.countDocuments(),
      GalleryItem.countDocuments(),
      Category.countDocuments(),
      Artist.countDocuments(),
      Booking.countDocuments(),
      Blog.countDocuments(),
    ]);

    return NextResponse.json({
      venues,
      caterers,
      media,
      galleryItems,
      categories,
      artists,
      bookings,
      blogs,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}
