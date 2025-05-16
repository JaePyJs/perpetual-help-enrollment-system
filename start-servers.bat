@echo off
echo ===================================================
echo    Starting Perpetual Help Enrollment System
echo ===================================================
echo.

echo [1/3] Starting MongoDB Database...
start cmd /k "echo MongoDB Server && mongod || echo MongoDB failed to start - please make sure it's installed"

echo [2/3] Starting Backend Server...
start cmd /k "cd enrollment-backend && echo Backend Server && npm start"

echo [3/3] Starting Frontend Server...
start cmd /k "cd \"enrollment-system (1)\" && echo Frontend Server && npm run dev"

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
echo - Student: student@uphc.edu.ph / student123
echo - Teacher: teacher@uphc.edu.ph / teacher123
echo - Admin: admin@uphc.edu.ph / admin123
echo - Global Admin: global-admin@uphc.edu.ph / admin123
echo.
echo Press any key to open the Table of Contents in your browser...
pause > nul

start http://localhost:3000/table-of-contents
