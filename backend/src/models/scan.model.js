const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true
    },
    plant: String,
    condition: String,
    status: {
        type: String,
        default: 'UNKNOWN'
    },
    confidence: Number,
    fullReport: Object, // Store the raw top5 etc
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
}, { timestamps: true });

module.exports = mongoose.model("scan", scanSchema);
