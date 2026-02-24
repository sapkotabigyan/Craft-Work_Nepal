#!/bin/bash
# Quick Start Script for KalaBazzer
# This script can be run to help set up the environment

echo "🎨 Welcome to KalaBazzer Quick Start!"
echo "========================================"
echo ""
echo "This guide will help you get the application running."
echo ""
echo "Prerequisites installed?"
echo "✓ Node.js (v14+)"
echo "✓ PostgreSQL"
echo "✓ pgAdmin 4"
echo ""
echo "========================================"
echo ""

echo "Step 1: Ensure PostgreSQL is Running"
echo "------------------------------------"
echo "Please make sure PostgreSQL is running on your system."
echo "Windows: Services → PostgreSQL → Running"
echo "Mac: brew services list (check postgres)"
echo "Linux: systemctl status postgresql"
echo ""
echo "Press Enter to continue..."
read

echo "Step 2: Create Database (if not already created)"
echo "------------------------------------"
echo "Open pgAdmin (http://localhost:5050)"
echo "1. Right-click Databases → Create → Database"
echo "2. Name: kala_bazzer"
echo "3. Click Save"
echo "4. Close pgAdmin"
echo ""
echo "Press Enter when done..."
read

echo "Step 3: Starting Services"
echo "------------------------------------"
echo ""
echo "We'll now open three terminals for Backend, Admin, and Client."
echo "If automatic terminal opening doesn't work, open them manually:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd Backend"
echo "  npm install"
echo "  npm start"
echo ""
echo "Terminal 2 (Admin Panel):"
echo "  cd Admin"
echo "  npm install"
echo "  npm run dev"
echo ""
echo "Terminal 3 (Client):"
echo "  cd Client"
echo "  npm install"
echo "  npm run dev"
echo ""
echo "========================================"
echo ""

# Try to open terminals (platform-specific)
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    echo "Opening terminals for Windows..."
    start cmd /k "cd Backend && npm install && npm start"
    start cmd /k "cd Admin && npm install && npm run dev"
    start cmd /k "cd Client && npm install && npm run dev"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # Mac
    echo "Opening terminals for Mac..."
    open -a Terminal
    tell application "Terminal"
        do script "cd ${PWD}/Backend && npm install && npm start"
        do script "cd ${PWD}/Admin && npm install && npm run dev"
        do script "cd ${PWD}/Client && npm install && npm run dev"
    end tell
else
    # Linux - try multiple methods
    echo "Opening terminals for Linux..."
    gnome-terminal --working-directory="${PWD}/Backend" -- bash -c "npm install && npm start" &
    gnome-terminal --working-directory="${PWD}/Admin" -- bash -c "npm install && npm run dev" &
    gnome-terminal --working-directory="${PWD}/Client" -- bash -c "npm install && npm run dev" &
fi

echo ""
echo "========================================"
echo "✨ Services Starting!"
echo "========================================"
echo ""
echo "Wait about 30 seconds for all services to start, then open:"
echo ""
echo "🏪 Client App:    http://localhost:3000"
echo "👨‍💼 Admin Panel:    http://localhost:5173"
echo "⚙️  Backend API:   http://localhost:4000"
echo ""
echo "========================================"
echo ""
