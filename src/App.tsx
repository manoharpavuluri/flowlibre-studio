import { useState } from 'react';
import { Bot, FileText, Image, Settings } from 'lucide-react';
import type { Agent, ViewType } from './components/shared/types';
import HomePage from './components/HomePage';
import DashboardRouter from './components/dashboards/DashboardRouter';
import TileDetailRouter from './components/dashboards/TileDetailRouter';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [selectedTile, setSelectedTile] = useState<string | null>(null);

  const agents: Agent[] = [
    {
      id: 1,
      name: 'Invoice Parser Pro',
      type: 'File Workflow',
      icon: FileText,
      status: 'in-development',
      lastModified: '2025-01-15T10:30:00Z',
      description: 'Advanced invoice parsing and data extraction'
    },
    {
      id: 2,
      name: 'BoL Analyzer',
      type: 'File Workflow',
      icon: FileText,
      status: 'active',
      lastModified: '2025-01-14T16:45:00Z',
      description: 'Oil & Gas Bill of Lading document processing and analysis'
    },
    {
      id: 3,
      name: 'Image OCR Agent',
      type: 'Image Workflow',
      icon: Image,
      status: 'active',
      lastModified: '2025-01-10T08:30:00Z',
      description: 'OCR processing for scanned documents'
    },
    {
      id: 4,
      name: 'Multi-Doc Processor',
      type: 'Batch Workflow',
      icon: Bot,
      status: 'in-development',
      lastModified: '2025-01-11T11:00:00Z',
      description: 'Batch processing for multiple document types'
    },
    {
      id: 5,
      name: 'UI Design Assistant',
      type: 'Design Agent',
      icon: Settings,
      status: 'in-development',
      lastModified: '2025-01-12T14:20:00Z',
      description: 'AI-powered UI/UX design and prototyping assistant'
    }
  ];

  const handleAgentSelect = (agent: Agent) => {
    setSelectedAgent(agent);
    setCurrentView('dashboard');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedAgent(null);
    setSelectedTile(null);
  };

  const handleTileClick = (tileType: string) => {
    setSelectedTile(tileType);
    setCurrentView('tile-detail');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedTile(null);
  };

  // Main App Render
  if (currentView === 'tile-detail' && selectedAgent && selectedTile) {
    return (
      <TileDetailRouter 
        agent={selectedAgent} 
        tileType={selectedTile} 
        onBackToDashboard={handleBackToDashboard} 
      />
    );
  }

  if (currentView === 'dashboard' && selectedAgent) {
    return (
      <DashboardRouter 
        agent={selectedAgent} 
        onTileClick={handleTileClick} 
        onBackToHome={handleBackToHome} 
      />
    );
  }

  return <HomePage agents={agents} onAgentSelect={handleAgentSelect} />;
}

export default App;