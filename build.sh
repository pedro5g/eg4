#!/bin/bash
set -e

echo "🛠️  Creating build directories..."
mkdir -p build/server
mkdir -p build/ui

echo "📦 Building TypeScript server..."
cd /server
npx tsc -p --outDir ../build/server
cp .env ../build/server
cp package.json  ../build/server
cd ../

echo "🖼️  Building UI with Vite..."
cd ui/dashboard
npx vite build --outDir ../../../build/ui
cp .env.local ../../../build/ui
cp package.json ../../../build/ui

cd ../../..

echo "✅ Build completed: output in build/server and build/ui"
