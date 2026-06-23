import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import { resolveImageUrls } from '@/lib/server-utils';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const newArrivals = searchParams.get('newArrivals');
    const bestSellers = searchParams.get('bestSellers');
    const ids = searchParams.get('ids');

    // Build filter query
    const filter: Record<string, unknown> = {};

    if (ids) {
      const idArray = ids.split(',').map((id) => id.trim()).filter(Boolean);
      const validObjectIds = idArray.filter((id) => mongoose.Types.ObjectId.isValid(id));
      filter._id = { $in: validObjectIds };
    }

    if (category) {
      filter.category = { $regex: new RegExp(category, 'i') };
    }

    if (brand) {
      const brands = brand.split(',');
      filter.brand = { $in: brands.map((b) => new RegExp(b, 'i')) };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) (filter.price as Record<string, number>).$gte = parseInt(minPrice);
      if (maxPrice) (filter.price as Record<string, number>).$lte = parseInt(maxPrice);
    }

    if (search) {
      filter.$text = { $search: search };
    }

    if (featured === 'true') filter.isFeatured = true;
    if (newArrivals === 'true') filter.isNewArrival = true;
    if (bestSellers === 'true') filter.isBestSeller = true;

    // Build sort
    const sortObj: Record<string, 1 | -1> = {};
    if (sort === 'price') {
      sortObj.price = order === 'asc' ? 1 : -1;
    } else if (sort === 'name') {
      sortObj.name = order === 'asc' ? 1 : -1;
    } else if (sort === 'rating') {
      sortObj['ratings.average'] = -1;
    } else {
      sortObj.createdAt = -1;
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortObj).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Resolve any Unsplash webpage URLs to direct CDN URLs
    if (body.images && Array.isArray(body.images)) {
      body.images = await resolveImageUrls(body.images);
    }

    // Generate slug from name
    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const product = await Product.create({ ...body, slug });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || 'field';
      return NextResponse.json(
        { error: `A product with this ${field} already exists.` },
        { status: 400 }
      );
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json(
        { error: messages.join(', ') },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
