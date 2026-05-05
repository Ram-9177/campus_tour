# SMRU Campus Tour - Deployment Guide

Complete guide to deploy the SMRU Campus Tour PWA to production.

## Pre-Deployment Checklist

- [ ] Update APP_NAME and description in `app/layout.tsx`
- [ ] Update domain in `app/layout.tsx` (APP_URL)
- [ ] Add app icons to `public/icons/` (192x192, 512x512 PNG)
- [ ] Add screenshots to `public/screenshots/`
- [ ] Update `public/manifest.json` with correct metadata
- [ ] Test offline functionality
- [ ] Run `npm run build` and verify no errors
- [ ] Test on mobile devices (iOS and Android)
- [ ] Set up custom domain at hosting provider
- [ ] Configure SSL/HTTPS certificate
- [ ] Set up analytics (optional)
- [ ] Configure backup and monitoring

## Hosting Options

### 1. Vercel (Recommended)

Vercel is the official Next.js hosting platform with optimized configuration.

#### Setup Steps:

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub/GitLab/Bitbucket

2. **Connect Repository**
   - Select your repository
   - Vercel auto-detects Next.js configuration

3. **Configure Environment**
   ```
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **Add Environment Variables**
   - Go to Settings → Environment Variables
   - Add any custom environment variables from `.env.local.example`

5. **Configure Domain**
   - Go to Settings → Domains
   - Add your custom domain: `tour.smru.edu.in`
   - Follow DNS setup instructions

6. **Deploy**
   - Push to main branch
   - Vercel automatically builds and deploys

#### Vercel Deployment URL
After deployment, your app will be available at:
- `https://campus-tour.vercel.app` (auto-generated)
- `https://tour.smru.edu.in` (custom domain)

### 2. Netlify

#### Setup Steps:

1. **Create Netlify Account**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub

2. **Connect Repository**
   - Click "New site from Git"
   - Select repository
   - Select branch to deploy

3. **Configure Build**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18

4. **Add Environment Variables**
   - Go to Site Settings → Build & Deploy → Environment
   - Add environment variables

5. **Configure Domain**
   - Go to Site Settings → Domain settings
   - Add custom domain: `tour.smru.edu.in`
   - Update DNS records at domain provider

6. **Deploy**
   - Netlify automatically deploys on git push

### 3. Self-Hosted (AWS, DigitalOcean, Azure, etc.)

#### Using Docker

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build
RUN npm run build

# Start
EXPOSE 3000
CMD ["npm", "start"]
```

Create `.dockerignore`:
```
.git
.gitignore
node_modules
.next
.env*
```

#### Deploy Steps:

1. **AWS EC2**
   ```bash
   # SSH into instance
   ssh -i key.pem ubuntu@your-instance-ip
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Clone repository
   git clone https://github.com/yourrepo/campus-tour.git
   cd campus-tour
   
   # Install dependencies
   npm install
   
   # Build
   npm run build
   
   # Install PM2 for process management
   npm install -g pm2
   
   # Start application
   pm2 start npm --name "campus-tour" -- start
   pm2 startup
   pm2 save
   ```

2. **Configure Nginx Reverse Proxy**
   ```nginx
   server {
       listen 80;
       server_name tour.smru.edu.in;
   
       # Redirect to HTTPS
       return 301 https://$server_name$request_uri;
   }
   
   server {
       listen 443 ssl http2;
       server_name tour.smru.edu.in;
   
       ssl_certificate /etc/letsencrypt/live/tour.smru.edu.in/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/tour.smru.edu.in/privkey.pem;
   
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot certonly --nginx -d tour.smru.edu.in
   ```

4. **DigitalOcean**
   - Create Droplet (Ubuntu 20.04)
   - Follow AWS EC2 steps above
   - Use App Platform for easier deployment

## Post-Deployment Tasks

### 1. Verify PWA Installation
- [ ] Check `https://tour.smru.edu.in` loads correctly
- [ ] Test on mobile (iOS and Android)
- [ ] Install app from home screen
- [ ] Test offline functionality
- [ ] Verify all routes work

### 2. Test Performance
```bash
# Local lighthouse test
npm install -g lighthouse
lighthouse https://tour.smru.edu.in --view
```

### 3. Monitor Application
- Set up error tracking (Sentry, LogRocket)
- Configure analytics (Google Analytics, Mixpanel)
- Set up uptime monitoring
- Configure log aggregation

### 4. Backup Strategy
- Regular database backups
- Version control for code
- Content backup strategy
- Disaster recovery plan

## Continuous Deployment (CI/CD)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  Deploy-Production:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run type check
        run: npm run type-check
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## QR Code Setup

### QR Code for App Homepage

The main QR code should link to: `https://tour.smru.edu.in`

Generate QR code using:
- [QR Code Generator](https://www.qr-code-generator.com/)
- Design with SMRU branding
- Print resolution: at least 150 DPI
- Size: Minimum 2x2 cm for mobile scanning

### QR Code Placement
- Main entrance/reception
- Campus signage
- Brochures and flyers
- Digital displays
- Event materials

## Monitoring & Maintenance

### Regular Checks
- [ ] Check error logs weekly
- [ ] Monitor uptime
- [ ] Review performance metrics
- [ ] Test offline functionality
- [ ] Verify all features work

### Maintenance Schedule
- Weekly: Check for errors and issues
- Monthly: Review analytics and performance
- Quarterly: Update content and information
- Annually: Security audit and updates

### Update Process
1. Create feature branch
2. Make changes
3. Test thoroughly
4. Create pull request
5. Review and merge
6. Auto-deploy to production

## Troubleshooting

### Application Not Loading
- Check build logs
- Verify environment variables
- Check DNS settings
- Clear browser cache
- Test from different device

### Service Worker Issues
- Check `/sw.js` is accessible
- Verify HTTPS (or localhost)
- Clear browser cache
- Unregister old service workers
- Reload page

### Performance Issues
- Check build size
- Optimize images
- Review network requests
- Check server resources
- Enable caching headers

## Security Checklist

- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Service worker MIME type correct
- [ ] CSP policy configured
- [ ] Regular security updates
- [ ] Dependency scanning enabled
- [ ] Environment variables secured
- [ ] No API keys in code

## Support & Issues

For deployment help:
- Check [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- Review hosting provider documentation
- Check application logs
- Contact SMRU technical team

---

**Last Updated**: May 2026
**Status**: Production Ready
