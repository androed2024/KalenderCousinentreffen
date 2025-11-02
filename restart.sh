#!/bin/bash
# Kill any process on port 5173
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

# Clear all caches
rm -rf node_modules/.vite
rm -rf dist
rm -rf .vite

# Start dev server with force flag
npm run dev -- --force

