@echo off
setlocal

set "projectPath=%~dp0"

cd /d "%projectPath%"

echo Executando npm install e npm run dev...

cmd /k "npm install && start http://localhost:5173/ && npm run dev && exit"


echo Pressione Ctrl+C para encerrar.
pause