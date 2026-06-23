import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IAddress {
  _id?: Types.ObjectId;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  district: string;
  postalCode: string;
  isDefault: boolean;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  phone: string;
  avatar: string;
  addresses: IAddress[];
  wishlist: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IAddress>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: 100,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true,
      maxlength: 300,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      maxlength: 100,
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
      maxlength: 100,
    },
    postalCode: {
      type: String,
      required: [true, 'Postal code is required'],
      trim: true,
      maxlength: 10,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Exclude from queries by default
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: '{VALUE} is not a valid role',
      },
      default: 'user',
    },
    phone: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      trim: true,
    },
    addresses: {
      type: [AddressSchema],
      default: [],
      validate: {
        validator: function (addresses: IAddress[]) {
          return addresses.length <= 5;
        },
        message: 'You can have a maximum of 5 addresses',
      },
    },
    wishlist: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        delete (ret as any).password;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

// ---------- Indexes ----------

UserSchema.index({ role: 1 });

// ---------- Pre-save hooks ----------

// Ensure only one address is marked as default
UserSchema.pre('save', function () {
  if (this.isModified('addresses') && this.addresses.length > 0) {
    const defaults = this.addresses.filter((addr) => addr.isDefault);

    // If no default is set, make the first address the default
    if (defaults.length === 0) {
      this.addresses[0].isDefault = true;
    }

    // If multiple defaults, keep only the last one
    if (defaults.length > 1) {
      this.addresses.forEach((addr) => (addr.isDefault = false));
      this.addresses[this.addresses.length - 1].isDefault = true;
    }
  }
});

// ---------- Virtuals ----------

UserSchema.virtual('defaultAddress').get(function (this: IUser) {
  return this.addresses.find((addr) => addr.isDefault) || this.addresses[0];
});

// ---------- Export ----------

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
