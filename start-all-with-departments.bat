@echo off
echo Starting Smart City Communication Hub with Mock Departments...
echo.

echo Starting Mock Department Servers on port 4000...
start "Mock Departments" cmd /c "cd mock-departments && npm start"

timeout /t 3

echo Starting Backend Server on port 5000...
start "Backend" cmd /c "cd backend && npm start"

timeout /t 3

echo Starting Frontend React App on port 3000...
start "Frontend" cmd /c "cd frontend && npm start"

echo.
echo All services starting...
echo.
echo Access points:
echo - Main Dashboard: http://localhost:3000
echo - Department Portals: http://localhost:4000
echo - Backend API: http://localhost:5000
echo.
echo Press any key to continue...
pause
