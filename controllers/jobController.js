import Job from '../models/Job.js';
import User from '../models/User.js';
import { runExternalJobFetch } from '../utils/runJobFetch.js';

// @desc    Fetch jobs from Adzuna + JSearch and store in DB (Super Admin only)
// @route   POST /api/jobs/fetch-external
// @access  Private (super_admin only)
export const fetchExternalJobs = async (req, res) => {
  try {
    const { adzunaLimit = 20, jsearchPages = 2 } = req.body || {};
    const data = await runExternalJobFetch(adzunaLimit, jsearchPages);

    res.status(200).json({
      success: true,
      message: 'External jobs fetched and stored',
      data,
    });
  } catch (error) {
    console.error('fetchExternalJobs error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all jobs (public, super_admin sees all including deleted)
// @route   GET /api/jobs
// @access  Public (optionalAuth for super_admin)
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const getJobs = async (req, res) => {
  try {
    const {
      category,
      status,
      experience,
      search,
      page = 1,
      limit = 12,
      postedBy,
      location: locationFilter,
      city,
    } = req.query;

    const clauses = [];

    // Public/contributors should not see soft-deleted jobs
    // Super admin can see all jobs (including soft-deleted)
    if (!req.user || req.user.role !== 'super_admin') {
      clauses.push({ isDeleted: { $ne: true } });
    }

    if (category && category !== 'All') clauses.push({ category });
    if (status && status !== 'All') clauses.push({ status });
    if (experience && experience !== 'All') clauses.push({ experience });

    const locExact = locationFilter && String(locationFilter).trim();
    if (locExact && locExact !== 'All') {
      clauses.push({ location: locExact });
    }

    const cityTrim = city && String(city).trim();
    if (cityTrim && cityTrim !== 'All') {
      const rx = new RegExp(`^${escapeRegex(cityTrim)}(\\s*,|$)`, 'i');
      clauses.push({ location: { $regex: rx } });
    }
    if (postedBy && req.user?.role === 'super_admin') {
      clauses.push({ postedBy });
    }

    const searchTrim = search && String(search).trim().slice(0, 120);
    if (searchTrim) {
      const rx = new RegExp(escapeRegex(searchTrim), 'i');
      clauses.push({
        $or: [
          { title: { $regex: rx } },
          { company: { $regex: rx } },
          { location: { $regex: rx } },
        ],
      });
    }

    const query =
      clauses.length === 0 ? {} : clauses.length === 1 ? clauses[0] : { $and: clauses };

    const lim = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 100);
    const pg = Math.max(parseInt(page, 10) || 1, 1);

    const jobs = await Job.find(query)
      .populate('postedBy', 'name email avatar role')
      .sort({ createdAt: -1 })
      .limit(lim)
      .skip((pg - 1) * lim);

    const total = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      totalPages: Math.ceil(total / lim) || 1,
      currentPage: pg,
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Distinct filter values for jobs listing UI (dropdowns)
// @route   GET /api/jobs/filter-options
// @access  Public
export const getJobFilterOptions = async (req, res) => {
  try {
    const base =
      !req.user || req.user.role !== 'super_admin' ? { isDeleted: { $ne: true } } : {};

    const [locations, experiencesInDb] = await Promise.all([
      Job.distinct('location', base),
      Job.distinct('experience', base),
    ]);

    const locList = locations.filter(Boolean).sort((a, b) => a.localeCompare(b, 'en'));
    const locationsCapped = locList.slice(0, 300);

    const expOrder = ['Fresher', '1 Year', '2 Years', '3 Years', '4 Years', '5+ Years'];
    const experiences = expOrder.filter((e) => experiencesInDb.includes(e));

    const citySet = new Set();
    for (const loc of locList) {
      const part = String(loc).split(',')[0].trim();
      if (part) citySet.add(part);
    }
    const cities = [...citySet].sort((a, b) => a.localeCompare(b, 'en')).slice(0, 250);

    res.status(200).json({
      success: true,
      data: {
        locations: locationsCapped,
        cities,
        experiences,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const JOB_CATEGORY_KEYS = [
  'IT Job',
  'Non IT Job',
  'Walk In Drive',
  'Govt Job',
  'Internship',
  'Part Time Job',
  'Remote Job',
  'Others',
];

// @desc    Total job count for public jobs listing UI (hero)
// @route   GET /api/jobs/stats
// @access  Public
export const getJobStats = async (req, res) => {
  try {
    const baseQuery =
      !req.user || req.user.role !== 'super_admin' ? { isDeleted: { $ne: true } } : {};

    const total = await Job.countDocuments(baseQuery);

    const data = { total };
    if (req.user?.role === 'super_admin') {
      data.open = await Job.countDocuments({ ...baseQuery, status: 'Open' });
      data.closed = await Job.countDocuments({ ...baseQuery, status: 'Closed' });
      const viewsAgg = await Job.aggregate([
        { $match: baseQuery },
        { $group: { _id: null, totalViews: { $sum: { $ifNull: ['$views', 0] } } } },
      ]);
      data.totalViews = viewsAgg[0]?.totalViews ?? 0;
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get jobs by category (grouped)
// @route   GET /api/jobs/grouped
// @access  Public
export const getJobsGrouped = async (req, res) => {
  try {
    const categories = [...JOB_CATEGORY_KEYS];

    const groupedJobs = {};

    const baseQuery = (!req.user || req.user.role !== 'super_admin') ? { isDeleted: { $ne: true } } : {};
    for (const category of categories) {
      const jobs = await Job.find({ ...baseQuery, category })
        .populate('postedBy', 'name avatar')
        .sort({ createdAt: -1 })
        .limit(6);
      
      if (jobs.length > 0) {
        groupedJobs[category] = {
          jobs,
          total: await Job.countDocuments({ ...baseQuery, category }),
        };
      }
    }

    res.status(200).json({
      success: true,
      data: groupedJobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
export const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email avatar role');
    if (job.isDeleted && (!req.user || req.user.role !== 'super_admin')) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }


    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Increment views
    job.views += 1;
    await job.save();

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create job
// @route   POST /api/jobs
// @access  Private (job_poster, super_admin)
export const createJob = async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      postedBy: req.user.id,
    };

    const job = await Job.create(jobData);

    // Add 1 point to user (except super_admin)
    if (req.user.role !== 'super_admin') {
      try {
        const updatedUser = await User.findByIdAndUpdate(
          req.user.id, 
          { $inc: { points: 1 } },
          { new: true, runValidators: true }
        );
        console.log(`Points updated for user ${req.user.id}: ${updatedUser.points}`);
      } catch (pointsError) {
        console.error('Error updating points:', pointsError);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Job posted successfully. You earned 1 point!',
      data: job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (owner or super_admin)
export const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Check ownership (unless super_admin)
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job',
      });
    }

    const allowedFields = [
      'title',
      'company',
      'location',
      'category',
      'experience',
      'salary',
      'status',
      'companyLogo',
      'applyLink',
      'description',
      'source',
      'externalId',
      'closedSyncedAt',
    ];
    const updateData = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    }

    job = await Job.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (owner or super_admin)
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Check ownership (unless super_admin)
    if (job.postedBy.toString() !== req.user.id && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job',
      });
    }

    // Super admin: Permanently delete
    if (req.user.role === 'super_admin') {
      await Job.findByIdAndDelete(req.params.id);
      
      return res.status(200).json({
        success: true,
        message: 'Job permanently deleted',
      });
    }

    // Contributor: Soft delete (mark as deleted)
    job.isDeleted = true;
    job.deletedAt = new Date();
    await job.save();

    // Deduct 1 point from user (except super_admin)
    if (req.user.role !== 'super_admin') {
      try {
        const updatedUser = await User.findByIdAndUpdate(
          job.postedBy, 
          { $inc: { points: -1 } },
          { new: true, runValidators: true }
        );
        // Ensure points don't go below 0
        if (updatedUser.points < 0) {
          await User.findByIdAndUpdate(job.postedBy, { points: 0 });
        }
        console.log(`Points deducted for user ${job.postedBy}: ${updatedUser.points}`);
      } catch (pointsError) {
        console.error('Error updating points:', pointsError);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully. 1 point deducted.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Like job
// @route   PUT /api/jobs/:id/like
// @access  Public (but tracks user if logged in)
export const likeJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // If user is logged in, track their like
    if (req.user) {
      const userIdStr = req.user.id.toString();
      const hasLiked = job.likes.some(id => id.toString() === userIdStr);
      
      if (hasLiked) {
        // Unlike
        job.likes = job.likes.filter(id => id.toString() !== userIdStr);
        job.likesCount = Math.max(0, job.likesCount - 1);
      } else {
        // Like
        job.likes.push(req.user.id);
        job.likesCount += 1;
      }
    } else {
      // Anonymous like (just increment count)
      job.likesCount += 1;
    }

    await job.save();

    res.status(200).json({
      success: true,
      likesCount: job.likesCount,
      liked: req.user ? job.likes.some(id => id.toString() === req.user.id.toString()) : null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get job by slug
// @route   GET /api/jobs/slug/:slug
// @access  Public
export const getJobBySlug = async (req, res) => {
  try {
    const job = await Job.findOne({ slug: req.params.slug }).populate('postedBy', 'name email avatar role');
    if (job.isDeleted && (!req.user || req.user.role !== 'super_admin')) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }


    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Increment views
    job.views += 1;
    await job.save();

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get my posted jobs
// @route   GET /api/jobs/my-jobs
// @access  Private
export const getMyJobs = async (req, res) => {
  try {
    // Contributors should not see their soft-deleted jobs
    const jobs = await Job.find({ postedBy: req.user.id, isDeleted: { $ne: true } })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
