import React from 'react';
import type { Agent } from '../shared/types';
import FileWorkflowDashboardParsingError from './FileWorkflowDashboardParsingError';
import FileWorkflowDashboardMatchingError from './FileWorkflowDashboardMatchingError';
import FileWorkflowDashboardTotalFiles from './FileWorkflowDashboardTotalFiles';
import FileWorkflowDesignAgent from './FileWorkflowDesignAgent';

interface TileDetailRouterProps {
  agent: Agent;
  tileType: string;
  onBackToDashboard: () => void;
  dateFilter: string;
  customDateRange: { start: string; end: string };
}

const TileDetailRouter: React.FC<TileDetailRouterProps> = ({ 
  agent, 
  tileType, 
  onBackToDashboard,
  dateFilter,
  customDateRange
}) => {
  switch (tileType) {
    case 'parsing-errors':
      return <FileWorkflowDashboardParsingError agent={agent} onBack={onBackToDashboard} dateFilter={dateFilter} customDateRange={customDateRange} />;
    case 'matching-errors':
      return <FileWorkflowDashboardMatchingError agent={agent} onBack={onBackToDashboard} />;
    case 'total-files':
      return <FileWorkflowDashboardTotalFiles agent={agent} onBack={onBackToDashboard} />;
    case 'design-agent':
      return <FileWorkflowDesignAgent agent={agent} onBackToDashboard={onBackToDashboard} />;
    default:
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Tile Detail View</h2>
            <p className="text-gray-600 mb-4">Detail view for {tileType} coming soon!</p>
            <button 
              onClick={onBackToDashboard}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      );
  }
};

export default TileDetailRouter; 