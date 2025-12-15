#!/bin/bash

# Development/Production Helper Script for Algo Trading Platform
# Usage: ./dev.sh [command]

case "$1" in
  start)
    echo "🚀 Starting servers..."
    cd /var/www/algo
    pm2 start ecosystem.config.cjs
    pm2 save
    echo "✅ Servers started!"
    echo "Frontend: http://localhost:4000"
    echo "Backend: http://localhost:4001"
    echo "Public: https://app.uptrender.in"
    ;;
    
  stop)
    echo "🛑 Stopping servers..."
    pm2 stop uptrender-frontend uptrender-backend
    echo "✅ Servers stopped!"
    ;;
    
  restart)
    echo "🔄 Restarting servers..."
    pm2 restart uptrender-frontend uptrender-backend
    echo "✅ Servers restarted!"
    ;;
    
  deploy)
    echo "🚀 Deploying to production..."
    cd /var/www/algo
    echo "📦 Installing dependencies..."
    npm install
    echo "🏗️  Building frontend..."
    npm run build
    echo "🔄 Restarting services..."
    pm2 restart uptrender-frontend uptrender-backend
    pm2 save
    echo "✅ Production deployment complete!"
    echo "🌐 Live at: https://app.uptrender.in"
    ;;
    
  logs)
    echo "📋 Showing logs (Ctrl+C to exit)..."
    pm2 logs uptrender-frontend uptrender-backend
    ;;
    
  logs-frontend)
    echo "📋 Frontend logs (Ctrl+C to exit)..."
    pm2 logs uptrender-frontend
    ;;
    
  logs-backend)
    echo "📋 Backend logs (Ctrl+C to exit)..."
    pm2 logs uptrender-backend
    ;;
    
  status)
    echo "📊 Server status..."
    pm2 status | grep uptrender
    ;;
    
  monitor)
    echo "📈 Opening PM2 monitor (Ctrl+C to exit)..."
    pm2 monit
    ;;
    
  build)
    echo "🏗️  Building frontend for production..."
    cd /var/www/algo
    npm run build
    echo "✅ Build complete! Files in dist/"
    ;;
    
  clean)
    echo "🧹 Cleaning build files and node_modules..."
    read -p "Are you sure? This will delete node_modules and dist/ (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      cd /var/www/algo
      rm -rf node_modules dist
      cd /var/www/algo/backend
      rm -rf node_modules
      echo "✅ Cleaned!"
      echo "Run 'npm install' in both directories to reinstall dependencies"
    fi
    ;;
    
  install)
    echo "📦 Installing dependencies..."
    cd /var/www/algo
    npm install
    cd /var/www/algo/backend
    npm install
    echo "✅ Dependencies installed!"
    ;;
    
  db-migrate)
    echo "🗄️  Running database migrations..."
    cd /var/www/algo/database
    mysql -u root -p'Root@12345' algo_trading_db < copy_trading_migration.sql
    echo "✅ Migration complete!"
    ;;
    
  db-seed)
    echo "🌱 Seeding database..."
    cd /var/www/algo/backend
    npm run seed
    echo "✅ Database seeded!"
    ;;
    
  reset)
    echo "🔄 Complete reset and restart..."
    pm2 delete uptrender-frontend uptrender-backend 2>/dev/null || true
    pm2 start /var/www/algo/ecosystem.config.cjs
    pm2 save
    echo "✅ Complete reset done!"
    ;;
    
  nginx-reload)
    echo "🔧 Reloading Nginx..."
    nginx -t && systemctl reload nginx
    echo "✅ Nginx reloaded!"
    ;;
    
  ports)
    echo "🔌 Checking ports..."
    netstat -tlnp | grep -E "(4000|4001)" | grep LISTEN
    ;;
    
  test)
    echo "🧪 Testing deployment..."
    echo ""
    echo "Backend API:"
    curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:4001/api/
    echo ""
    echo "Frontend:"
    curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:4000/
    echo ""
    echo "Public URL:"
    curl -s -o /dev/null -w "Status: %{http_code}\n" https://app.uptrender.in/
    echo ""
    ;;
    
  help|*)
    echo "Algo Trading Platform - Management Helper"
    echo ""
    echo "Usage: ./dev.sh [command]"
    echo ""
    echo "Commands:"
    echo "  start           - Start servers (production mode)"
    echo "  stop            - Stop servers"
    echo "  restart         - Restart servers"
    echo "  deploy          - Full production deployment (install, build, restart)"
    echo "  logs            - Show logs for both servers"
    echo "  logs-frontend   - Show frontend logs only"
    echo "  logs-backend    - Show backend logs only"
    echo "  status          - Show server status"
    echo "  monitor         - Open PM2 monitor"
    echo "  build           - Build frontend for production"
    echo "  clean           - Clean build files and node_modules"
    echo "  install         - Install dependencies"
    echo "  db-migrate      - Run database migrations"
    echo "  db-seed         - Seed database"
    echo "  reset           - Complete reset and restart"
    echo "  nginx-reload    - Reload Nginx configuration"
    echo "  ports           - Check if ports are in use"
    echo "  test            - Test if all services are responding"
    echo "  help            - Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./dev.sh deploy        # Deploy to production"
    echo "  ./dev.sh logs          # View logs"
    echo "  ./dev.sh restart       # Restart services"
    echo "  ./dev.sh test          # Test deployment"
    ;;
esac
