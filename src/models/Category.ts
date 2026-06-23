import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ICategory extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  icon: string;
  image: string;
  description: string;
  parentCategory: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      maxlength: [100, 'Category name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Category slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    icon: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    parentCategory: {
      type: String,
      trim: true,
      index: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ---------- Indexes ----------

CategorySchema.index({ isActive: 1, displayOrder: 1 });
CategorySchema.index({ parentCategory: 1, isActive: 1 });

// ---------- Virtuals ----------

CategorySchema.virtual('isSubcategory').get(function (this: ICategory) {
  return !!this.parentCategory;
});

// ---------- Export ----------

const Category: Model<ICategory> =
  mongoose.models.Category ||
  mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
