import mongoose from 'mongoose';

const digitalProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    category: {
      type: String,
      enum: [
        'AI Tools',
        'Design & Creative',
        'Entertainment & Streaming',
        'Productivity & Office',
        'Security & Utility',
        'Education & Learning',
        'Others',
      ],
      required: [true, 'Category is required'],
    },
    subcategory: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      default: '',
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    thumbnail: {
      type: String,
      default: '',
    },
    actualPrice: {
      type: Number,
      required: [true, 'Actual price is required'],
      min: [0, 'Price cannot be negative'],
    },
    offerPrice: {
      type: Number,
      required: [true, 'Offer price is required'],
      min: [0, 'Price cannot be negative'],
    },
    whatsappNumber: {
      type: String,
      default: '918272946202',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for discount percentage
digitalProductSchema.virtual('discountPercentage').get(function () {
  if (this.actualPrice && this.offerPrice && this.actualPrice > this.offerPrice) {
    return Math.round(((this.actualPrice - this.offerPrice) / this.actualPrice) * 100);
  }
  return 0;
});

// Include virtuals in JSON
digitalProductSchema.set('toJSON', { virtuals: true });
digitalProductSchema.set('toObject', { virtuals: true });

const DigitalProduct = mongoose.model('DigitalProduct', digitalProductSchema);

export default DigitalProduct;
