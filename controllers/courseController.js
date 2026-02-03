import Course from '../models/Course.js';
import User from '../models/User.js';

// @desc    Get all courses (public - only published)
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req, res) => {
  try {
    const { category, level, language, search, isFree, page = 1, limit = 12 } = req.query;

    const query = { isPublished: true };

    if (category) query.category = category;
    if (level) query.level = level;
    if (language) query.language = language;
    if (isFree !== undefined) query.isFree = isFree === 'true';
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const courses = await Course.find(query)
      .populate('postedBy', 'name avatar')
      .select('-lessons.videoUrl') // Don't expose video URLs in list
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Course.countDocuments(query);

    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all courses (admin - all courses)
// @route   GET /api/courses/all
// @access  Private (Super Admin)
export const getAllCourses = async (req, res) => {
  try {
    const { category, level, isPublished, isFeatured, search, page = 1, limit = 20 } = req.query;

    const query = {};

    if (category) query.category = category;
    if (level) query.level = level;
    if (isPublished !== undefined) query.isPublished = isPublished === 'true';
    if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const courses = await Course.find(query)
      .populate('postedBy', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Course.countDocuments(query);

    // Stats
    const stats = {
      total: await Course.countDocuments(),
      published: await Course.countDocuments({ isPublished: true }),
      drafts: await Course.countDocuments({ isPublished: false }),
      featured: await Course.countDocuments({ isFeatured: true }),
      free: await Course.countDocuments({ isFree: true }),
      totalViews: await Course.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]).then(r => r[0]?.total || 0),
      totalEnrollments: await Course.aggregate([{ $group: { _id: null, total: { $sum: '$enrollments' } } }]).then(r => r[0]?.total || 0),
    };

    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      stats,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get featured courses
// @route   GET /api/courses/featured
// @access  Public
export const getFeaturedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true, isFeatured: true })
      .populate('postedBy', 'name avatar')
      .select('-lessons.videoUrl')
      .sort({ createdAt: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single course by slug
// @route   GET /api/courses/:slug
// @access  Public
export const getCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug })
      .populate('postedBy', 'name email avatar');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Increment views
    course.views += 1;
    await course.save();

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get course by ID (Admin)
// @route   GET /api/courses/id/:id
// @access  Private
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('postedBy', 'name email avatar');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private (Super Admin)
export const createCourse = async (req, res) => {
  try {
    const courseData = {
      ...req.body,
      postedBy: req.user.id,
    };

    const course = await Course.create(courseData);

    res.status(201).json({
      success: true,
      message: 'Course created successfully!',
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Super Admin)
export const updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Recalculate totals if lessons are updated
    if (req.body.lessons) {
      req.body.totalLessons = req.body.lessons.length;
      req.body.totalDuration = req.body.lessons.reduce((acc, lesson) => acc + (lesson.duration || 0), 0);
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Super Admin)
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Toggle course publish status
// @route   PUT /api/courses/:id/publish
// @access  Private (Super Admin)
export const togglePublish = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    course.isPublished = !course.isPublished;
    await course.save();

    res.status(200).json({
      success: true,
      message: `Course ${course.isPublished ? 'published' : 'unpublished'} successfully`,
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Toggle course featured status
// @route   PUT /api/courses/:id/featured
// @access  Private (Super Admin)
export const toggleFeatured = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    course.isFeatured = !course.isFeatured;
    await course.save();

    res.status(200).json({
      success: true,
      message: `Course ${course.isFeatured ? 'featured' : 'unfeatured'} successfully`,
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get courses count
// @route   GET /api/courses/count
// @access  Public
export const getCoursesCount = async (req, res) => {
  try {
    const count = await Course.countDocuments({ isPublished: true });

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
