import Claim from '../models/Claim.js';
import User from '../models/User.js';

// @desc    Create a new claim request
// @route   POST /api/claims
// @access  Private (Contributors)
export const createClaim = async (req, res) => {
  try {
    const { points, paymentMethod, paymentDetails } = req.body;

    // Validate milestone points
    const validMilestones = { 10: 15, 25: 30, 50: 60, 100: 120 };
    
    if (!validMilestones[points]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid milestone. Valid milestones are 10, 25, 50, and 100 points.',
      });
    }

    // Get user's current points
    const user = await User.findById(req.user.id);
    
    // Check if user has already claimed this milestone
    if (user.claimedMilestones && user.claimedMilestones.includes(points)) {
      return res.status(400).json({
        success: false,
        message: `You have already claimed the ${points} points milestone. Each milestone can only be claimed once.`,
      });
    }
    
    if (user.points < points) {
      return res.status(400).json({
        success: false,
        message: `Insufficient points. You have ${user.points} points but need ${points} points.`,
      });
    }

    // Check if user has a pending claim
    const pendingClaim = await Claim.findOne({
      user: req.user.id,
      status: 'pending',
    });

    if (pendingClaim) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending claim. Please wait for it to be processed.',
      });
    }

    // Create claim
    const claim = await Claim.create({
      user: req.user.id,
      points,
      amount: validMilestones[points],
      paymentMethod,
      paymentDetails,
    });

    // Deduct points from user and mark milestone as claimed
    user.points -= points;
    if (!user.claimedMilestones) {
      user.claimedMilestones = [];
    }
    user.claimedMilestones.push(points);
    await user.save();

    const populatedClaim = await Claim.findById(claim._id).populate('user', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Claim request submitted successfully!',
      data: populatedClaim,
    });
  } catch (error) {
    console.error('Create Claim Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create claim',
    });
  }
};

// @desc    Get user's claims
// @route   GET /api/claims/my-claims
// @access  Private (Contributors)
export const getMyClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('processedBy', 'name');

    res.status(200).json({
      success: true,
      count: claims.length,
      data: claims,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all claims (Super Admin)
// @route   GET /api/claims
// @access  Private/SuperAdmin
export const getAllClaims = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.status = status;

    const claims = await Claim.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'name email role points avatar')
      .populate('processedBy', 'name');

    const total = await Claim.countDocuments(query);

    res.status(200).json({
      success: true,
      count: claims.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: claims,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get pending claims count (Super Admin)
// @route   GET /api/claims/pending/count
// @access  Private/SuperAdmin
export const getPendingClaimsCount = async (req, res) => {
  try {
    const count = await Claim.countDocuments({ status: 'pending' });

    res.status(200).json({
      success: true,
      data: { count },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update claim status (Super Admin)
// @route   PUT /api/claims/:id
// @access  Private/SuperAdmin
export const updateClaim = async (req, res) => {
  try {
    const { status, transactionId, notes } = req.body;

    const claim = await Claim.findById(req.params.id).populate('user', 'name email points totalEarnings avatar');

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found',
      });
    }

    // Update claim
    claim.status = status || claim.status;
    claim.transactionId = transactionId || claim.transactionId;
    claim.notes = notes || claim.notes;
    claim.processedBy = req.user.id;
    claim.processedAt = new Date();

    await claim.save();

    // If paid, update user's total earnings
    if (status === 'paid') {
      const user = await User.findById(claim.user._id);
      user.totalEarnings += claim.amount;
      await user.save();
    }

    // If rejected, refund points to user AND remove from claimedMilestones
    if (status === 'rejected') {
      const user = await User.findById(claim.user._id);
      user.points += claim.points;
      // Remove the milestone from claimedMilestones so user can claim it again
      if (user.claimedMilestones) {
        user.claimedMilestones = user.claimedMilestones.filter(m => m !== claim.points);
      }
      await user.save();
    }

    const updatedClaim = await Claim.findById(claim._id)
      .populate('user', 'name email points totalEarnings avatar')
      .populate('processedBy', 'name');

    res.status(200).json({
      success: true,
      message: `Claim ${status} successfully`,
      data: updatedClaim,
    });
  } catch (error) {
    console.error('Update Claim Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update claim',
    });
  }
};

// @desc    Get claim stats (Super Admin)
// @route   GET /api/claims/stats
// @access  Private/SuperAdmin
export const getClaimStats = async (req, res) => {
  try {
    const stats = await Claim.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    const formattedStats = {
      pending: { count: 0, totalAmount: 0 },
      processing: { count: 0, totalAmount: 0 },
      paid: { count: 0, totalAmount: 0 },
      rejected: { count: 0, totalAmount: 0 },
    };

    stats.forEach(stat => {
      formattedStats[stat._id] = {
        count: stat.count,
        totalAmount: stat.totalAmount,
      };
    });

    res.status(200).json({
      success: true,
      data: formattedStats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
