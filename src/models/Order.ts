import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IOrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  district: string;
  postalCode: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'cod' | 'bank_transfer' | 'card';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface IOrder extends Document {
  _id: Types.ObjectId;
  orderNumber: string;
  user: Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  totalAmount: number;
  shippingCost: number;
  discount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  trackingNumber: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Item price is required'],
      min: [0, 'Price cannot be negative'],
    },
    quantity: {
      type: Number,
      required: [true, 'Item quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    image: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const ShippingAddressSchema = new Schema<IShippingAddress>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
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
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
    },
    postalCode: {
      type: String,
      required: [true, 'Postal code is required'],
      trim: true,
    },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      unique: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    items: {
      type: [OrderItemSchema],
      required: [true, 'Order must have at least one item'],
      validate: {
        validator: function (items: IOrderItem[]) {
          return items.length > 0;
        },
        message: 'Order must contain at least one item',
      },
    },
    shippingAddress: {
      type: ShippingAddressSchema,
      required: [true, 'Shipping address is required'],
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative'],
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: [0, 'Shipping cost cannot be negative'],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
    },
    status: {
      type: String,
      enum: {
        values: [
          'pending',
          'confirmed',
          'processing',
          'shipped',
          'delivered',
          'cancelled',
        ],
        message: '{VALUE} is not a valid order status',
      },
      default: 'pending',
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: {
        values: ['cod', 'bank_transfer', 'card'],
        message: '{VALUE} is not a valid payment method',
      },
      required: [true, 'Payment method is required'],
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['pending', 'paid', 'failed', 'refunded'],
        message: '{VALUE} is not a valid payment status',
      },
      default: 'pending',
      index: true,
    },
    trackingNumber: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ---------- Indexes ----------

OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ createdAt: -1 });

// ---------- Pre-save hook: auto-generate orderNumber ----------

OrderSchema.pre('save', async function () {
  if (this.isNew && !this.orderNumber) {
    const randomPart = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    const timestampPart = Date.now().toString(36).substring(-4).toUpperCase();
    this.orderNumber = `MM-${timestampPart}${randomPart}`.substring(0, 12);

    // Verify uniqueness — extremely unlikely collision but safety first
    const OrderModel = this.constructor as Model<IOrder>;
    const existing = await OrderModel.findOne({
      orderNumber: this.orderNumber,
    });
    if (existing) {
      // Append extra random chars on collision
      const extra = Math.random().toString(36).substring(2, 5).toUpperCase();
      this.orderNumber = `MM-${extra}${randomPart}`.substring(0, 12);
    }
  }
});

// ---------- Virtuals ----------

OrderSchema.virtual('grandTotal').get(function (this: IOrder) {
  return this.totalAmount + this.shippingCost - this.discount;
});

OrderSchema.virtual('itemCount').get(function (this: IOrder) {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// ---------- Export ----------

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
