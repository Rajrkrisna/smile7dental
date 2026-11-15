@echo off
title Smile7 Dental Clinic Launcher
cd /d "%~dp0"

if exist "%~dp0Smile7-Dental-Clinic.exe" (
    copy /y "%~dp0Smile7-Dental-Clinic.exe" "%~dp0Smile7Dental.exe" >nul 2>&1
)

if not exist "%~dp0Smile7Dental.exe" (
    echo Building Smile7Dental.exe executable...
    call npm run build:exe
)

start "" "%~dp0Smile7Dental.exe"
exit
