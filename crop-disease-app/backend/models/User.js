const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      minlength: 6,
      select: false, // Don't include password in queries by default
    },
    avatar: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    language: {
      type: String,
      enum: ['en', 'hi', 'es', 'fr', 'de', 'pt'],
      default: 'en',
    },
    farmDetails: {
      farmName: { type: String, default: '' },
      cropTypes: [{ type: String }],
      farmSize: { type: String, default: '' },
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows null values to be non-unique
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    onboardingAnswers: [{
      question: String,
      answer: String,
    }],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  const user = await mongoose.model('User').findById(this._id).select('+password');
  if (!user.password) return false;
  return await bcrypt.compare(candidatePassword, user.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
