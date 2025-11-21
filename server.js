require("dotenv").config();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const TelegramBot = require('node-telegram-bot-api');
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Telegram Bot Setup
const botToken = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(botToken, { polling: false });

let uploadPath = "";

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!uploadPath) {
      const currentTime = new Date().toISOString().replace(/[:.]/g, "-");
      uploadPath = path.join(__dirname, `uploads/${currentTime}`);

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, JPEG, PNG, GIF, and WebP files are allowed'));
    }
  }
});

// API Routes
app.post("/api/upload", upload.array("files"), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const caption = req.body.caption || '';

    const uploadPromises = req.files.map((file, index) => {
      const options = {};
      
      // Add caption to the first image only (Telegram groups captions with media)
      if (caption && index === 0) {
        options.caption = caption;
      }
      
      return bot.sendDocument(process.env.TELEGRAM_CHAT_ID, file.path, options)
        .then(() => {
          // Delete file after successful upload
          fs.unlinkSync(file.path);
          console.log(`✅ Uploaded: ${file.originalname}`);
        })
        .catch((error) => {
          console.error(`❌ Telegram upload error for ${file.originalname}:`, error.message);
          // Still delete the file even if upload fails
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
          throw error;
        });
    });

    await Promise.all(uploadPromises);
    
    // Clean up upload directory if empty
    if (uploadPath && fs.existsSync(uploadPath)) {
      const files = fs.readdirSync(uploadPath);
      if (files.length === 0) {
        fs.rmdirSync(uploadPath);
      }
    }
    
    uploadPath = "";
    res.json({ 
      success: true, 
      message: "Files uploaded successfully",
      count: req.files.length 
    });
  } catch (error) {
    uploadPath = "";
    console.error("Upload error:", error);
    res.status(500).json({ 
      error: "Upload failed", 
      details: error.message 
    });
  }
});

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
