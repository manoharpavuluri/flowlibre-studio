import React from 'react';
import type { Agent } from '../shared/types';
import FileWorkflowDashboard from './FileWorkflowDashboard';
import ImageWorkflowDashboard from './ImageWorkflowDashboard';
import BatchWorkflowDashboard from './BatchWorkflowDashboard';
import DesignAgentDashboard from './DesignAgentDashboard';

interface DashboardRouterProps {
  agent: Agent;
  onTileClick: (tileType: string) => void;
  onBackToHome: () => void;
}

const DashboardRouter: React.FC<DashboardRouterProps> = ({ 
  agent, 
  onTileClick, 
  onBackToHome 
}) => {
  switch (agent.type) {
    case 'File Workflow':
      return (
        <FileWorkflowDashboard 
          agent={agent} 
          onTileClick={onTileClick} 
          onBackToHome={onBackToHome} 
        />
      );
    case 'Image Workflow':
      return (
        <ImageWorkflowDashboard 
          agent={agent} 
          onTileClick={onTileClick} 
          onBackToHome={onBackToHome} 
        />
      );
    case 'Batch Workflow':
      return (
        <BatchWorkflowDashboard 
          agent={agent} 
          onTileClick={onTileClick} 
          onBackToHome={onBackToHome} 
        />
      );
    case 'Design Agent':
      return (
        <DesignAgentDashboard 
          agent={agent} 
          onTileClick={onTileClick} 
          onBackToHome={onBackToHome} 
        />
      );
    default:
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Unknown Agent Type</h2>
            <p className="text-gray-600 mb-4">Dashboard not available for this agent type.</p>
            <button 
              onClick={onBackToHome}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      );
  }
};

export default DashboardRouter; 