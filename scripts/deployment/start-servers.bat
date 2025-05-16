@echo off
cd /D "%~dp0..\\.."
echo ===================================================
echo    Starting Perpetual Help Enrollment System
echo ===================================================
echo.

echo [1/3] Starting MongoDB Database...
if not exist ".\\data\\db" (
    echo Creating MongoDB data directory: .\\data\\db
    mkdir ".\\data\\db"
)
start cmd /k "echo MongoDB Server && "C:\\Program Files\\MongoDB\\Server\\8.0\\bin\\mongod.exe" --dbpath ".\\data\\db" || echo MongoDB failed to start - please make sure it's installed and data directory is accessible."

echo [2/3] Starting Backend Server...
start cmd /k "cd enrollment-backend && echo Backend Server && npm start"

echo [3/3] Starting Frontend Server...
start cmd /k "cd enrollment-frontend && echo Frontend Server && npm run dev"

echo.
echo ===================================================
echo    All servers are starting...
echo ===================================================
echo.
echo Backend API: http://localhost:5000
echo Frontend: http://localhost:3000
echo Table of Contents: http://localhost:3000/table-of-contents
echo.
echo Test Accounts:
echo - Student: m23-1470-578@manila.uphsl.edu.ph / Test@123
echo - Teacher: teacher@manila.uphsl.edu.ph / Test@123
echo - Admin: admin@manila.uphsl.edu.ph / Test@123
echo - Global Admin: global-admin@manila.uphsl.edu.ph / Test@123
echo.
echo Press any key to open the Table of Contents in your browser...
pause > nul

start http://localhost:3000/table-of-contents
