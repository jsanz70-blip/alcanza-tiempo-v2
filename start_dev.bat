@echo off
set NODE_ENV=development
cd /d C:\Users\jsanz\Desktop\alcanza-limpiar
echo Current directory: %CD%
echo Starting vite...
call node_modules\.bin\vite.cmd --host :: --port 3000
echo Server exited with code %ERRORLEVEL%
pause
