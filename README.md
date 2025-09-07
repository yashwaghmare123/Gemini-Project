# Virtual School - Production Ready Application

A comprehensive Virtual School platform built with Node.js, Express, React, Redux Toolkit, and Google Gemini AI integration.

## 🚀 Features

- **AI-Powered Content Generation**: Generate quizzes, notes, flashcards, and assignments using Google Gemini AI
- **Dual Dashboard System**: Separate interfaces for teachers and students
- **Interactive AI Tutor**: Real-time chat assistance for students
- **Comprehensive Assessment Tools**: Quiz creation, submission, and automated feedback
- **State Management**: Redux Toolkit for predictable state management
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Theme**: User preference-based theming
- **Production Ready**: Comprehensive testing, error handling, and security

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Google Generative AI** - AI content generation
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Jest** - Testing framework
- **Supertest** - HTTP testing

### Frontend
- **React 18** - UI library
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling framework
- **Framer Motion** - Animation library
- **Heroicons** - Icon library
- **Axios** - HTTP client
- **Vitest** - Testing framework
- **React Testing Library** - Component testing

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd quizapp
```

### 2. Backend Setup
```bash
cd QuizappBackend
npm install
```

Create a `.env` file in the QuizappBackend directory:
```env
PORT=3001
GEMINI_API_KEY=your_google_gemini_api_key_here
NODE_ENV=development
```

### 3. Frontend Setup
```bash
cd ../Quizapp
npm install
```

Create a `.env` file in the Quizapp directory:
```env
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=Virtual School
```

## 🚀 Running the Application

### Development Mode

1. **Start the Backend**:
```bash
cd QuizappBackend
npm run dev
```

2. **Start the Frontend**:
```bash
cd Quizapp
npm run dev
```

3. **Access the Application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

### Production Mode

1. **Build the Frontend**:
```bash
cd Quizapp
npm run build
```

2. **Start the Backend in Production**:
```bash
cd QuizappBackend
npm start
```

## 🧪 Testing

### Backend Tests
```bash
cd QuizappBackend
npm test
```

### Frontend Tests
```bash
cd Quizapp
npm test
```

### Coverage Reports
```bash
# Backend coverage
cd QuizappBackend
npm run test:coverage

# Frontend coverage
cd Quizapp
npm run test:coverage
```

## 📁 Project Structure

```
quizapp/
├── QuizappBackend/          # Express.js backend
│   ├── index.js             # Main server file
│   ├── models/              # Data models
│   ├── tests/               # Backend tests
│   └── package.json
├── Quizapp/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── store/           # Redux store & slices
│   │   ├── services/        # API services
│   │   ├── context/         # React contexts
│   │   ├── animations/      # Framer Motion configs
│   │   └── tests/           # Frontend tests
│   ├── public/
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

### Quiz Management
- `POST /api/generate-quiz` - Generate AI-powered quiz
- `POST /api/feedback` - Submit quiz for feedback

### Content Generation
- `POST /api/generate-notes` - Generate study notes
- `POST /api/generate-flashcards` - Generate flashcards
- `POST /api/generate-assignment` - Generate assignments

### AI Tutor
- `POST /api/tutor` - Chat with AI tutor

## 🎨 Components Overview

### Teacher Dashboard (`TeacherDashboard.jsx`)
- Content creation interface
- Tabbed navigation for different content types
- Real-time generation with loading states

### Student Dashboard (`StudentDashboard.jsx`)
- Learning activities overview
- Progress tracking and statistics
- Quick access to all learning tools

### AI Tutor (`AITutor.jsx`)
- Interactive chat interface
- Typing indicators and suggestions
- Conversation history management

### Content Viewers
- **QuizPlayer.jsx**: Interactive quiz experience
- **NotesViewer.jsx**: Expandable study notes
- **FlashcardViewer.jsx**: Interactive flashcard study mode

## 🔄 State Management

The application uses Redux Toolkit with the following slices:

- **quizSlice**: Quiz data and user progress
- **notesSlice**: Generated notes management
- **flashcardsSlice**: Flashcard collections
- **assignmentSlice**: Assignment data
- **tutorSlice**: Chat history and responses
- **feedbackSlice**: Feedback and analytics
- **uiSlice**: UI state and notifications

## 🔒 Security Features

- **Helmet.js**: Security headers
- **CORS**: Configured for secure cross-origin requests
- **Input Validation**: Server-side validation for all endpoints
- **Error Boundaries**: Graceful error handling in React
- **Environment Variables**: Secure API key management

## 🌐 Deployment

### Heroku Deployment

1. **Backend (Heroku)**:
```bash
cd QuizappBackend
heroku create your-app-backend
heroku config:set GEMINI_API_KEY=your_api_key
heroku config:set NODE_ENV=production
git push heroku main
```

2. **Frontend (Netlify/Vercel)**:
```bash
cd Quizapp
npm run build
# Deploy dist/ folder to your hosting service
```

### Docker Deployment

Create `Dockerfile` in QuizappBackend:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### Environment Variables for Production

**Backend (.env)**:
```env
PORT=3001
GEMINI_API_KEY=your_production_api_key
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
```

**Frontend (.env.production)**:
```env
VITE_API_URL=https://your-backend-domain.com
VITE_APP_NAME=Virtual School
```

## 🧰 Development Scripts

### Backend Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests
npm run test:watch # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

### Frontend Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm test           # Run tests
npm run test:ui    # Run tests with UI
npm run test:coverage # Generate coverage report
npm run lint       # Run ESLint
```

## 🐛 Troubleshooting

### Common Issues

1. **API Key Issues**:
   - Ensure your Google Gemini API key is valid
   - Check the `.env` file is in the correct directory
   - Restart the server after updating environment variables

2. **CORS Errors**:
   - Verify the CORS_ORIGIN in backend matches frontend URL
   - Check that both servers are running on correct ports

3. **Redux State Issues**:
   - Ensure all actions are dispatched properly
   - Check Redux DevTools for state changes
   - Verify async thunks are handled correctly

## 📊 Performance Monitoring

- **Frontend**: Built-in React DevTools support
- **Backend**: Request/response logging
- **Testing**: Coverage reports for code quality
- **Build**: Vite build analysis for bundle optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Additional Resources

- [React Documentation](https://reactjs.org/docs)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Express.js Documentation](https://expressjs.com/)
- [Google Generative AI Documentation](https://ai.google.dev/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Virtual School** - Empowering education through AI-powered learning tools.
