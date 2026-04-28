import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Media from '@/models/Media';
import cloudinary from '@/lib/cloudinary';

export async function GET() {
  try {
    await dbConnect();
    const media = await Media.find().sort({ createdAt: -1 });
    return NextResponse.json(media);
  } catch (error) {
    console.error('Failed to fetch media:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { data, title, caption, linkedModule } = body; // data is base64 string

    if (!data) {
      return NextResponse.json({ error: 'No media data provided' }, { status: 400 });
    }

    const uploadResponse = await cloudinary.uploader.upload(data, {
      folder: 'rdc_media',
      resource_type: 'auto',
    });

    const newMedia = await Media.create({
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
      format: uploadResponse.resource_type === 'video' ? 'video' : 'image',
      title: title || '',
      caption: caption || '',
      linkedModule: linkedModule || 'General',
    });

    return NextResponse.json(newMedia, { status: 201 });
  } catch (error) {
    console.error('Upload failed:', error);
    return NextResponse.json({ error: 'Failed to upload media' }, { status: 500 });
  }
}
