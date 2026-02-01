import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Resource title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    category: {
      type: String,
      enum: [
        'Software Notes',
        'Interview Notes',
        'Tools & Technology',
        'Trending Technology',
        'Video Resources',
        'Software Project',
        'Hardware Project',
      ],
      required: [true, 'Category is required'],
    },
    subcategory: {
      type: String,
      trim: true,
      default: '',
    },
    link: {
      type: String,
      required: [true, 'Resource link is required'],
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
    isVideo: {
      type: Boolean,
      default: false,
    },
    likes: {
      type: Number,
      default: 0,
    },
    downloads: {
      type: Number,
      default: 0,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search
resourceSchema.index({ title: 'text', category: 'text', subcategory: 'text' });

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;
