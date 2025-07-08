import React from 'react';
import { Eye, CheckCircle, Clock, XCircle, Settings } from 'lucide-react';
import type { Agent } from './shared/types';

interface Props {
  agent: Agent;
  onSelect: (agent: Agent) => void;
}

const AgentCard: React.FC<Props> = ({ agent, onSelect }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'in-development': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-3 h-3" />;
      case 'inactive': return <Clock className="w-3 h-3" />;
      case 'error': return <XCircle className="w-3 h-3" />;
      case 'in-development': return <Settings className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div 
      onClick={() => onSelect(agent)}
      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:scale-105 hover:border-blue-300 transition-all duration-200 group cursor-pointer"
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <agent.icon className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                {agent.name}
              </h3>
              <p className="text-xs text-gray-500">{agent.type}</p>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(agent.status)}`}>
            {getStatusIcon(agent.status)}
            <span className="capitalize">{agent.status === 'in-development' ? 'In Development' : agent.status}</span>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-xs text-gray-600">{agent.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {formatDate(agent.lastModified)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentCard; 