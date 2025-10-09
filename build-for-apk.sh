#!/bin/bash

# Islamic Companion - APK Build Script
# এই script চালিয়ে production build তৈরি করুন

echo "🚀 Islamic Companion - Building for APK..."
echo ""

# Set production API URL
echo "📝 Setting production API URL..."
echo "VITE_API_URL=https://islamicguide-qqag.onrender.com" > client/.env

# Build the app
echo "🔨 Building production version..."
npm run build

# Check if build was successful
if [ -d "dist/public" ]; then
  echo ""
  echo "✅ Build successful!"
  echo ""
  echo "📦 Build output location: dist/public"
  echo ""
  echo "🎯 Next steps for APK:"
  echo "  1. Deploy dist/public folder to a hosting service"
  echo "  2. Go to https://www.pwabuilder.com/"
  echo "  3. Enter your deployed URL"
  echo "  4. Generate Android APK"
  echo ""
  echo "📖 Full guide: See BUILD_APK_GUIDE.md"
  echo ""
  
  # Show build size
  du -sh dist/public
else
  echo ""
  echo "❌ Build failed! Check errors above."
  exit 1
fi
