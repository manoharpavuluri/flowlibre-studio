# FlowLibre Studio

A modern React/TypeScript dashboard for managing AI agents with interactive, node-based ETL workflow design.

## 🚀 Features

- **AI Agent Management**: Dashboard for File Workflow, Image Workflow, Batch Workflow, and Design Agent
- **Interactive Design Agent**: Drag-and-drop, node-based ETL workflow builder with visual connections
- **Rich Node Palette**: Includes sources, destinations, parsers, matchers, mappers, filters, transformers, aggregators, and advanced nodes (see below)
- **Advanced Node Types**: Auto-Mapping Matcher, Fuzzy Lookup, Exact Lookup, Join/Merge, Reconciliation, LLM QA, Error Handler, Slack/Teams, Webhook, Alert, File Writer, and more
- **Modal-Driven Node Config**: Double-click nodes or use the sidebar to open configuration modals for each node type
- **Change Node Type**: Easily switch node types via the config modal
- **Intuitive Canvas**: Drag, zoom, and pan the workflow canvas; smooth node movement and connection creation
- **Visual Ports**: Chain link and arrow icons for input/output ports, with clear connection logic
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
1. **Add Components**: Drag components from the sidebar to the canvas, or use the modal-driven type selector
2. **Connect Components**: Click and drag from output (arrow) ports to input (chain link) ports
3. **Configure Nodes**: Double-click a node or use the sidebar to open its configuration modal (supports advanced config for LLM QA, Error Handler, etc.)
4. **Change Node Type**: Use the "Change Type" button in the config modal to switch node types
5. **Build ETL Workflows**: Create data processing pipelines visually with a wide variety of node types
6. **Canvas Controls**: Drag nodes, pan the canvas, and zoom in/out for large workflows
7. **Save Workflows**: Save your workflow configurations

### Node Types
- **Sources**: S3, FTP, Local Folder, Azure Blob, API, Email Attachment
- **Parsers**: Document Intelligence, CSV, Excel, PDF, JSON, XML
- **Matchers**: Auto-Mapping Matcher, Fuzzy Lookup, Exact Lookup, Regex Matcher, Semantic Matcher
- **Mappers**: Field Mapper, Data Mapper, Schema Mapper, Format Converter
- **Filters**: Condition Filter, Range Filter, Duplicate Filter, Quality Filter
- **Transformers**: Data Transformer, Aggregation Transformer, Calculation Transformer, Data Enrichment, Data Normalization
- **Aggregators**: Group By, Window Function, Pivot Table, Summary Statistics
- **Advanced/Other**: Join/Merge, Reconciliation, LLM QA, Error Handler/Drilldown, Slack/Teams, Webhook, Alert, File Writer

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
│   ├── nodes/              # Node components (all node types)
│   ├── shared/             # Shared components and types
│   └── ...
├── services/               # Data services
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

1. **New Node Type**: Add a new component in `src/components/nodes/` and register it in the workflow logic
2. **New Agent Type**: Add dashboard component in `src/components/dashboards/`
3. **New Data Service**: Create service file in `src/services/`
4. **New Shared Components**: Add to `src/components/shared/`

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
