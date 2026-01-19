@echo off
REM Max Loyalty - Quick Start для Windows
REM Запустите: quick-start.bat

cls
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║        🚀 MAX LOYALTY - QUICK START (Windows)               ║
echo ║  Этот файл автоматически подготовит всё к запуску!         ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM Проверка Node.js
echo 🔍 Проверяю Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js не установлен!
    echo    Установите с: https://nodejs.org (выберите LTS версию)
    echo.
    pause
    exit /b 1
)
echo ✅ Node.js найден!
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo    Версия: %NODE_VERSION%
echo.

REM Проверка npm
echo 🔍 Проверяю npm...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm не найден!
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm найден! Версия: %NPM_VERSION%
echo.

REM Проверка папки src
echo 🔍 Проверяю структуру проекта...
if not exist "src" (
    echo ❌ Папка src не найдена!
    echo    Убедитесь что вы в папке max-loyalty
    pause
    exit /b 1
)
echo ✅ Проект в порядке!
echo.

REM Установка зависимостей
echo 📦 Устанавливаю зависимости...
echo    (это может занять 2-5 минут в зависимости от интернета)
echo.
call npm install

if %errorlevel% neq 0 (
    echo.
    echo ❌ Ошибка при установке зависимостей!
    echo    Попробуйте: npm install --legacy-peer-deps
    echo.
    pause
    exit /b 1
)
echo.
echo ✅ Зависимости установлены успешно!
echo.

cls
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║           ✅ ВСЁ ГОТОВО К ЗАПУСКУ!                          ║
echo ╠══════════════════════════════════════════════════════════════╣
echo ║                                                              ║
echo ║  Что дальше:                                                 ║
echo ║                                                              ║
echo ║  1️⃣  Откройте Command Prompt в этой папке                  ║
echo ║                                                              ║
echo ║  2️⃣  Напишите команду:                                      ║
echo ║      npm run dev                                             ║
echo ║                                                              ║
echo ║  3️⃣  Откройте браузер:                                      ║
echo ║      http://localhost:5173/admin/dashboard                  ║
echo ║                                                              ║
echo ║  Другие команды:                                             ║
echo ║  ├─ npm run test           - Запустить тесты                ║
echo ║  ├─ npm run build          - Сборка для продакшена          ║
echo ║  └─ npm run cypress:open   - Открыть E2E тесты             ║
echo ║                                                              ║
echo ║  Документация:                                               ║
echo ║  • BEGINNER_GUIDE.md - Полный гайд для новичков             ║
echo ║  • README.md - Быстрый старт                                ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
pause
