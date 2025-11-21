#!/bin/bash

echo "🚀 Setting up Image Uploader MERN App..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js v20.10.0 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "📝 Please edit .env file with your Telegram credentials before running the app."
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "📦 Installing client dependencies..."
cd client && npm install && cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Edit .env file with your Telegram Bot Token and Chat ID"
echo "   2. Run 'npm run dev' to start the development server"
echo "   3. Visit http://localhost:3000 in your browser"
echo ""
echo "💡 Useful commands:"
echo "   - npm run dev        : Run both client and server"
echo "   - npm run server     : Run only the backend"
echo "   - npm run client     : Run only the frontend"
echo "   - npm run build      : Build for production"
echo ""
