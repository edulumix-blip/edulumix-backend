import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: [{
    type: String,
    required: true,
  }],
  correctAnswer: {
    type: Number, // Index of correct option (0-based)
    required: true,
  },
  explanation: {
    type: String,
    default: '',
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
  },
  marks: {
    type: Number,
    default: 1,
  },
});

const mockTestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Test title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      default: '',
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    thumbnail: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: [
        'Aptitude',
        'Logical Reasoning',
        'Verbal Ability',
        'Technical - Programming',
        'Technical - DSA',
        'Technical - DBMS',
        'Technical - OS',
        'Technical - CN',
        'Technical - Web Dev',
        'Company Specific',
        'Gate',
        'Government Exams',
        'Others',
      ],
      required: [true, 'Category is required'],
    },
    company: {
      type: String,
      default: '',
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard', 'Mixed'],
      default: 'Medium',
    },
    duration: {
      type: Number, // in minutes
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 minute'],
    },
    totalQuestions: {
      type: Number,
      default: 0,
    },
    totalMarks: {
      type: Number,
      default: 0,
    },
    passingMarks: {
      type: Number,
      default: 0,
    },
    questions: [questionSchema],
    instructions: [{
      type: String,
    }],
    tags: [{
      type: String,
      trim: true,
    }],
    isFree: {
      type: Boolean,
      default: true,
    },
    price: {
      type: Number,
      default: 0,
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
    attempts: {
      type: Number,
      default: 0,
    },
    avgScore: {
      type: Number,
      default: 0,
    },
    whatsappNumber: {
      type: String,
      default: '918272946202',
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
mockTestSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 100) + '-' + Date.now().toString(36);
  }
  
  // Calculate totals from questions
  if (this.questions && this.questions.length > 0) {
    this.totalQuestions = this.questions.length;
    this.totalMarks = this.questions.reduce((acc, q) => acc + (q.marks || 1), 0);
    if (!this.passingMarks) {
      this.passingMarks = Math.ceil(this.totalMarks * 0.4); // 40% passing by default
    }
  }
  
  next();
});

// Include virtuals in JSON
mockTestSchema.set('toJSON', { virtuals: true });
mockTestSchema.set('toObject', { virtuals: true });

const MockTest = mongoose.model('MockTest', mockTestSchema);

export default MockTest;
