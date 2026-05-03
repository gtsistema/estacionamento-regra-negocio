@echo off
cd /d "C:\Users\Jorge\Downloads\MAPA MENTAL"
start cmd /k "npm run dev"
timeout /t 2 /nobreak > nul
start http://localhost:3000/
exit