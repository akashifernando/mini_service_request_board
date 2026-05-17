const JobRequest = require('../models/JobRequest');

// @desc    Get all job requests
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res, next) => {
  try {
    const queryObj = {};

    // Filter by category (Case-Insensitive Match)
    if (req.query.category) {
      const allowedCategories = ['Plumbing', 'Electrical', 'Painting', 'Joinery', 'Gardening', 'Cleaning', 'Other'];
      const matchedCategory = allowedCategories.find(
        (c) => c.toLowerCase() === req.query.category.toLowerCase()
      );
      if (matchedCategory) {
        queryObj.category = matchedCategory;
      } else {
        queryObj.category = req.query.category;
      }
    }

    // Filter by status (Case-Insensitive Match)
    if (req.query.status) {
      const allowedStatuses = ['Open', 'In Progress', 'Closed'];
      const matchedStatus = allowedStatuses.find(
        (s) => s.toLowerCase() === req.query.status.toLowerCase()
      );
      if (matchedStatus) {
        queryObj.status = matchedStatus;
      } else {
        queryObj.status = req.query.status;
      }
    }

    // Keyword search across title, description, status, category, and location (Case-Insensitive Regex)
    if (req.query.search) {
      const searchRegex = { $regex: req.query.search, $options: 'i' };
      queryObj.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { status: searchRegex },
        { category: searchRegex },
        { location: searchRegex }
      ];
    }

    // Get jobs sorted by newest first
    const jobs = await JobRequest.find(queryObj).sort({ createdAt: -1 }).populate('postedBy', 'name email');

    res.json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job request
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res, next) => {
  try {
    const job = await JobRequest.findById(req.params.id).populate('postedBy', 'name email');

    if (!job) {
      return res.status(404).json({
        success: false,
        error: `Job request not found with id of ${req.params.id}`,
      });
    }

    res.json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new job request
// @route   POST /api/jobs
// @access  Private
const createJob = async (req, res, next) => {
  try {
    const { title, description, category, location, contactName, contactEmail } = req.body;

    // Validate fields exist
    if (!title || !description || !category || !location || !contactName || !contactEmail) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in all required fields (title, description, category, location, contactName, contactEmail)',
      });
    }

    // Create job request
    const job = await JobRequest.create({
      title,
      description,
      category,
      location,
      contactName,
      contactEmail,
      postedBy: req.user ? req.user._id : undefined, // Associate with logged-in user if JWT is present
    });

    res.status(201).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job status only
// @route   PATCH /api/jobs/:id
// @access  Private
const updateJobStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    // Check if status is provided
    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a status to update',
      });
    }

    // Validate status values
    const allowedStatuses = ['Open', 'In Progress', 'Closed'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`,
      });
    }

    // Find job
    let job = await JobRequest.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: `Job request not found with id of ${req.params.id}`,
      });
    }

    // Update only the status
    job.status = status;
    await job.save();

    res.json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a job request
// @route   DELETE /api/jobs/:id
// @access  Private
const deleteJob = async (req, res, next) => {
  try {
    const job = await JobRequest.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: `Job request not found with id of ${req.params.id}`,
      });
    }

    // Optional constraint: Only allow deleting if user posted it OR user is admin (we can keep it simple: any logged-in user can delete, as per "JWT-based auth so only logged-in users can post or delete")
    await JobRequest.deleteOne({ _id: req.params.id });

    res.json({
      success: true,
      message: 'Job request successfully deleted',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJobStatus,
  deleteJob,
};
