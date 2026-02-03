import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  videoUrl: {
    type: String,
    default: '',
  },
  duration: {
    type: Number, // in minutes
    default: 0,
  },
  order: {
    type: Number,
    default: 0,
  },
  isFree: {
    type: Boolean,
    default: false,
  },
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    shortDescription: {
      type: String,
      maxlength: [300, 'Short description cannot exceed 300 characters'],
    },
    thumbnail: {
      type: String,
      default: '',
    },
    previewVideo: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: [
        'Web Development',
        'Mobile Development',
        'Data Science',
        'Machine Learning',
        'DevOps',
        'Cybersecurity',
        'Cloud Computing',
        'UI/UX Design',
        'Digital Marketing',
        'Interview Prep',
        'DSA',
        'Programming Languages',
        'Others',
      ],
      required: [true, 'Category is required'],
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'All Levels',
    },
    language: {
      type: String,
      enum: ['English', 'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Others'],
      default: 'English',
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
    isFree: {
      type: Boolean,
      default: false,
    },
    lessons: [lessonSchema],
    totalDuration: {
      type: Number, // in minutes
      default: 0,
    },
    totalLessons: {
      type: Number,
      default: 0,
    },
    instructor: {
      name: {
        type: String,
        required: true,
      },
      bio: {
        type: String,
        default: '',
      },
      avatar: {
        type: String,
        default: '',
      },
    },
    features: [{
      type: String,
    }],
    requirements: [{
      type: String,
    }],
    whatYouWillLearn: [{
      type: String,
    }],
    tags: [{
      type: String,
      trim: true,
    }],
    enrollmentLink: {
      type: String,
      default: '',
    },
    whatsappNumber: {
      type: String,
      default: '918272946202',
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    enrollments: {
      type: Number,
      default: 0,
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
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

// Generate slug before saving
courseSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 100) + '-' + Date.now().toString(36);
  }
  
  // Calculate totals
  if (this.lessons && this.lessons.length > 0) {
    this.totalLessons = this.lessons.length;
    this.totalDuration = this.lessons.reduce((acc, lesson) => acc + (lesson.duration || 0), 0);
  }
  
  next();
});

// Virtual for discount percentage
courseSchema.virtual('discountPercentage').get(function () {
  if (this.actualPrice && this.offerPrice && this.actualPrice > this.offerPrice) {
    return Math.round(((this.actualPrice - this.offerPrice) / this.actualPrice) * 100);
  }
  return 0;
});

// Include virtuals in JSON
courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

const Course = mongoose.model('Course', courseSchema);

export default Course;
