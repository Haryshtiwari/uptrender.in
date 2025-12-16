module.exports = {
  apps: [
    {
      name: 'uptrender-frontend',
      script: 'npx',
      args: 'serve -s dist -l 4000',
      cwd: '/var/www/uptrender.in',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'uptrender-backend',
      script: 'server.js',
      cwd: '/var/www/uptrender.in/backend',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: '4001',
        DB_HOST: 'localhost',
        DB_PORT: '3306',
        DB_NAME: 'algo_trading_db',
        DB_USER: 'Quants',
        DB_PASSWORD: 'Quants@4897',
        JWT_SECRET: 'your_super_secret_jwt_key_here_production_change_this',
        JWT_EXPIRES_IN: '24h'
      }
    }
  ]
};