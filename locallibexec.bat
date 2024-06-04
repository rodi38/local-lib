@echo off
setlocal


set "projectPath=%~dp0"

cd /d "%projectPath%"

if exist "node_modules" (
    echo 'npm install' já foi executado anteriormente. Pulando para npm run dev...
    echo Executando npm run dev...
    start cmd /k "npm run dev"

    echo Abrindo navegador em http://localhost:5173
    start http://localhost:5173
) else (
    echo Executando npm install...
    start cmd /k "npm install && start http://localhost:5173 && npm run dev "
)

exit