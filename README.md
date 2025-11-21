# 📦 TeleBox - MERN Stack

Your personal storage box for Telegram. A full-stack MERN application that uploads images directly to your Telegram chat. Built with React, Express, and Node.js for fast and reliable file sharing.

## Features

- 🖼️ Upload multiple images at once
- 📤 Automatic upload to Telegram
- ⚛️ Modern React frontend with routing
- 🎨 Beautiful UI with Bootstrap
- 🔒 File type validation (JPG, JPEG, PNG only)
- 🚀 Production-ready with build scripts

## Tech Stack

**Frontend:**
- React 18
- React Router DOM
- Axios
- Bootstrap 5

**Backend:**
- Node.js
- Express
- Multer (file uploads)
- node-telegram-bot-api
- CORS

## Prerequisites

- Node.js (v20.10.0 or higher)
- A Telegram Bot Token
- A Telegram Chat ID

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd Image_Uploader
```

### 2. Install dependencies

```bash
npm run install-all
```

This will install dependencies for both the server and the client.

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
PORT=5000
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=your_telegram_chat_id_here
NODE_ENV=development
```

### 4. Getting Telegram Credentials

**Bot Token:**
1. Open Telegram and search for @BotFather
2. Send `/newbot` and follow the instructions
3. Copy the token provided

**Chat ID:**
1. Start a chat with your bot
2. Send a message to the bot
3. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Look for the `chat.id` in the response

## Running the Application

### Development Mode

Run both client and server concurrently:

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Production Mode

1. Build the React app:

```bash
npm run build
```

2. Start the server:

```bash
npm start
```

The server will serve the built React app on the configured PORT.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Run the production server |
| `npm run server` | Run the backend server with nodemon |
| `npm run client` | Run the React development server |
| `npm run dev` | Run both client and server concurrently |
| `npm run install-all` | Install all dependencies (root and client) |
| `npm run build` | Build the React app for production |

## Project Structure

```
Image_Uploader/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Upload.js
│   │   │   ├── Upload.css
│   │   │   ├── ThankYou.js
│   │   │   └── ThankYou.css
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── uploads/               # Temporary upload directory (auto-created)
├── server.js              # Express server
├── package.json           # Server dependencies
├── .env                   # Environment variables (not in git)
├── .gitignore
└── README.md
```

## API Endpoints

### POST `/api/upload`

Upload images to Telegram.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: Form data with `files` field (array of images)

**Response:**
```json
{
  "success": true,
  "message": "Files uploaded successfully"
}
```

## Features Explained

### Frontend
- **Upload Component**: Handles file selection and upload with validation
- **ThankYou Component**: Shows success message with animated checkmark
- **React Router**: Provides seamless navigation between pages

### Backend
- **Express API**: RESTful API endpoint for file uploads
- **Multer**: Handles multipart/form-data file uploads
- **Telegram Integration**: Automatically sends uploaded files to Telegram
- **File Cleanup**: Removes temporary files after upload

## Deployment

### Heroku

1. Create a new Heroku app
2. Add environment variables in Heroku dashboard
3. Deploy:

```bash
git push heroku main
```

### Other Platforms

Make sure to:
1. Set `NODE_ENV=production`
2. Configure all environment variables
3. Run `npm run build` before deployment
4. The app will serve the built React app from the Express server

## Troubleshooting

**Issue: Files not uploading**
- Check your Telegram credentials in `.env`
- Verify the bot has permission to send messages to the chat

**Issue: CORS errors**
- Ensure the backend server is running
- Check that the proxy is configured in `client/package.json`

**Issue: Port already in use**
- Change the PORT in `.env` file
- Kill the process using the port: `lsof -ti:5000 | xargs kill -9`

## License

MIT

## Author

asmith0713
