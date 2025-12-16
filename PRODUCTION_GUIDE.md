# Uptrender Production Deployment Guide

## ✅ Deployment Status: LIVE

### Production URLs
- **Frontend**: https://dev.uptrender.in
- **Backend API**: https://dev.uptrender.in/api
- **WebSocket**: https://dev.uptrender.in/socket.io

---

## 🚀 Quick Commands

### Check Status
```bash
pm2 status                    # Check all processes
pm2 logs                      # View live logs
pm2 monit                     # Monitor processes
```

### Restart Services
```bash
pm2 restart all               # Restart all services
pm2 restart uptrender-backend # Restart backend only
pm2 restart uptrender-frontend # Restart frontend only
```

### Stop/Start Services
```bash
pm2 stop all                  # Stop all
pm2 start all                 # Start all
pm2 delete all                # Remove all from PM2
```

### Deploy New Version
```bash
cd /var/www/uptrender.in
npm install                   # Install dependencies
npm run build                 # Build frontend
pm2 restart all               # Restart services
pm2 save                      # Save PM2 config
```

---

## 📁 Project Structure

```
/var/www/uptrender.in/
├── dist/                     # Production build (auto-generated)
├── backend/                  # Backend API
│   └── server.js            # Main server file
├── ecosystem.config.cjs     # PM2 configuration
├── package.json             # Frontend dependencies
└── nginx config: /etc/nginx/conf.d/dev.uptrender.in.conf
```

---

## 🔧 Configuration

### PM2 Process Manager
- **Frontend**: Running on port 4000 (served by 'serve')
- **Backend**: Running on port 4001 (Node.js)
- **Auto-restart**: Enabled
- **Max Memory**: 1GB per process

### Nginx Reverse Proxy
- **Frontend**: https://dev.uptrender.in → localhost:4000
- **API**: https://dev.uptrender.in/api → localhost:4001
- **WebSocket**: https://dev.uptrender.in/socket.io → localhost:4001

### Environment Variables
Located in `ecosystem.config.cjs`:
- NODE_ENV=production
- PORT=4001
- Database credentials configured
- JWT settings configured

---

## 🔍 Troubleshooting

### Check if services are running
```bash
pm2 status
netstat -tlnp | grep -E "(4000|4001)"
```

### View logs
```bash
pm2 logs                       # All logs
pm2 logs uptrender-backend     # Backend only
pm2 logs uptrender-frontend    # Frontend only
```

### Check nginx status
```bash
systemctl status nginx
nginx -t                       # Test config
systemctl reload nginx         # Reload config
```

### Rebuild and redeploy
```bash
cd /var/www/uptrender.in
npm run build
pm2 restart all
```

---

## 📊 Server Resources

### Current Setup
- **Frontend Process**: ~80-100MB RAM
- **Backend Process**: ~100-150MB RAM
- **Auto-restart**: On crash or high memory usage
- **Persistent**: Survives server reboots

### PM2 Startup
PM2 is configured to auto-start on system boot:
```bash
pm2 startup              # Already configured
pm2 save                 # Save current process list
```

---

## 🔐 Security Notes

1. ✅ HTTPS enabled with SSL certificate
2. ✅ Database credentials in environment variables
3. ✅ JWT secret configured
4. ✅ Production mode enabled
5. ⚠️  Remember to change JWT_SECRET in ecosystem.config.cjs

---

## 📝 Maintenance Tasks

### Update Application
```bash
cd /var/www/uptrender.in
git pull origin main         # If using git
npm install                  # Update dependencies
npm run build                # Build new version
pm2 restart all              # Deploy
```

### Database Backup
```bash
mysqldump -u Quants -p'Quants@4897' algo_trading_db > backup_$(date +%Y%m%d).sql
```

### Check Disk Space
```bash
df -h                        # Check disk usage
du -sh /var/www/uptrender.in # Check project size
```

---

## 🎯 Production Checklist

- [x] Frontend built and optimized
- [x] Backend running in production mode
- [x] PM2 configured with auto-restart
- [x] PM2 startup on system boot enabled
- [x] Nginx configured and tested
- [x] SSL certificate active
- [x] Environment variables set
- [x] Database connection working
- [x] All services responding correctly

---

## 📞 Support

For issues or questions:
1. Check logs: `pm2 logs`
2. Check PM2 status: `pm2 status`
3. Check nginx: `systemctl status nginx`
4. Review this guide

---

**Last Updated**: December 15, 2025
**Deployment Method**: PM2 + Nginx
**Status**: ✅ Production Ready
