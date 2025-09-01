@echo off
echo ============================================
echo  Starting Smart City Backend Server
echo ============================================
echo.

cd backend

echo Starting backend server on http://localhost:5000
echo Press Ctrl+C to stop the server
echo.

call npm run dev
