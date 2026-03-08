import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email',
      ],
    },
    password: {
      type: String,
      required: function () {
        return !this.firebaseUid;
      },
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't return password by default
    },
    firebaseUid: {
      type: String,
      default: null,
      sparse: true, // Allow multiple nulls
    },
    role: {
      type: String,
      enum: [
        'super_admin',
        'resource_poster',
        'job_poster',
        'blog_poster',
        'tech_blog_poster',
        'digital_product_poster',
        'others',
      ],
      default: 'others',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'blocked'],
      default: 'pending',
    },
    avatar: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
      maxlength: [100, 'Location cannot exceed 100 characters'],
    },
    website: {
      type: String,
      default: '',
    },
    linkedin: {
      type: String,
      default: '',
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    points: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    claimedMilestones: {
      type: [Number],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving (skip if no password e.g. Firebase-only users)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method (Firebase users have no password)
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
