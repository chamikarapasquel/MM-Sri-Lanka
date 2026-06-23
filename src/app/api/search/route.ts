import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');

    if (!query.trim()) {
      return NextResponse.json({ products: [], total: 0 });
    }

    const skip = (page - 1) * limit;

    // Use text search if available, fallback to regex
    let filter;
    try {
      filter = { $text: { $search: query } };
      const count = await Product.countDocuments(filter);
      if (count === 0) throw new Error('No text results');
    } catch {
      // Fallback to regex search across multiple fields
      const regex = new RegExp(query, 'i');
      filter = {
        $or: [
          { name: regex },
          { description: regex },
          { brand: regex },
          { category: regex },
          { tags: regex },
        ],
      };
    }

    const [products, total] = await Promise.all([
      Product.find(filter).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);

    return NextResponse.json({
      products,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
