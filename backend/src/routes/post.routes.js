const express =require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const {postController} = require('../controllers/post.controller')
const multer = require('multer')


const upload= multer({storage:multer.memoryStorage()})


router.post('/post',authMiddleware,upload.single('image'),postController)

module.exports = router