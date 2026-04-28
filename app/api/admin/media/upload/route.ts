import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Media from '@/models/Media';
import cloudinary from '@/lib/cloudinary';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const formData = await req.formData();
    const files = formData.getAll('file') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const uploadPromises = files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const result = await new Promise((resolve, reject) => {
        const isPdf = file.name.toLowerCase().endsWith('.pdf');
        cloudinary.uploader.upload_stream(
          {
            folder: 'rdc_media',
            resource_type: isPdf ? 'raw' : 'auto',
            use_filename: isPdf,
            unique_filename: !isPdf,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      }) as any;

      return await Media.create({
        url: result.secure_url,
        publicId: result.public_id,
        format: result.resource_type,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
        title: file.name.split('.')[0],
      });
    });

    const savedMedia = await Promise.all(uploadPromises);

    return NextResponse.json(savedMedia, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
