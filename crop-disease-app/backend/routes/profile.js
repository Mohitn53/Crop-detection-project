const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/profile/:userId
// @desc    Get user profile
// @access  Private
router.get('/:userId', protect, async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify user is accessing their own profile
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this profile',
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message,
    });
  }
});

// @route   PUT /api/profile/:userId
// @desc    Update user profile
// @access  Private
router.put('/:userId', protect, async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify user is updating their own profile
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile',
      });
    }

    const allowedUpdates = [
      'name',
      'phone',
      'location',
      'language',
      'avatar',
      'farmDetails',
      'onboardingCompleted',
      'onboardingAnswers',
    ];

    const updates = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message,
    });
  }
});

// @route   PUT /api/profile/:userId/language
// @desc    Update user language preference
// @access  Private
router.put('/:userId/language', protect, async (req, res) => {
  try {
    const { userId } = req.params;
    const { language } = req.body;

    if (req.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    const validLanguages = ['en', 'hi', 'es', 'fr', 'de', 'pt'];
    if (!validLanguages.includes(language)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid language code',
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { language },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Language updated',
      data: { user },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating language',
      error: error.message,
    });
  }
});

// @route   DELETE /api/profile/:userId
// @desc    Delete user account
// @access  Private
router.delete('/:userId', protect, async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    await User.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting account',
      error: error.message,
    });
  }
});

module.exports = router;
