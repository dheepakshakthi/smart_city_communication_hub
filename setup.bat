@echo off
echo ============================================
echo  Smart City Communication Hub - Setup
echo ============================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version

echo.
echo Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo Installing frontend dependencies...
cd ..\frontend
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo Creating environment files...
cd ..

REM Create backend .env file if it doesn't exist
if not exist "backend\.env" (
    echo Creating backend .env file...
    copy "backend\.env" "backend\.env.backup" >nul 2>&1
)

REM Create frontend .env file if it doesn't exist
if not exist "frontend\.env" (
    echo Creating frontend .env file...
    echo REACT_APP_BACKEND_URL=http://localhost:5000 > frontend\.env
)

echo.
echo ============================================
echo  Setup completed successfully!
echo ============================================
echo.
echo To start the application:
echo 1. Run "start-backend.bat" in one terminal
echo 2. Run "start-frontend.bat" in another terminal
echo.
echo Or simply run "start-all.bat" to start both
echo.
pause
