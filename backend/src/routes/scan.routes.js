const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { scanController, getHistoryController } = require('../controllers/scan.controller');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/scan', authMiddleware, upload.single('image'), scanController);
router.get('/history', authMiddleware, getHistoryController);

module.exports = router;
