import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Package from '@/models/Package';

const DEFAULT_PACKAGES = [
    {
        name: "Basic",
        description: "Essential coordination for intimate family gatherings.",
        price: "Starts at ₹3,00,000",
        features: ["Up to 50 Guests", "Venue Selection", "Basic Decor Setup", "On-Day Support", "Timeline Planning"],
        isBestValue: false,
        isMostRequested: false,
        order: 1
    },
    {
        name: "Silver",
        description: "The perfect balance of elegance and affordability.",
        price: "Starts at ₹7,00,000",
        features: ["Up to 150 Guests", "Full Decor & Styling", "Sound & Essential Lighting", "Vendor Coordination", "Guest Management"],
        isBestValue: true,
        isMostRequested: false,
        order: 2
    },
    {
        name: "Gold",
        description: "Our signature luxury experience for celebrations.",
        price: "Starts at ₹15,00,000",
        features: ["Up to 400 Guests", "Bespoke Floral Design", "Cinematic Lighting & AV", "Full Weekend Coordination", "Premium Catering Setup"],
        isBestValue: false,
        isMostRequested: true,
        order: 3
    },
    {
        name: "Diamond",
        description: "The pinnacle of royal luxury and bespoke service.",
        price: "Custom",
        features: ["Unlimited Guests", "Global Destination Planning", "Celebrity Entertainment", "Custom Set Construction", "24/7 Dedicated Concierge"],
        isBestValue: false,
        isMostRequested: false,
        order: 4
    }
];

export async function GET() {
  try {
    await dbConnect();
    let packages = await Package.find().sort({ order: 1 });
    
    // Auto-seed default packages if collection is empty
    if (packages.length === 0) {
      await Package.insertMany(DEFAULT_PACKAGES);
      packages = await Package.find().sort({ order: 1 });
    }
    
    return NextResponse.json(packages);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const pkg = await Package.create(body);
    return NextResponse.json(pkg, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create package' }, { status: 500 });
  }
}
