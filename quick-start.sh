#!/bin/bash
# Max Loyalty - Quick Start Script
# Запустите: bash quick-start.sh (Mac/Linux) или quick-start.bat (Windows)

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║        🚀 MAX LOYALTY - QUICK START                         ║"
echo "║  Этот скрипт автоматически подготовит всё к запуску!       ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Проверка Node.js
echo "🔍 Проверяю Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен!"
    echo "   Установите с: https://nodejs.org (выберите LTS)"
    exit 1
fi
echo "✅ Node.js версия: $(node --version)"
echo ""

# Проверка npm
echo "🔍 Проверяю npm..."
echo "✅ npm версия: $(npm --version)"
echo ""

# Установка зависимостей
echo "📦 Устанавливаю зависимости (это может занять 2-5 минут)..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Ошибка при установке зависимостей"
    echo "   Попробуйте: npm install --legacy-peer-deps"
    exit 1
fi
echo "✅ Зависимости установлены!"
echo ""

# Проверка структуры
echo "🔍 Проверяю структуру проекта..."
if [ ! -d "src" ]; then
    echo "❌ Папка src не найдена!"
    exit 1
fi
echo "✅ Проект в порядке!"
echo ""

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           ✅ ВСЁ ГОТОВО К ЗАПУСКУ!                          ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║                                                              ║"
echo "║  Команды для запуска:                                        ║"
echo "║                                                              ║"
echo "║  npm run dev              - Запустить приложение            ║"
echo "║  npm run test             - Запустить тесты                 ║"
echo "║  npm run build            - Сборка для продакшена           ║"
echo "║  npm run cypress:open     - Открыть E2E тесты              ║"
echo "║                                                              ║"
echo "║  Откройте браузер:                                           ║"
echo "║  http://localhost:5173/admin/dashboard                       ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
