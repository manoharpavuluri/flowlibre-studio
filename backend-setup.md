# Backend Setup Guide for FlowLibre Studio

This guide will help you set up a backend server to work with the FlowLibre Studio frontend.

## 🚀 Quick Start

### Option 1: Express.js Backend (Recommended)

1. **Create a new directory for the backend:**
   ```bash
   mkdir flowlibre-backend
   cd flowlibre-backend
   npm init -y
   ```

2. **Install dependencies:**
   ```bash
   npm install express cors helmet morgan dotenv bcryptjs jsonwebtoken multer
   npm install --save-dev @types/express @types/cors @types/morgan @types/bcryptjs @types/jsonwebtoken @types/multer nodemon
   ```

3. **Create the basic server structure:**
   ```bash
   mkdir src
   mkdir src/routes
   mkdir src/controllers
   mkdir src/middleware
   mkdir src/models
   mkdir src/services
   mkdir src/utils
   ```

4. **Create `src/server.js`:**
   ```javascript
   const express = require('express');
   const cors = require('cors');
   const helmet = require('helmet');
   const morgan = require('morgan');
   require('dotenv').config();

   const app = express();
   const PORT = process.env.PORT || 3001;

   // Middleware
   app.use(helmet());
   app.use(cors({
     origin: process.env.FRONTEND_URL || 'http://localhost:5173',
     credentials: true
   }));
   app.use(morgan('combined'));
   app.use(express.json({ limit: '10mb' }));
   app.use(express.urlencoded({ extended: true }));

   // Routes
   app.use('/api/agents', require('./routes/agents'));
   app.use('/api/auth', require('./routes/auth'));
   app.use('/api/file-processing', require('./routes/fileProcessing'));
   app.use('/api/image-processing', require('./routes/imageProcessing'));
   app.use('/api/batch-processing', require('./routes/batchProcessing'));
   app.use('/api/design', require('./routes/design'));

   // Health check
   app.get('/api/health', (req, res) => {
     res.json({ status: 'OK', timestamp: new Date().toISOString() });
   });

   // Error handling middleware
   app.use((err, req, res, next) => {
     console.error(err.stack);
     res.status(500).json({ 
       success: false, 
       error: 'Internal server error',
       message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
     });
   });

   app.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
   });
   ```

5. **Create `.env` file:**
   ```env
   NODE_ENV=development
   PORT=3001
   FRONTEND_URL=http://localhost:5173
   JWT_SECRET=your-super-secret-jwt-key
   DATABASE_URL=your-database-url
   ```

6. **Add scripts to `package.json`:**
   ```json
   {
     "scripts": {
       "start": "node src/server.js",
       "dev": "nodemon src/server.js",
       "test": "jest"
     }
   }
   ```

### Option 2: FastAPI Backend (Python)

1. **Create a new directory for the backend:**
   ```bash
   mkdir flowlibre-backend-python
   cd flowlibre-backend-python
   ```

2. **Create `requirements.txt`:**
   ```
   fastapi==0.104.1
   uvicorn==0.24.0
   python-multipart==0.0.6
   python-jose[cryptography]==3.3.0
   passlib[bcrypt]==1.7.4
   python-dotenv==1.0.0
   sqlalchemy==2.0.23
   pydantic==2.5.0
   ```

3. **Create `main.py`:**
   ```python
   from fastapi import FastAPI, HTTPException, Depends
   from fastapi.middleware.cors import CORSMiddleware
   from fastapi.security import HTTPBearer
   from pydantic import BaseModel
   from typing import List, Optional
   import uvicorn
   from datetime import datetime
   import os
   from dotenv import load_dotenv

   load_dotenv()

   app = FastAPI(title="FlowLibre Studio API", version="1.0.0")

   # CORS middleware
   app.add_middleware(
       CORSMiddleware,
       allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:5173")],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )

   # Models
   class Agent(BaseModel):
       id: Optional[int] = None
       name: str
       type: str
       status: str
       description: str
       lastModified: str

   class FileProcessingMetrics(BaseModel):
       totalFilesProcessed: int
       successRateParsing: float
       successRateMatching: float
       totalParsingErrors: int
       totalMatchingErrors: int

   # Routes
   @app.get("/api/health")
   async def health_check():
       return {"status": "OK", "timestamp": datetime.now().isoformat()}

   @app.get("/api/agents")
   async def get_agents():
       # Mock data for now
       agents = [
           {
               "id": 1,
               "name": "Invoice Reader Pro",
               "type": "File Workflow",
               "status": "active",
               "description": "Advanced invoice file reading and data extraction",
               "lastModified": "2025-01-15T10:30:00Z"
           }
       ]
       return {"success": True, "data": agents}

   @app.get("/api/agents/{agent_id}/metrics")
   async def get_agent_metrics(agent_id: int, dateFilter: str = "today"):
       # Mock metrics data
       metrics = {
           "totalFilesProcessed": 25,
           "successRateParsing": 80.0,
           "successRateMatching": 84.0,
           "totalParsingErrors": 5,
           "totalMatchingErrors": 4
       }
       return {"success": True, "data": metrics}

   if __name__ == "__main__":
       uvicorn.run(app, host="0.0.0.0", port=3001)
   ```

4. **Run the server:**
   ```bash
   pip install -r requirements.txt
   python main.py
   ```

## 🔧 API Endpoints

### Agents
- `GET /api/agents` - Get all agents
- `GET /api/agents/:id` - Get agent by ID
- `POST /api/agents` - Create new agent
- `PUT /api/agents/:id` - Update agent
- `DELETE /api/agents/:id` - Delete agent
- `GET /api/agents/:id/metrics` - Get agent metrics
- `GET /api/agents/:id/workflow` - Get agent workflow
- `POST /api/agents/:id/workflow` - Save agent workflow

### File Processing
- `GET /api/agents/:id/file-processing/metrics` - Get file processing metrics
- `GET /api/agents/:id/file-processing/errors` - Get file processing errors
- `GET /api/agents/:id/file-processing/files` - Get processed files list
- `POST /api/agents/:id/file-processing/upload` - Upload file for processing
- `GET /api/agents/:id/file-processing/status/:fileId` - Get file processing status

### Image Processing
- `GET /api/agents/:id/image-processing/metrics` - Get image processing metrics
- `GET /api/agents/:id/image-processing/errors` - Get image processing errors
- `POST /api/agents/:id/image-processing/upload` - Upload image for processing

### Batch Processing
- `GET /api/agents/:id/batch-processing/metrics` - Get batch processing metrics
- `GET /api/agents/:id/batch-processing/errors` - Get batch processing errors
- `POST /api/agents/:id/batch-processing/start` - Start batch processing
- `GET /api/agents/:id/batch-processing/status/:batchId` - Get batch processing status

### Design Agent
- `GET /api/agents/:id/design/metrics` - Get design agent metrics
- `POST /api/agents/:id/design/generate` - Generate design
- `GET /api/agents/:id/design/history` - Get design history

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token

## 🗄️ Database Setup

### Option 1: SQLite (Development)
```bash
npm install sqlite3
```

### Option 2: PostgreSQL (Production)
```bash
npm install pg
```

### Option 3: MongoDB
```bash
npm install mongodb mongoose
```

## 🔐 Authentication

1. **Install JWT dependencies:**
   ```bash
   npm install jsonwebtoken bcryptjs
   ```

2. **Create authentication middleware:**
   ```javascript
   // src/middleware/auth.js
   const jwt = require('jsonwebtoken');

   const authenticateToken = (req, res, next) => {
     const authHeader = req.headers['authorization'];
     const token = authHeader && authHeader.split(' ')[1];

     if (!token) {
       return res.status(401).json({ success: false, error: 'Access token required' });
     }

     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
       if (err) {
         return res.status(403).json({ success: false, error: 'Invalid token' });
       }
       req.user = user;
       next();
     });
   };

   module.exports = { authenticateToken };
   ```

## 📁 File Upload

1. **Install multer for file uploads:**
   ```bash
   npm install multer
   ```

2. **Create file upload middleware:**
   ```javascript
   // src/middleware/upload.js
   const multer = require('multer');
   const path = require('path');

   const storage = multer.diskStorage({
     destination: (req, file, cb) => {
       cb(null, 'uploads/');
     },
     filename: (req, file, cb) => {
       cb(null, Date.now() + path.extname(file.originalname));
     }
   });

   const upload = multer({ 
     storage: storage,
     limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
     fileFilter: (req, file, cb) => {
       const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|csv/;
       const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
       const mimetype = allowedTypes.test(file.mimetype);
       
       if (mimetype && extname) {
         return cb(null, true);
       } else {
         cb(new Error('Invalid file type'));
       }
     }
   });

   module.exports = { upload };
   ```

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Docker
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
```

## 🔧 Environment Variables

Create a `.env` file in your backend directory:

```env
# Server Configuration
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173

# Security
JWT_SECRET=your-super-secret-jwt-key-here
BCRYPT_ROUNDS=12

# Database
DATABASE_URL=your-database-connection-string

# File Storage
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760

# External Services
AZURE_DOCUMENT_INTELLIGENCE_KEY=your-azure-key
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
OPENAI_API_KEY=your-openai-key
```

## 🔗 Frontend Integration

1. **Update the frontend API base URL:**
   Create a `.env` file in your frontend directory:
   ```env
   VITE_API_BASE_URL=http://localhost:3001/api
   ```

2. **Test the connection:**
   The frontend will automatically fall back to mock data if the API is not available.

## 🧪 Testing

1. **Install testing dependencies:**
   ```bash
   npm install --save-dev jest supertest
   ```

2. **Create test files:**
   ```javascript
   // tests/agents.test.js
   const request = require('supertest');
   const app = require('../src/server');

   describe('Agents API', () => {
     test('GET /api/agents should return agents list', async () => {
       const response = await request(app).get('/api/agents');
       expect(response.status).toBe(200);
       expect(response.body.success).toBe(true);
       expect(Array.isArray(response.body.data)).toBe(true);
     });
   });
   ```

3. **Run tests:**
   ```bash
   npm test
   ```

## 📚 Next Steps

1. **Implement real database integration**
2. **Add file processing logic**
3. **Integrate with external AI services**
4. **Add WebSocket support for real-time updates**
5. **Implement caching with Redis**
6. **Add monitoring and logging**
7. **Set up CI/CD pipeline**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 