# FlowLibre Studio - Technical Specification

## 🏗️ **System Architecture**

### **Frontend Stack**
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 7.0.2
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect, useCallback)

### **Backend Stack**
- **Runtime**: Node.js 24.3.0
- **Server**: Express.js with CORS
- **Module System**: ES Modules (type: "module" in package.json)

---

## 📁 **Project Structure**

```
flowlibre-studio/
├── src/
│   ├── components/
│   │   ├── dashboards/
│   │   │   ├── FileWorkflowDashboard.tsx
│   │   │   ├── FileWorkflowDashboardParsingError.tsx
│   │   │   ├── TileDetailRouter.tsx
│   │   │   └── [Other dashboard components]
│   │   ├── shared/
│   │   │   └── types.ts
│   │   └── [Other UI components]
│   ├── services/
│   │   ├── api.ts
│   │   ├── dataService.ts
│   │   ├── fileWorkflowData.ts
│   │   ├── imageWorkflowData.ts
│   │   └── batchWorkflowData.ts
│   ├── hooks/
│   │   └── useAPI.ts
│   └── [Other source files]
├── test-server.cjs
└── [Configuration files]
```

---

## 🎯 **Core Features**

### **1. Agent Management**
- **Agent Types**: File Workflow, Image Workflow, Batch Workflow, Design Agent
- **Agent States**: Active, Inactive, Processing
- **Agent Properties**: ID, Name, Type, Status, Configuration

### **2. Dashboard System**
- **Main Dashboard**: Agent overview with metrics tiles
- **Detail Views**: Drill-down views for specific metrics
- **Date Filtering**: Today, Last 7 Days, Custom Date Range
- **Real-time Updates**: API-driven data with fallback to mock data

### **3. File Processing Workflow**
- **Metrics**: Total Files Processed, Success Rates, Error Counts
- **Error Types**: File Reading Errors, Matching Errors
- **Services**: Azure Document Intelligence integration
- **Error Details**: File name, error message, confidence, service, timestamp

---

## 🔌 **API Architecture**

### **API Service Layer (`src/services/api.ts`)**
```typescript
// Base Configuration
const API_BASE_URL = 'http://localhost:3001/api'
const API_TIMEOUT = 10000 // 10 seconds

// Request wrapper with timeout and error handling
async function apiRequest<T>(endpoint: string, options?: RequestInit)
```

### **Data Service Layer (`src/services/dataService.ts`)**
- **Smart Data Service**: Falls back to mock data when API fails
- **Service-specific APIs**: File, Image, Batch, Design Agent processing
- **Error Handling**: Graceful degradation with console logging

### **Current API Endpoints**

#### **File Processing**
```
GET /api/agents/:id/file-processing/metrics?dateFilter={filter}
GET /api/agents/:id/file-processing/errors?type={parsing|matching}&dateFilter={filter}
```

#### **Health Check**
```
GET /api/health
```

---

## 🎨 **UI/UX Design**

### **Design System**
- **Color Scheme**: Blue primary (#3B82F6), Gray scale, Red for errors
- **Typography**: Inter font family
- **Spacing**: Tailwind CSS spacing scale
- **Components**: Cards, Buttons, Dropdowns, Loading states

### **Dashboard Layout**
```
┌─────────────────────────────────────────────────────────┐
│ Header: Agent Info + Navigation Tabs                  │
├─────────────────────────────────────────────────────────┤
│ Date Filter Dropdown                                  │
├─────────────────────────────────────────────────────────┤
│ Metrics Grid (2x3)                                    │
│ ┌─────────────┬─────────────┬─────────────┐          │
│ │ Total Files │ Success     │ Success     │          │
│ │ Processed   │ Rate (Read) │ Rate (Match)│          │
│ └─────────────┴─────────────┴─────────────┘          │
│ ┌─────────────┬─────────────┬─────────────┐          │
│ │ File Read   │ Matching    │ [Empty]     │          │
│ │ Errors      │ Errors      │             │          │
│ └─────────────┴─────────────┴─────────────┘          │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 **Data Flow**

### **Dashboard Data Flow**
```
1. User opens dashboard
2. useEffect triggers API call
3. smartDataService.getFileProcessingMetrics()
4. API call to backend
5. If API fails → fallback to mock data
6. Update component state
7. Render metrics tiles
```

### **Detail View Data Flow**
```
1. User clicks metric tile
2. Navigate to detail view with dateFilter
3. useEffect triggers error API call
4. fileProcessingDataService.getFileProcessingErrors()
5. Render error list with details
```

---

## 🛠️ **Technical Implementation**

### **State Management**
```typescript
// Dashboard State
const [currentData, setCurrentData] = useState<any>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [dateFilter, setDateFilter] = useState<DateFilter>('today');
const [customDateRange, setCustomDateRange] = useState<DateRange>({ start: '', end: '' });
```

### **API Integration Pattern**
```typescript
// Smart fallback pattern
async getFileProcessingMetrics(agentId: number, dateFilter: DateFilter) {
  try {
    return await fileProcessingDataService.getFileProcessingMetrics(agentId, dateFilter);
  } catch (error) {
    console.warn('API failed, falling back to mock data:', error);
    return mockDataService.getFileWorkflowData(dateFilter);
  }
}
```

### **Error Handling Strategy**
- **API Failures**: Graceful fallback to mock data
- **Network Timeouts**: 10-second timeout with abort controller
- **Component Errors**: Error boundaries and loading states
- **User Feedback**: Loading spinners, error messages, retry buttons

---

## 🧪 **Testing Infrastructure**

### **Backend Testing**
- **Test Server**: `test-server.cjs` with Express.js
- **Mock Data**: Realistic data for different date filters
- **API Endpoints**: Health check, metrics, errors
- **CORS**: Configured for localhost:5174

### **Frontend Testing**
- **Development Server**: Vite on localhost:5174
- **Hot Module Replacement**: Enabled for development
- **TypeScript**: Strict type checking
- **ESLint**: Code quality enforcement

---

## 🔧 **Development Workflow**

### **Local Development**
```bash
# Start frontend
npm run dev

# Start backend (separate terminal)
node test-server.cjs

# Access application
http://localhost:5174
```

### **API Testing**
```bash
# Health check
curl http://localhost:3001/api/health

# File processing metrics
curl "http://localhost:3001/api/agents/1/file-processing/metrics?dateFilter=today"

# File processing errors
curl "http://localhost:3001/api/agents/1/file-processing/errors?type=parsing&dateFilter=today"
```

---

## 📊 **Performance Considerations**

### **Optimizations Implemented**
- **Memoization**: useCallback for expensive functions
- **Caching**: API response caching (simplified)
- **Lazy Loading**: Component-based code splitting
- **Error Boundaries**: Graceful error handling

### **Known Issues**
- **Infinite Loop**: API calls causing re-renders (under investigation)
- **Memory Leaks**: Potential with useEffect cleanup
- **Network Requests**: No request deduplication

---

## 🚀 **Deployment Architecture**

### **Frontend Deployment**
- **Build**: `npm run build`
- **Static Hosting**: Vite output directory
- **Environment**: Production-optimized bundle

### **Backend Deployment**
- **Runtime**: Node.js with Express
- **Port**: 3001 (configurable)
- **Environment Variables**: API_BASE_URL, PORT
- **CORS**: Configured for production domains

---

## 🔮 **Future Enhancements**

### **Planned Features**
- **Real-time Updates**: WebSocket integration
- **Authentication**: JWT-based auth system
- **Database**: PostgreSQL with Prisma ORM
- **File Upload**: Drag-and-drop file processing
- **Advanced Filtering**: Search and filter capabilities

### **Technical Debt**
- **Type Safety**: Improve TypeScript interfaces
- **Testing**: Unit and integration tests
- **Documentation**: API documentation with OpenAPI
- **Monitoring**: Error tracking and analytics

---

## 📋 **Configuration**

### **Environment Variables**
```bash
# Frontend (.env)
VITE_API_BASE_URL=http://localhost:3001/api

# Backend (test-server.cjs)
const PORT = 3001
const CORS_ORIGIN = 'http://localhost:5174'
```

### **Package Dependencies**
```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.0.0",
    "lucide-react": "^0.263.0",
    "express": "^4.18.0",
    "cors": "^2.8.5"
  }
}
```

---

*This technical specification covers the current state of FlowLibre Studio as of the latest implementation. The system is designed for extensibility and can accommodate additional agent types, workflows, and features.* 