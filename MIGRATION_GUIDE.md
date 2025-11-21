# 📦 TeleBox - Migration to MERN Stack

## What Changed?

Your app has been successfully converted from a traditional Node.js + EJS app to **TeleBox** - a modern MERN stack application for Telegram storage!

### Major Changes:

1. **Frontend**: Now uses React instead of EJS templates
2. **Backend**: Converted to a REST API with CORS support
3. **Database**: Removed MongoDB dependency (not needed for Telegram uploads)
4. **Structure**: Separated client and server code
5. **Development**: Added concurrent development mode

## Getting Started

### Option 1: Using the setup script (Recommended)

```bash
./setup.sh
```

### Option 2: Manual setup

```bash
# Install all dependencies
npm run install-all

# Copy environment variables
cp .env.example .env

# Edit .env with your credentials
nano .env  # or use your preferred editor
```

## Running the App

### Development Mode (Recommended during development)

```bash
npm run dev
```

This starts:
- React frontend on http://localhost:3000
- Express backend on http://localhost:5000

### Production Mode

```bash
# Build the React app
npm run build

# Start the server
npm start
```

## Environment Variables

Make sure to set these in your `.env` file:

```env
PORT=5000
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
NODE_ENV=development
```

## New Features

✅ Modern React UI with routing
✅ File validation on both client and server
✅ Better error handling
✅ Animated success page
✅ Production-ready build system
✅ Concurrent development mode
✅ No database required

## Deployment

### Heroku

The Procfile is already configured. Just:

1. Set environment variables in Heroku dashboard
2. Push to Heroku
3. Heroku will automatically build the React app and start the server

### Other Platforms

1. Build the React app: `npm run build`
2. Set `NODE_ENV=production`
3. Start the server: `npm start`

## File Structure

```
Image_Uploader/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server.js           # Express API
├── package.json        # Server dependencies
└── .env               # Configuration
```

## Troubleshooting

**Can't connect to backend?**
- Make sure both servers are running (`npm run dev`)
- Check the proxy setting in `client/package.json`

**Telegram not receiving files?**
- Verify your `.env` credentials
- Test your bot token with @BotFather
- Make sure the bot has permission to send to the chat

Need help? Check the main README.md for detailed documentation.
