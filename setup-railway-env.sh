#!/usr/bin/env bash

# RAILWAY ENVIRONMENT VARIABLES SETUP
# Run this in your Railway dashboard or use Railway CLI

echo "🚂 Setting up Railway Environment Variables..."
echo ""
echo "Go to your Railway dashboard:"
echo "https://railway.app/project/[your-project-id]/settings"
echo ""
echo "Add these environment variables:"
echo ""
echo "ADMIN_EMAIL=admin@alankree.com"
echo "ADMIN_PASSWORD_HASH=\$2b\$12\$FMu3EgqLiSvpkWvNV8ZeMO7bWV8OgqnI/gnkez7PrSul2tDuzDTDW"
echo ""
echo "Optional - For image uploads (Cloudinary):"
echo "CLOUDINARY_CLOUD_NAME=[your_cloudinary_name]"
echo "CLOUDINARY_API_KEY=[your_api_key]"
echo "CLOUDINARY_API_SECRET=[your_api_secret]"
echo ""
echo "After adding these, redeploy your Railway service."
