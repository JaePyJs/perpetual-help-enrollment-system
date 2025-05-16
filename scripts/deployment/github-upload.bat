@echo off
echo ===================================================
echo Perpetual Help Enrollment System - GitHub Uploader
echo ===================================================
echo.

REM Check if Git is installed
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Git is not installed or not in your PATH.
    echo Please install Git from https://git-scm.com/downloads
    echo.
    pause
    exit /b 1
)

echo Checking Git configuration...
git config --get user.name >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Git username not configured.
    set /p GIT_USERNAME="Enter your name for Git: "
    git config --global user.name "%GIT_USERNAME%"
)

git config --get user.email >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Git email not configured.
    set /p GIT_EMAIL="Enter your email for Git: "
    git config --global user.email "%GIT_EMAIL%"
)

echo.
echo Git configuration complete.
echo.

REM Check if this is a Git repository
if not exist .git (
    echo Initializing Git repository...
    git init
    echo.
)

REM Check if remote origin exists
git remote get-url origin >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Adding remote repository...
    git remote add origin https://github.com/JaePyJs/perpetual-help-enrollment-system.git
    echo.
)

echo Checking for changes...
git status

echo.
set /p CONTINUE="Do you want to continue with the upload? (Y/N): "
if /i "%CONTINUE%" NEQ "Y" (
    echo Upload canceled.
    pause
    exit /b 0
)

echo.
echo Adding files to staging...
git add .

echo.
set /p COMMIT_MSG="Enter a commit message (e.g., 'Updated enrollment system'): "
if "%COMMIT_MSG%"=="" set COMMIT_MSG="Updated Perpetual Help Enrollment System"

echo.
echo Committing changes...
git commit -m "%COMMIT_MSG%"

echo.
echo Pushing to GitHub...
git push -u origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo There was an error pushing to GitHub.
    echo You might need to:
    echo 1. Check your internet connection
    echo 2. Verify your GitHub credentials
    echo 3. Make sure you have write access to the repository
    echo.
    echo Try running: git push -u origin main
    echo.
) else (
    echo.
    echo ===================================================
    echo Success! Your changes have been uploaded to GitHub.
    echo Repository: https://github.com/JaePyJs/perpetual-help-enrollment-system
    echo ===================================================
)

pause
