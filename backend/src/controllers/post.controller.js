const postModel = require('../models/post.model');
const generateCaption = require('../service/ai.service');
const uploadImage = require('../service/storage.service');

const postController = async (req, res) => {
    try {
        const file = req.file;
        const base64 = file.buffer.toString('base64');
        const caption = await generateCaption(base64);
        const result = await uploadImage(file.buffer, file.originalname);
        const newPost = await postModel.create({
            caption: caption,
            image: result.url,  
            userid:req.user._id
        });
        res.status(201).json({
            message: 'Post created successfully',
            post: newPost
            
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

module.exports = {
    postController
}