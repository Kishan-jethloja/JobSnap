@echo off
echo Starting JobSnap Server...
echo.

REM Create .env file if it doesn't exist
if not exist "server\.env" (
    echo Creating server .env file...
    copy "server\.env.example" "server\.env"
    echo .env file created from .env.example
    echo.
)

REM Create client .env file if it doesn't exist
if not exist "client\.env" (
    echo Creating client .env file...
    echo REACT_APP_API_URL=http://localhost:5000/api > "client\.env"
    echo Client .env file created
    echo.
)

REM Install server dependencies
echo Installing server dependencies...
cd server
call npm install
if errorlevel 1 (
    echo Failed to install server dependencies
    pause
    exit /b 1
)

REM Start the server
echo.
echo Starting server on port 5000...
echo Server will be available at: http://localhost:5000
echo API endpoints will be at: http://localhost:5000/api
echo.
echo Press Ctrl+C to stop the server
echo.
call npm start

pause
