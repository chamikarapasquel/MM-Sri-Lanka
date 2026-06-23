import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IReview {
  user: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface IRatings {
  average: number;
  count: number;
}

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice: number;
  category: string;
  subcategory: string;
  brand: string;
  images: string[];
  specifications: Map<string, string>;
  stock: number;
  sku: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  ratings: IRatings;
  reviews: IReview[];
  tags: string[];
  warranty: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [500, 'Short description cannot exceed 500 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
      index: true,
    },
    subcategory: {
      type: String,
      trim: true,
      index: true,
    },
    brand: {
      type: String,
      required: [true, 'Product brand is required'],
      trim: true,
      index: true,
    },
    images: {
      type: [String],
      default: [],
    },
    specifications: {
      type: Map,
      of: String,
      default: new Map(),
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      uppercase: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
      index: true,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
      index: true,
    },
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    reviews: {
      type: [ReviewSchema],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    warranty: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ---------- Indexes ----------

// Compound text index for full-text search across key fields
ProductSchema.index(
  {
    name: 'text',
    description: 'text',
    brand: 'text',
    category: 'text',
  },
  {
    weights: {
      name: 10,
      brand: 5,
      category: 3,
      description: 1,
    },
    name: 'product_text_search',
  }
);

// Price range queries
ProductSchema.index({ price: 1 });

// Common filter combos
ProductSchema.index({ category: 1, brand: 1, price: 1 });
ProductSchema.index({ category: 1, subcategory: 1 });

// ---------- Virtuals ----------

ProductSchema.virtual('isInStock').get(function (this: IProduct) {
  return this.stock > 0;
});

ProductSchema.virtual('discountPercentage').get(function (this: IProduct) {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(
      ((this.originalPrice - this.price) / this.originalPrice) * 100
    );
  }
  return 0;
});

// ---------- Export ----------

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
