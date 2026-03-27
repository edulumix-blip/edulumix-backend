import Course from '../models/Course.js';
import User from '../models/User.js';
import { runExternalCourseFetch } from '../utils/runCourseFetch.js';

// @desc    Fetch courses from Udemy (Super Admin only)
// @route   POST /api/courses/fetch-external
// @access  Private (super_admin only)
export const fetchExternalCourses = async (req, res) => {
  try {
    const { limit = 15 } = req.body || {};
    const data = await runExternalCourseFetch(limit);
    res.status(200).json({
      success: true,
      message: 'External courses fetched and stored',
      data,
    });
  } catch (error) {
    console.error('fetchExternalCourses error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all courses (public - only published)
// @route   GET /api/courses
// @access  Public
const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const COURSE_CATEGORY_ENUM = [
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
];

const COURSE_LEVEL_ENUM = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
const COURSE_LANGUAGE_ENUM = ['English', 'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Others'];

export const getCourses = async (req, res) => {
  try {
    const {
      category,
      level,
      language,
      search,
      isFree,
      isFeatured,
      page = 1,
      limit = 12,
    } = req.query;

    const query = { isPublished: true };

    if (category && category !== 'All') query.category = category;
    if (level && level !== 'All') query.level = level;
    if (language && language !== 'All') query.language = language;
    if (isFree !== undefined && isFree !== '' && isFree !== 'All') {
      query.isFree = isFree === 'true';
    }
    if (isFeatured === 'true') query.isFeatured = true;

    const searchTrim = search && String(search).trim().slice(0, 120);
    if (searchTrim) {
      const rx = new RegExp(escapeRegex(searchTrim), 'i');
      query.$or = [
        { title: { $regex: rx } },
        { description: { $regex: rx } },
        { tags: { $regex: rx } },
      ];
    }

    const lim = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 100);
    const pg = Math.max(parseInt(page, 10) || 1, 1);

    const courses = await Course.find(query)
      .populate('postedBy', 'name avatar')
      .select('-lessons.videoUrl') // Don't expose video URLs in list
      .sort({ createdAt: -1 })
      .limit(lim)
      .skip((pg - 1) * lim);

    const total = await Course.countDocuments(query);

    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      totalPages: Math.ceil(total / lim) || 1,
      currentPage: pg,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Filter dropdown values for public course listing
// @route   GET /api/courses/filter-options
// @access  Public
export const getCourseFilterOptions = async (req, res) => {
  try {
    const base = { isPublished: true };
    const [cats, levels, langs] = await Promise.all([
      Course.distinct('category', base),
      Course.distinct('level', base),
      Course.distinct('language', base),
    ]);

    const categories = COURSE_CATEGORY_ENUM.filter((c) => cats.includes(c));
    for (const c of cats.sort((a, b) => a.localeCompare(b))) {
      if (!categories.includes(c)) categories.push(c);
    }

    const levelOptions = COURSE_LEVEL_ENUM.filter((l) => levels.includes(l));
    for (const l of levels.sort((a, b) => a.localeCompare(b))) {
      if (!levelOptions.includes(l)) levelOptions.push(l);
    }

    const languageOptions = COURSE_LANGUAGE_ENUM.filter((l) => langs.includes(l));
    for (const l of langs.sort((a, b) => a.localeCompare(b))) {
      if (!languageOptions.includes(l)) languageOptions.push(l);
    }

    res.status(200).json({
      success: true,
      data: {
        categories,
        levels: levelOptions,
        languages: languageOptions,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
    const course = await Course.findOne({ slug: req.params.slug, isPublished: true })
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

    const allowedFields = [
      'title',
      'description',
      'shortDescription',
      'thumbnail',
      'previewVideo',
      'category',
      'level',
      'language',
      'actualPrice',
      'offerPrice',
      'isFree',
      'lessons',
      'instructor',
      'features',
      'requirements',
      'whatYouWillLearn',
      'tags',
      'enrollmentLink',
      'whatsappNumber',
      'isPublished',
      'isFeatured',
      'source',
      'externalId',
      'rawApiData',
    ];
    const updateData = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    }

    // Recalculate totals if lessons are updated
    if (updateData.lessons) {
      updateData.totalLessons = updateData.lessons.length;
      updateData.totalDuration = updateData.lessons.reduce((acc, lesson) => acc + (lesson.duration || 0), 0);
    }

    course = await Course.findByIdAndUpdate(req.params.id, updateData, {
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
