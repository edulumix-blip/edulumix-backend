import MockTest from '../models/MockTest.js';
import User from '../models/User.js';

// @desc    Get all mock tests (public - only published)
// @route   GET /api/mocktests
// @access  Public
export const getMockTests = async (req, res) => {
  try {
    const { category, difficulty, company, search, isFree, page = 1, limit = 12 } = req.query;

    const query = { isPublished: true };

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (company) query.company = { $regex: company, $options: 'i' };
    if (isFree !== undefined) query.isFree = isFree === 'true';
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }

    const tests = await MockTest.find(query)
      .populate('postedBy', 'name avatar')
      .select('-questions') // Don't expose questions in list
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await MockTest.countDocuments(query);

    res.status(200).json({
      success: true,
      count: tests.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: tests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all mock tests (admin - all tests)
// @route   GET /api/mocktests/all
// @access  Private (Super Admin)
export const getAllMockTests = async (req, res) => {
  try {
    const { category, difficulty, isPublished, isFeatured, search, page = 1, limit = 20 } = req.query;

    const query = {};

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (isPublished !== undefined) query.isPublished = isPublished === 'true';
    if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }

    const tests = await MockTest.find(query)
      .populate('postedBy', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await MockTest.countDocuments(query);

    // Stats
    const stats = {
      total: await MockTest.countDocuments(),
      published: await MockTest.countDocuments({ isPublished: true }),
      drafts: await MockTest.countDocuments({ isPublished: false }),
      featured: await MockTest.countDocuments({ isFeatured: true }),
      free: await MockTest.countDocuments({ isFree: true }),
      totalViews: await MockTest.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]).then(r => r[0]?.total || 0),
      totalAttempts: await MockTest.aggregate([{ $group: { _id: null, total: { $sum: '$attempts' } } }]).then(r => r[0]?.total || 0),
      totalQuestions: await MockTest.aggregate([{ $group: { _id: null, total: { $sum: '$totalQuestions' } } }]).then(r => r[0]?.total || 0),
    };

    res.status(200).json({
      success: true,
      count: tests.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      stats,
      data: tests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get featured mock tests
// @route   GET /api/mocktests/featured
// @access  Public
export const getFeaturedMockTests = async (req, res) => {
  try {
    const tests = await MockTest.find({ isPublished: true, isFeatured: true })
      .populate('postedBy', 'name avatar')
      .select('-questions')
      .sort({ createdAt: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      count: tests.length,
      data: tests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single mock test by slug (with questions for taking test)
// @route   GET /api/mocktests/:slug
// @access  Public
export const getMockTest = async (req, res) => {
  try {
    const test = await MockTest.findOne({ slug: req.params.slug })
      .populate('postedBy', 'name email avatar');

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Mock test not found',
      });
    }

    // Increment views
    test.views += 1;
    await test.save();

    res.status(200).json({
      success: true,
      data: test,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get mock test by ID (Admin)
// @route   GET /api/mocktests/id/:id
// @access  Private
export const getMockTestById = async (req, res) => {
  try {
    const test = await MockTest.findById(req.params.id)
      .populate('postedBy', 'name email avatar');

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Mock test not found',
      });
    }

    res.status(200).json({
      success: true,
      data: test,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create mock test
// @route   POST /api/mocktests
// @access  Private (Super Admin)
export const createMockTest = async (req, res) => {
  try {
    const testData = {
      ...req.body,
      postedBy: req.user.id,
    };

    // Calculate totals
    if (testData.questions && testData.questions.length > 0) {
      testData.totalQuestions = testData.questions.length;
      testData.totalMarks = testData.questions.reduce((acc, q) => acc + (q.marks || 1), 0);
      if (!testData.passingMarks) {
        testData.passingMarks = Math.ceil(testData.totalMarks * 0.4);
      }
    }

    const test = await MockTest.create(testData);

    res.status(201).json({
      success: true,
      message: 'Mock test created successfully!',
      data: test,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update mock test
// @route   PUT /api/mocktests/:id
// @access  Private (Super Admin)
export const updateMockTest = async (req, res) => {
  try {
    let test = await MockTest.findById(req.params.id);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Mock test not found',
      });
    }

    // Recalculate totals if questions are updated
    if (req.body.questions) {
      req.body.totalQuestions = req.body.questions.length;
      req.body.totalMarks = req.body.questions.reduce((acc, q) => acc + (q.marks || 1), 0);
    }

    test = await MockTest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Mock test updated successfully',
      data: test,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete mock test
// @route   DELETE /api/mocktests/:id
// @access  Private (Super Admin)
export const deleteMockTest = async (req, res) => {
  try {
    const test = await MockTest.findById(req.params.id);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Mock test not found',
      });
    }

    await MockTest.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Mock test deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Toggle mock test publish status
// @route   PUT /api/mocktests/:id/publish
// @access  Private (Super Admin)
export const togglePublish = async (req, res) => {
  try {
    const test = await MockTest.findById(req.params.id);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Mock test not found',
      });
    }

    test.isPublished = !test.isPublished;
    await test.save();

    res.status(200).json({
      success: true,
      message: `Mock test ${test.isPublished ? 'published' : 'unpublished'} successfully`,
      data: test,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Toggle mock test featured status
// @route   PUT /api/mocktests/:id/featured
// @access  Private (Super Admin)
export const toggleFeatured = async (req, res) => {
  try {
    const test = await MockTest.findById(req.params.id);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Mock test not found',
      });
    }

    test.isFeatured = !test.isFeatured;
    await test.save();

    res.status(200).json({
      success: true,
      message: `Mock test ${test.isFeatured ? 'featured' : 'unfeatured'} successfully`,
      data: test,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Submit test result (increment attempts)
// @route   PUT /api/mocktests/:id/submit
// @access  Public
export const submitTestResult = async (req, res) => {
  try {
    const { score } = req.body;
    const test = await MockTest.findById(req.params.id);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Mock test not found',
      });
    }

    // Update attempts and average score
    const newAttempts = test.attempts + 1;
    const newAvgScore = ((test.avgScore * test.attempts) + score) / newAttempts;

    test.attempts = newAttempts;
    test.avgScore = Math.round(newAvgScore * 100) / 100;
    await test.save();

    res.status(200).json({
      success: true,
      message: 'Test result submitted',
      data: {
        score,
        totalMarks: test.totalMarks,
        passed: score >= test.passingMarks,
        passingMarks: test.passingMarks,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get mock tests count
// @route   GET /api/mocktests/count
// @access  Public
export const getMockTestsCount = async (req, res) => {
  try {
    const count = await MockTest.countDocuments({ isPublished: true });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
