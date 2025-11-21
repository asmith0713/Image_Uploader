# 📦 TeleBox - Quick Reference

## Installation
```bash
npm run install-all
```

## Configuration
Edit `.env` file with your Telegram credentials:
- `TELEGRAM_BOT_TOKEN` - Get from @BotFather
- `TELEGRAM_CHAT_ID` - From bot getUpdates

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development (client + server) |
| `npm run server` | Start backend only |
| `npm run client` | Start frontend only |
| `npm start` | Start production server |
| `npm run build` | Build React app |
| `./setup.sh` | Automated setup |

## URLs
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API: http://localhost:5000/api/upload

## Tech Stack
- **Frontend**: React 18, React Router, Axios, Bootstrap 5
- **Backend**: Express, Multer, node-telegram-bot-api, CORS
- **No Database**: Files sent directly to Telegram

## Project Structure
```
Image_Uploader/
├── client/              (React app)
│   ├── src/
│   │   ├── components/  (Upload, ThankYou)
│   │   └── App.js
│   └── package.json
├── server.js            (Express API)
├── package.json         (Root dependencies)
└── .env                 (Configuration)
```

## Key Features
✅ Multi-file upload
✅ File type validation (JPG, JPEG, PNG)
✅ Automatic Telegram integration
✅ Modern React UI
✅ Production-ready
✅ No database required

## Common Issues

**Port in use?**
```bash
lsof -ti:5000 | xargs kill -9
```

**Dependencies issues?**
```bash
rm -rf node_modules client/node_modules
npm run install-all
```

**Environment variables?**
```bash
cp .env.example .env
```
Then edit `.env` with your credentials.

---
📚 For detailed docs, see README.md
🔄 For migration info, see MIGRATION_GUIDE.md
