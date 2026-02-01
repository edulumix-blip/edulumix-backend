import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: [
        'IT Job',
        'Non IT Job',
        'Walk In Drive',
        'Govt Job',
        'Internship',
        'Part Time Job',
        'Remote Job',
        'Others',
      ],
      required: [true, 'Category is required'],
    },
    experience: {
      type: String,
      enum: ['Fresher', '1 Year', '2 Years', '3 Years', '4 Years', '5+ Years'],
      default: 'Fresher',
    },
    salary: {
      type: String,
      default: 'Not Disclosed',
    },
    status: {
      type: String,
      enum: ['Open', 'Closed'],
      default: 'Open',
    },
    companyLogo: {
      type: String,
      default: '',
      trim: true,
    },
    applyLink: {
      type: String,
      required: [true, 'Apply link or email is required'],
      trim: true,
    },
    applyType: {
      type: String,
      enum: ['link', 'email'],
      default: 'link',
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    likesCount: {
      type: Number,
      default: 0,
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
    slug: {
      type: String,
      unique: true,
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

// Generate slug before saving
jobSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('title') || this.isModified('company')) {
    const titleSlug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const companySlug = this.company
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    this.slug = `${titleSlug}-${companySlug}-${this._id}`;
  }
  next();
});

// Auto-detect if applyLink is email or URL
jobSchema.pre('save', function(next) {
  if (this.isModified('applyLink')) {
    // Check if it's an email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(this.applyLink)) {
      this.applyType = 'email';
    } else {
      this.applyType = 'link';
    }
  }
  next();
});

// Index for search
jobSchema.index({ title: 'text', company: 'text', description: 'text' });

const Job = mongoose.model('Job', jobSchema);

export default Job;
