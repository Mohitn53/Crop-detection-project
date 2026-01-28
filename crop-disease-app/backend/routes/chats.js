const express = require('express');
const Chat = require('../models/Chat');
const { protect } = require('../middleware/auth');
const { upload, cloudinary } = require('../config/cloudinary');

const router = express.Router();

// Mock ML Disease Prediction (for hackathon demo)
const predictDisease = (imageUrl) => {
  // Mock diseases for PlantVillage dataset
  const diseases = [
    {
      disease: 'Apple Scab',
      plantType: 'Apple',
      confidence: 94.5,
      severity: 'Medium',
      recommendations: [
        'Remove and destroy infected leaves',
        'Apply fungicide spray',
        'Ensure proper air circulation',
        'Water at the base of plants'
      ],
      additionalInfo: {
        symptoms: ['Dark olive-green spots on leaves', 'Velvety texture on spots', 'Leaf curling'],
        causes: ['Venturia inaequalis fungus', 'Cool, wet weather conditions'],
        preventionTips: ['Plant resistant varieties', 'Rake fallen leaves', 'Prune trees for airflow']
      }
    },
    {
      disease: 'Tomato Late Blight',
      plantType: 'Tomato',
      confidence: 91.2,
      severity: 'High',
      recommendations: [
        'Remove infected plants immediately',
        'Apply copper-based fungicide',
        'Avoid overhead irrigation',
        'Rotate crops yearly'
      ],
      additionalInfo: {
        symptoms: ['Water-soaked spots', 'White fuzzy growth', 'Brown lesions'],
        causes: ['Phytophthora infestans', 'High humidity'],
        preventionTips: ['Use certified seeds', 'Improve drainage', 'Space plants properly']
      }
    },
    {
      disease: 'Corn Common Rust',
      plantType: 'Corn (Maize)',
      confidence: 88.7,
      severity: 'Medium',
      recommendations: [
        'Apply fungicide if severe',
        'Plant resistant hybrids',
        'Monitor fields regularly',
        'Remove volunteer corn'
      ],
      additionalInfo: {
        symptoms: ['Reddish-brown pustules', 'Circular to elongated spots', 'Powdery spores'],
        causes: ['Puccinia sorghi fungus', 'Moderate temperatures'],
        preventionTips: ['Early planting', 'Balanced fertilization', 'Destroy crop residue']
      }
    },
    {
      disease: 'Grape Black Rot',
      plantType: 'Grape',
      confidence: 92.1,
      severity: 'High',
      recommendations: [
        'Remove mummified berries',
        'Apply protective fungicides',
        'Improve canopy management',
        'Prune out infected wood'
      ],
      additionalInfo: {
        symptoms: ['Tan circular spots', 'Black pycnidia', 'Shriveled berries'],
        causes: ['Guignardia bidwellii fungus', 'Warm wet conditions'],
        preventionTips: ['Sanitation practices', 'Proper trellising', 'Timely spraying']
      }
    },
    {
      disease: 'Potato Early Blight',
      plantType: 'Potato',
      confidence: 89.3,
      severity: 'Medium',
      recommendations: [
        'Remove lower infected leaves',
        'Apply chlorothalonil fungicide',
        'Ensure adequate nitrogen',
        'Avoid overhead watering'
      ],
      additionalInfo: {
        symptoms: ['Target-like spots', 'Yellowing leaves', 'Concentric rings'],
        causes: ['Alternaria solani fungus', 'Stressed plants'],
        preventionTips: ['Crop rotation', 'Proper spacing', 'Mulching']
      }
    },
    {
      disease: 'Healthy Leaf',
      plantType: 'Unknown',
      confidence: 96.8,
      severity: 'Low',
      recommendations: [
        'Continue current care routine',
        'Monitor for any changes',
        'Maintain proper watering schedule',
        'Keep up with fertilization'
      ],
      additionalInfo: {
        symptoms: ['No disease symptoms detected'],
        causes: ['Plant is healthy'],
        preventionTips: ['Regular monitoring', 'Proper nutrition', 'Good hygiene']
      }
    }
  ];

  // Randomly select a disease for demo
  return diseases[Math.floor(Math.random() * diseases.length)];
};

// @route   POST /api/upload
// @desc    Upload image and get disease prediction
// @access  Private
router.post('/upload', protect, upload.single('image'), async (req, res) => {
  try {
    let imageUrl, imagePublicId;

    // Check if real upload or mock
    if (req.file) {
      imageUrl = req.file.path;
      imagePublicId = req.file.filename;
    } else if (req.body.imageUri) {
      // For demo/offline mode - use mock URL
      imageUrl = req.body.imageUri || 'https://via.placeholder.com/300x300.png?text=Leaf+Image';
      imagePublicId = `mock-${Date.now()}`;
    } else {
      return res.status(400).json({
        success: false,
        message: 'No image provided',
      });
    }

    // Get mock prediction
    const prediction = predictDisease(imageUrl);

    // Create chat record
    const chat = await Chat.create({
      userId: req.user._id,
      imageUrl,
      imagePublicId,
      localImageUri: req.body.localImageUri || '',
      disease: prediction.disease,
      confidence: prediction.confidence,
      plantType: prediction.plantType,
      severity: prediction.severity,
      recommendations: prediction.recommendations,
      additionalInfo: prediction.additionalInfo,
      metadata: {
        deviceInfo: req.body.deviceInfo || '',
        location: req.body.location || {},
        weather: req.body.weather || '',
      },
      isOfflineSync: req.body.isOfflineSync || false,
    });

    res.status(201).json({
      success: true,
      message: 'Image analyzed successfully',
      data: { chat },
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing image',
      error: error.message,
    });
  }
});

// @route   GET /api/chats/:userId
// @desc    Get chat history for user
// @access  Private
router.get('/:userId', protect, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    // Verify user
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    const chats = await Chat.find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Chat.countDocuments({ userId });

    res.json({
      success: true,
      data: {
        chats,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching chats',
      error: error.message,
    });
  }
});

// @route   GET /api/chats/single/:chatId
// @desc    Get single chat detail
// @access  Private
router.get('/single/:chatId', protect, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    // Verify ownership
    if (chat.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    res.json({
      success: true,
      data: { chat },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching chat',
      error: error.message,
    });
  }
});

// @route   DELETE /api/chats/:chatId
// @desc    Delete a chat
// @access  Private
router.delete('/:chatId', protect, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    // Verify ownership
    if (chat.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    // Delete image from Cloudinary if exists
    if (chat.imagePublicId && !chat.imagePublicId.startsWith('mock')) {
      try {
        await cloudinary.uploader.destroy(chat.imagePublicId);
      } catch (cloudinaryError) {
        console.error('Cloudinary delete error:', cloudinaryError);
      }
    }

    await Chat.findByIdAndDelete(req.params.chatId);

    res.json({
      success: true,
      message: 'Chat deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting chat',
      error: error.message,
    });
  }
});

// @route   POST /api/chats/sync
// @desc    Sync offline chats
// @access  Private
router.post('/sync', protect, async (req, res) => {
  try {
    const { offlineChats } = req.body;

    if (!offlineChats || !Array.isArray(offlineChats)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid offline chats data',
      });
    }

    const syncedChats = [];

    for (const chatData of offlineChats) {
      const chat = await Chat.create({
        ...chatData,
        userId: req.user._id,
        isOfflineSync: true,
      });
      syncedChats.push(chat);
    }

    res.json({
      success: true,
      message: `Synced ${syncedChats.length} chats`,
      data: { syncedChats },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error syncing chats',
      error: error.message,
    });
  }
});

module.exports = router;
