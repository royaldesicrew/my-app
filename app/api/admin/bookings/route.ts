import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';

import { sendEmailNotification } from '@/lib/actions/notify';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    
    // 1. Create booking in DB
    const booking = await Booking.create(data);
    
    // 2. Send email to user via Resend (using postpipe utility)
    if (data.email) {
      await sendEmailNotification({
        to: data.email,
        subject: 'Booking Confirmation - Royal Desi Crew',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #FF6B4A; font-size: 24px;">Thank you for your request!</h1>
            <p>Hi ${data.name?.split(' ')[0] || 'there'},</p>
            <p>We've successfully received your booking request for a <strong>${data.service || data.eventType || 'premium event'}</strong>.</p>
            <p>Our royal planners are currently reviewing your details and will contact you shortly at ${data.phone}.</p>
            <br/>
            <h3>Request Summary:</h3>
            <ul>
              <li><strong>Package:</strong> ${data.package || 'Not selected'}</li>
              <li><strong>Venue:</strong> ${data.venue || 'Not selected'}</li>
              <li><strong>Caterer:</strong> ${data.caterer || 'Not selected'}</li>
              <li><strong>Artist:</strong> ${data.artist || 'Not selected'}</li>
            </ul>
            <br/>
            <p>Best regards,<br/><strong>The Royal Desi Crew Team</strong></p>
          </div>
        `
      });
    }

    // 3. Send email to admin via Resend
    try {
      await sendEmailNotification({
        to: 'royaldesicrew@gmail.com',
        subject: `New Booking Request from ${data.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #FF6B4A; font-size: 24px;">New Booking Alert</h1>
            <p>You have received a new booking request.</p>
            <br/>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Name:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.name}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.email}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.phone}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Service:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.service || data.eventType || 'N/A'}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Package:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.package || 'N/A'}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Venue:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.venue || 'N/A'}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Caterer:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.caterer || 'N/A'}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Artist:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.artist || 'N/A'}</td></tr>
            </table>
            <br/>
            <p>Log in to the Royal Desi CMS to manage this booking.</p>
          </div>
        `
      });
    } catch (adminEmailError) {
      console.error('Failed to send admin email:', adminEmailError);
    }
    
    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    console.error('Booking creation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create booking' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const bookings = await Booking.find().sort({ createdAt: -1 });
    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
