import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (userId) filter.user = userId;

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user', 'name email')
        .lean(),
      Order.countDocuments(filter),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Resolve server session for authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to place an order.' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Query DB by session email to ensure correct mongoose ObjectId is set
    const dbUser = await User.findOne({ email: session.user.email.toLowerCase() });
    if (!dbUser) {
      return NextResponse.json(
        { error: 'User profile not found. Please log out and sign in again.' },
        { status: 404 }
      );
    }

    // Assign verified database user ID
    body.user = dbUser._id;

    const order = await Order.create(body);

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
