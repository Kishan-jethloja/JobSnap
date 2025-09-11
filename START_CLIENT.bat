@echo off
echo Starting JobSnap Client...
echo.

REM Create client .env file if it doesn't exist
if not exist "client\.env" (
    echo Creating client .env file...
    echo REACT_APP_API_URL=http://localhost:5000/api > "client\.env"
    echo Client .env file created
    echo.
)

REM Install client dependencies
echo Installing client dependencies...
cd client
call npm install
if errorlevel 1 (
    echo Failed to install client dependencies
    pause
    exit /b 1
)

REM Start the client
echo.
echo Starting React development server...
echo Client will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the client
echo.
call npm start

pause
