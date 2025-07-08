# FlowLibre Studio

A modern React/TypeScript dashboard for managing AI agents with interactive design capabilities.

## 🚀 Features

- **AI Agent Management**: Dashboard for File Workflow, Image Workflow, Batch Workflow, and Design Agent
- **Interactive Design Agent**: Drag-and-drop ETL workflow builder with visual connections
- **Real-time Metrics**: Live dashboard tiles with agent performance metrics
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/manoharpavuluri/flowlibre-studio.git
   cd flowlibre-studio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:5173`

## 🎯 Usage

### Dashboard Overview
- View all AI agents in a clean, organized dashboard
- Monitor agent status (Active, In-Development, Inactive)
- Access detailed metrics for each agent type

### Design Agent Workflow Builder
1. **Add Components**: Drag components from the sidebar to the canvas
2. **Connect Components**: Click and drag from arrow icons to link icons
3. **Build ETL Workflows**: Create data processing pipelines visually
4. **Save Workflows**: Save your workflow configurations

### Agent Types
- **File Workflow**: Process and analyze file data
- **Image Workflow**: Handle image processing tasks
- **Batch Workflow**: Manage batch processing operations
- **Design Agent**: Visual ETL workflow builder

## 🏗️ Project Structure

```
src/
├── components/
│   ├── dashboards/          # Dashboard components
│   │   ├── FileWorkflowDashboard.tsx
│   │   ├── ImageWorkflowDashboard.tsx
│   │   ├── BatchWorkflowDashboard.tsx
│   │   ├── DesignAgentDashboard.tsx
│   │   ├── FileWorkflowDesignAgent.tsx
│   │   └── ...
│   ├── shared/              # Shared components and types
│   └── ...
├── services/                # Data services
│   ├── fileWorkflowData.ts
│   ├── imageWorkflowData.ts
│   └── batchWorkflowData.ts
└── ...
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features

1. **New Agent Type**: Add dashboard component in `src/components/dashboards/`
2. **New Data Service**: Create service file in `src/services/`
3. **New Components**: Add to `src/components/shared/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Manohar Pavuluri**
- GitHub: [@manoharpavuluri](https://github.com/manoharpavuluri)

---

Built with ❤️ using React, TypeScript, and Vite
