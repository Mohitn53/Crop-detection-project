# 🌱 CropGuard - Crop Disease Detection App

A hackathon-ready **React Native + Expo** mobile application for detecting plant diseases using AI, with a **Node.js + Express + MongoDB** backend.

## 🚀 Features

- **Splash Screen** → Logo + title → Auto-navigate to login
- **Slash Command Onboarding** → 4 questions for problem-statement input
- **Authentication**
  - Local auth with Passport.js
  - Google OAuth (mock for offline demo)
  - JWT token-based security
- **Home Screen (Single Page)**
  - Navbar: History, Profile, Language
  - Carousel/Banners
  - Scan Leaf / Upload Image (expo-image-picker)
  - Mock ML `predictDisease(imageUri)` function
  - ChatGPT-style chat history with thumbnails
  - Click to expand image + full result
  - Syncs with MongoDB + Cloudinary
- **Profile Section** → Edit user details, farm info
- **Language Selector** → Multi-language support (EN, HI, ES, FR, DE, PT)
- **FAQ Section** → Common questions answered
- **Offline-First**
  - Latest chats cached in AsyncStorage
  - Images cached locally
  - Auto-sync when online
- **Earthy Design** → Green, brown, white colors with rounded cards

---

## 📁 Project Structure

```
crop-disease-app/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   ├── cloudinary.js      # Cloudinary config
│   │   └── passport.js        # Auth strategies
│   ├── middleware/
│   │   └── auth.js            # JWT middleware
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Chat.js            # Chat/scan schema
│   ├── routes/
│   │   ├── auth.js            # /signup, /login, /google
│   │   ├── profile.js         # /profile/:userId
│   │   └── chats.js           # /upload, /chats/:userId
│   ├── server.js              # Express app entry
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── constants/
    │   │   ├── theme.js       # Colors, fonts, config
    │   │   └── translations.js # Multi-language
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   ├── ChatContext.jsx
    │   │   └── LanguageContext.jsx
    │   ├── navigation/
    │   │   └── AppNavigator.jsx
    │   ├── screens/
    │   │   ├── SplashScreen.jsx
    │   │   ├── LoginScreen.jsx
    │   │   ├── SignupScreen.jsx
    │   │   ├── OnboardingScreen.jsx
    │   │   ├── HomeScreen.jsx
    │   │   ├── HistoryScreen.jsx
    │   │   └── ProfileScreen.jsx
    │   ├── services/
    │   │   ├── api.js         # Axios API calls
    │   │   └── mlService.js   # Mock ML predictions
    │   └── utils/
    │       └── storage.js     # Offline caching
    ├── App.jsx
    ├── app.json               # Expo config
    └── package.json
```

---

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your phone

### 1️⃣ Backend Setup

```bash
cd crop-disease-app/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your values:
# - MONGODB_URI
# - JWT_SECRET
# - CLOUDINARY credentials (optional)

# Start server
npm run dev
```

Server runs at `http://localhost:5000`

### 2️⃣ Frontend Setup

```bash
cd crop-disease-app/frontend

# Install dependencies
npm install

# Update API URL in src/constants/theme.js
# For Android emulator: http://10.0.2.2:5000/api
# For physical device: http://YOUR_IP:5000/api

# Start Expo
npm start
# or
expo start
```

Scan QR code with Expo Go app.

---

## 📱 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/google` | Google OAuth (mock) |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/profile/:userId` | Get user profile |
| PUT | `/api/profile/:userId` | Update profile |
| POST | `/api/upload` | Upload image & analyze |
| GET | `/api/chats/:userId` | Get chat history |
| DELETE | `/api/chats/:chatId` | Delete a chat |
| POST | `/api/chats/sync` | Sync offline chats |

---

## 🎨 Design System

### Colors (Earthy Theme)
- **Primary Green**: `#2D5A27`
- **Secondary Brown**: `#8B6914`
- **Background**: `#F5F5F0`
- **Cards**: `#FFFFFF`
- **Accent**: `#D4A84B`

### Typography
- Large headings: 24-32px bold
- Body text: 14-16px regular
- Captions: 10-12px light

---

## 🔬 Mock ML Function

The `predictDisease(imageUri)` function simulates ML predictions:

```javascript
// Returns one of:
- Apple Scab
- Tomato Late Blight
- Corn Common Rust
- Grape Black Rot
- Potato Early Blight
- Pepper Bacterial Spot
- Strawberry Leaf Scorch
- Healthy Leaf
- Citrus Greening
- Peach Bacterial Spot
```

Each result includes:
- Disease name
- Plant type
- Confidence (85-97%)
- Severity (Low/Medium/High/Critical)
- Recommendations
- Symptoms, causes, prevention tips

---

## 📴 Offline Support

1. **AsyncStorage** caches:
   - User authentication
   - Recent chat history
   - Language preference

2. **FileSystem** caches:
   - Scanned/uploaded images

3. **Auto-Sync**:
   - Offline scans stored locally
   - Synced when connection restored

---

## 🚀 Demo Mode

For hackathon demo without backend:

1. App works with cached data when offline
2. Mock predictions run locally
3. Images stored in device cache
4. Google OAuth simulated

---

## 🔐 Environment Variables

### Backend (.env)

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/crop-disease-db
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## 📦 Key Dependencies

### Backend
- express, mongoose, passport
- bcryptjs, jsonwebtoken
- cloudinary, multer
- cors, dotenv

### Frontend
- expo, react-native
- @react-navigation/native
- expo-image-picker
- @react-native-async-storage/async-storage
- axios

---

## 👥 Team

Built for IEEE Hackathon 2026

---

## 📄 License

MIT License - Free to use for hackathons and educational purposes.
