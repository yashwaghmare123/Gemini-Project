# Virtual School - Production Deployment Guide

## Quick Start Commands

### 🚀 Development Setup
```bash
# Install dependencies
cd QuizappBackend && npm install
cd ../Quizapp && npm install

# Set up environment variables
cp .env.example .env  # Edit with your API keys

# Start development servers
npm run dev:all  # Runs both frontend and backend
```

### 🧪 Run Tests
```bash
# Backend tests
cd QuizappBackend && npm test

# Frontend tests  
cd Quizapp && npm test

# Full test suite with coverage
npm run test:all
```

### 🏗️ Production Build
```bash
# Build frontend
cd Quizapp && npm run build

# Start production backend
cd QuizappBackend && npm start
```

## Environment Variables

### Backend (.env)
```env
PORT=3001
GEMINI_API_KEY=your_google_gemini_api_key_here
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=Virtual School
```

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Google Gemini API key obtained
- [ ] All tests passing
- [ ] Frontend build successful
- [ ] Backend running on production server
- [ ] CORS configured for production domain
- [ ] Security headers enabled (Helmet.js)
- [ ] Error monitoring configured
- [ ] Performance monitoring enabled

## Production URLs

- **Frontend**: https://your-app.netlify.app
- **Backend API**: https://your-api.herokuapp.com
- **Documentation**: https://your-docs.gitbook.io

## Support

For issues or questions:
1. Check the troubleshooting section in README.md
2. Review test logs for error details
3. Verify environment variables are set correctly
4. Ensure all dependencies are installed
