import User from '../models/User.js';

// @desc    Get all public users (for homepage contributors)
// @route   GET /api/users/all-public
// @access  Public
export const getAllPublicUsers = async (req, res) => {
  try {
    const users = await User.find({ 
      status: 'approved',
      role: { $ne: 'super_admin' }
    })
      .select('name role avatar status')
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all pending users (for admin approval)
// @route   GET /api/users/pending
// @access  Private/SuperAdmin
export const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ status: 'pending' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all approved users (including blocked for management)
// @route   GET /api/users/approved
// @access  Private/SuperAdmin
export const getApprovedUsers = async (req, res) => {
  try {
    const users = await User.find({ 
      status: { $in: ['approved', 'blocked'] },
      role: { $ne: 'super_admin' }
    })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single user details
// @route   GET /api/users/:id
// @access  Private/SuperAdmin
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all users (with filters)
// @route   GET /api/users
// @access  Private/SuperAdmin
export const getAllUsers = async (req, res) => {
  try {
    const { status, role, page = 1, limit = 10 } = req.query;
    
    const query = { role: { $ne: 'super_admin' } };
    
    if (status) query.status = status;
    if (role) query.role = role;

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Approve user
// @route   PUT /api/users/:id/approve
// @access  Private/SuperAdmin
export const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.role === 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot modify super admin',
      });
    }

    user.status = 'approved';
    user.rejectionReason = '';
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.name} has been approved`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Reject user
// @route   PUT /api/users/:id/reject
// @access  Private/SuperAdmin
export const rejectUser = async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.role === 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot modify super admin',
      });
    }

    user.status = 'rejected';
    user.rejectionReason = reason || 'No reason provided';
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.name} has been rejected`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Block user
// @route   PUT /api/users/:id/block
// @access  Private/SuperAdmin
export const blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.role === 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot block super admin',
      });
    }

    user.status = 'blocked';
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.name} has been blocked`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Unblock user
// @route   PUT /api/users/:id/unblock
// @access  Private/SuperAdmin
export const unblockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.status = 'approved';
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.name} has been unblocked`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Change user role
// @route   PUT /api/users/:id/role
// @access  Private/SuperAdmin
export const changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.role === 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot change super admin role',
      });
    }

    if (role === 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot assign super admin role',
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User role changed to ${role}`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/SuperAdmin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.role === 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete super admin',
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/users/stats
// @access  Private/SuperAdmin
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      pendingUsers,
      approvedUsers,
      blockedUsers,
      roleStats,
    ] = await Promise.all([
      User.countDocuments({ role: { $ne: 'super_admin' } }),
      User.countDocuments({ status: 'pending' }),
      User.countDocuments({ status: 'approved', role: { $ne: 'super_admin' } }),
      User.countDocuments({ status: 'blocked' }),
      User.aggregate([
        { $match: { role: { $ne: 'super_admin' } } },
        { $group: { _id: '$role', count: { $sum: 1 } } },
      ]),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        pendingUsers,
        approvedUsers,
        blockedUsers,
        roleStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
