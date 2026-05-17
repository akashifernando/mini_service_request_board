const mongoose = require('mongoose');
const validator = require('validator');

const jobRequestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a job title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a job description'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please specify a job category'],
      enum: {
        values: ['Plumbing', 'Electrical', 'Painting', 'Joinery', 'Gardening', 'Cleaning', 'Other'],
        message: '{VALUE} is not a valid category',
      },
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please provide a location'],
      trim: true,
    },
    contactName: {
      type: String,
      required: [true, 'Please provide a contact name'],
      trim: true,
    },
    contactEmail: {
      type: String,
      required: [true, 'Please provide a contact email'],
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid contact email'],
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['Open', 'In Progress', 'Closed'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Open',
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for keyword search on title and description
jobRequestSchema.index({ title: 'text', description: 'text' });

const JobRequest = mongoose.model('JobRequest', jobRequestSchema);

module.exports = JobRequest;
