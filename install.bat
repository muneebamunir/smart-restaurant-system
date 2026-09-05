@echo off
REM Set script to stop if a critical error occurs (optional)
setlocal enabledelayedexpansion

echo Installing Backend...
pushd .\server\ || exit /b 1
CALL npm install || exit /b 1
popd

echo Installing Frontend...
pushd .\client\ || exit /b 1
CALL npm install || exit /b 1
popd

echo All Dependencies installed! Client and Backend are ready.
