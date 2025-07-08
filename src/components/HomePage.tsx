import React, { useState } from 'react';
import { Search, Plus, Bot, Settings } from 'lucide-react';
import type { Agent } from './shared/types';
import AgentCard from './AgentCard';
import UserDropdown from './UserDropdown';

interface Props {
  agents: Agent[];
  onAgentSelect: (agent: Agent) => void;
}

const HomePage: React.FC<Props> = ({ agents, onAgentSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">FlowLibre Studio</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <UserDropdown />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* New Agent Button Row */}
        <div className="flex items-center justify-end mb-8">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors">
            <Plus className="w-4 h-4" />
            <span>New Agent</span>
          </button>
        </div>

        {/* Agents Title and Controls Row */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Agents</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search agents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-64"
              />
            </div>
          </div>
        </div>

        {/* Agent Grid */}
        <div className="grid gap-4 w-full" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {filteredAgents.map((agent) => (
            <AgentCard 
              key={agent.id} 
              agent={agent} 
              onSelect={onAgentSelect}
            />
          ))}
        </div>

        {/* No agents found message */}
        {filteredAgents.length === 0 && (
          <div className="text-center py-12">
            <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No agents found</h3>
            <p className="text-gray-500">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;