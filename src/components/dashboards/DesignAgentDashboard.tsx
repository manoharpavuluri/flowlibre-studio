import React, { useState } from 'react';
import { Settings, CheckCircle, Eye, Calendar, ChevronDown, BarChart3, Palette, Sparkles, Target, Zap, Users } from 'lucide-react';
import type { Agent, DateFilter, DateRange } from '../../components/shared/types';

interface DesignAgentDashboardProps {
  agent: Agent;
  onTileClick: (tileType: string) => void;
  onBackToHome: () => void;
}

const DesignAgentDashboard: React.FC<DesignAgentDashboardProps> = ({ 
  agent, 
  onTileClick, 
  onBackToHome 
}) => {
  const [dateFilter, setDateFilter] = useState<DateFilter>('today');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customDateRange, setCustomDateRange] = useState<DateRange>({ start: '', end: '' });

  // Mock data for Design Agent
  const getDesignAgentData = (filter: DateFilter) => {
    const baseData = {
      totalDesignsGenerated: 156,
      userSatisfactionScore: 4.2,
      averageDesignTime: 3.5,
      totalIterations: 89,
      designAcceptanceRate: 78.5
    };

    switch (filter) {
      case 'today':
        return { ...baseData, totalDesignsGenerated: 23, totalIterations: 12 };
      case 'last-7-days':
        return { ...baseData, totalDesignsGenerated: 98, totalIterations: 67 };
      default:
        return baseData;
    }
  };

  const currentData = getDesignAgentData(dateFilter);

  const formatDateFilter = (filter: string): string => {
    switch (filter) {
      case 'today': return 'Today';
      case 'last-7-days': return 'Last 7 Days';
      case 'date-range': 
        if (customDateRange.start && customDateRange.end) {
          return `${customDateRange.start} - ${customDateRange.end}`;
        }
        return 'Custom Range';
      default: return 'Today';
    }
  };

  const handleDateFilterChange = (filter: DateFilter) => {
    setDateFilter(filter);
    if (filter !== 'date-range') {
      setShowDatePicker(false);
    }
  };

  const handleCustomDateSubmit = () => {
    if (customDateRange.start && customDateRange.end) {
      setDateFilter('date-range');
      setShowDatePicker(false);
    }
  };

  const handleCustomDateCancel = () => {
    if (dateFilter !== 'date-range') {
      setCustomDateRange({ start: '', end: '' });
    }
    setShowDatePicker(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBackToHome}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← Back to Agents
              </button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <agent.icon className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">{agent.name}</h1>
                  <p className="text-sm text-gray-500">{agent.type}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${
                agent.status === 'active' 
                  ? 'bg-green-100 text-green-800 border-green-200' 
                  : 'bg-gray-100 text-gray-800 border-gray-200'
              }`}>
                <CheckCircle className="w-3 h-3" />
                <span>{agent.status === 'active' ? 'Live' : agent.status}</span>
              </div>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button className="py-4 px-1 border-b-2 font-medium text-sm border-pink-500 text-pink-600">
              Dashboard
            </button>
            <button className="py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700">
              Design Gallery
            </button>
            <button className="py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700">
              User Feedback
            </button>
            <button className="py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700">
              Performance
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Date Filter */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Design Generation Overview</h2>
            {agent.status === 'active' && (
              <div className="relative">
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">{formatDateFilter(dateFilter)}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                
                {showDatePicker && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button
                      onClick={() => handleDateFilterChange('today')}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${dateFilter === 'today' ? 'bg-pink-50 text-pink-700' : 'text-gray-700'}`}
                    >
                      Today
                    </button>
                    <button
                      onClick={() => handleDateFilterChange('last-7-days')}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${dateFilter === 'last-7-days' ? 'bg-pink-50 text-pink-700' : 'text-gray-700'}`}
                    >
                      Last 7 Days
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <div className="px-4 py-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Custom Date Range</label>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">From</label>
                          <input
                            type="date"
                            value={customDateRange.start}
                            onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                            className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">To</label>
                          <input
                            type="date"
                            value={customDateRange.end}
                            onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                            className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                          />
                        </div>
                        <div className="flex space-x-2 pt-2">
                          <button
                            onClick={handleCustomDateSubmit}
                            disabled={!customDateRange.start || !customDateRange.end}
                            className="flex-1 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
                          >
                            Apply
                          </button>
                          <button
                            onClick={handleCustomDateCancel}
                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Metrics Tiles */}
          {agent.status === 'active' ? (
            <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              {/* Total Designs Generated */}
              <div 
                onClick={() => onTileClick('total-designs')}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-lg hover:scale-105 hover:border-pink-300 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-pink-100 rounded-lg">
                    <Palette className="w-6 h-6 text-pink-600" />
                  </div>
                  <Eye className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Designs Generated</p>
                  <p className="text-3xl font-bold text-gray-900">{currentData.totalDesignsGenerated.toLocaleString()}</p>
                  <p className="text-sm text-pink-600 mt-1">Click to view gallery</p>
                </div>
              </div>

              {/* User Satisfaction Score */}
              <div 
                onClick={() => onTileClick('satisfaction-score')}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-lg hover:scale-105 hover:border-pink-300 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <Eye className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">User Satisfaction</p>
                  <p className="text-3xl font-bold text-gray-900">{currentData.userSatisfactionScore}/5</p>
                  <p className="text-sm text-green-600 mt-1">Click to view feedback</p>
                </div>
              </div>

              {/* Design Acceptance Rate */}
              <div 
                onClick={() => onTileClick('acceptance-rate')}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-lg hover:scale-105 hover:border-pink-300 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <Eye className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Acceptance Rate</p>
                  <p className="text-3xl font-bold text-gray-900">{currentData.designAcceptanceRate}%</p>
                  <p className="text-sm text-blue-600 mt-1">Click to view details</p>
                </div>
              </div>

              {/* Average Design Time */}
              <div 
                onClick={() => onTileClick('design-time')}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-lg hover:scale-105 hover:border-pink-300 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Zap className="w-6 h-6 text-orange-600" />
                  </div>
                  <Eye className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Design Time</p>
                  <p className="text-3xl font-bold text-gray-900">{currentData.averageDesignTime}m</p>
                  <p className="text-sm text-orange-600 mt-1">Click to view performance</p>
                </div>
              </div>

              {/* Total Iterations */}
              <div 
                onClick={() => onTileClick('iterations')}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-lg hover:scale-105 hover:border-pink-300 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                  </div>
                  <Eye className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Iterations</p>
                  <p className="text-3xl font-bold text-gray-900">{currentData.totalIterations}</p>
                  <p className="text-sm text-purple-600 mt-1">Click to view history</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Metrics Available</h3>
                <p className="text-gray-600">
                  This agent is {agent.status === 'in-development' ? 'in development' : agent.status}. 
                  Metrics will be available once the agent is live.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesignAgentDashboard; 