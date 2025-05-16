@echo off
echo ===================================================
echo    Seeding Database with Test Accounts
echo ===================================================
echo.

echo Starting MongoDB...
start /b mongod

echo Running database seeder...
cd enrollment-backend
npm run seed

echo.
echo ===================================================
echo    Database Seeded Successfully
echo ===================================================
echo.
echo Test Accounts Created:
echo - Student: student@uphc.edu.ph / student123
echo - Teacher: teacher@uphc.edu.ph / teacher123
echo - Admin: admin@uphc.edu.ph / admin123
echo - Global Admin: global-admin@uphc.edu.ph / admin123
echo.
echo Press any key to exit...
pause > nul
