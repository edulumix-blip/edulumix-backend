import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    points: {
      type: Number,
      required: true,
      enum: [10, 25, 50, 100],
    },
    amount: {
      type: Number,
      required: true,
      enum: [15, 30, 60, 120],
    },
    paymentMethod: {
      type: String,
      enum: ['upi', 'phone'],
      required: true,
    },
    paymentDetails: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'paid', 'rejected'],
      default: 'pending',
    },
    transactionId: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    processedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Claim = mongoose.model('Claim', claimSchema);

export default Claim;
