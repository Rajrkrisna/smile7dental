@echo off
title Install Smile7 Dental Clinic Desktop Shortcut
cd /d "%~dp0"

echo Creating Desktop shortcut for Smile7 Dental Clinic...
cscript //nologo Create-Desktop-Shortcut.vbs

echo.
echo Done! You can now launch Smile7 Dental Clinic directly from your Windows Desktop.
pause
