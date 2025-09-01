@echo off
echo ============================================
echo  Smart City Communication Hub - Launcher
echo ============================================
echo.
echo Starting both backend and frontend servers...
echo.

REM Start backend in a new window
echo Starting backend server...
start "Smart City Backend" /D "%~dp0" start-backend.bat

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend in a new window
echo Starting frontend dashboard...
start "Smart City Frontend" /D "%~dp0" start-frontend.bat

echo.
echo Both servers are starting in separate windows.
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Close this window or press any key to continue...
pause >nul
