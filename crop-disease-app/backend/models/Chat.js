const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    imagePublicId: {
      type: String, // Cloudinary public ID for deletion
    },
    localImageUri: {
      type: String, // Local cached URI for offline access
    },
    disease: {
      type: String,
      required: true,
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    plantType: {
      type: String,
      default: 'Unknown',
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    recommendations: [{
      type: String,
    }],
    additionalInfo: {
      symptoms: [{ type: String }],
      causes: [{ type: String }],
      preventionTips: [{ type: String }],
    },
    metadata: {
      deviceInfo: { type: String },
      location: {
        latitude: { type: Number },
        longitude: { type: Number },
      },
      weather: { type: String },
    },
    isOfflineSync: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
chatSchema.index({ userId: 1, createdAt: -1 });

// Virtual for formatted date
chatSchema.virtual('formattedDate').get(function () {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
});

// Enable virtuals in JSON
chatSchema.set('toJSON', { virtuals: true });
chatSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Chat', chatSchema);
