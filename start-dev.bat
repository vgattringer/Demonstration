@echo off

:: Backend starten — in einem neuen Fenster, damit beide parallel laufen
start "Backend" cmd /k "cd /d "%~dp0backend" && dotnet run --project DemonstrationApp.Api"

:: Frontend starten — ebenfalls in einem neuen Fenster
start "Frontend" cmd /k "cd /d "%~dp0frontend\demonstration-app" && npm run dev"
