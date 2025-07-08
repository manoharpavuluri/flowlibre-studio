import React, { useState } from 'react';
import { FileText, CheckCircle, Settings, Eye, Calendar, ChevronDown, Database, AlertTriangle, BarChart3 } from 'lucide-react';
import type { Agent, DateFilter, DateRange } from '../../components/shared/types';
import { getFileWorkflowData } from '../../services/fileWorkflowData';

interface FileWorkflowDashboardProps {
  agent: Agent;
  onTileClick: (tileType: string) => void;
  onBackToHome: () => void;
}

const FileWorkflowDashboard: React.FC<FileWorkflowDashboardProps> = ({ 
  agent, 
  onTileClick, 
  onBackToHome 
}) => {
  const [dateFilter, setDateFilter] = useState<DateFilter>('today');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customDateRange, setCustomDateRange] = useState<DateRange>({ start: '', end: '' });

  const currentData = getFileWorkflowData(dateFilter);

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
                <div className="p-2 bg-blue-100 rounded-lg">
                  <agent.icon className="w-5 h-5 text-blue-600" />
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
              <button className="py-4 px-1 border-b-2 font-medium text-sm border-blue-500 text-blue-600">
                Dashboard
              </button>
              <button className="py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700">
                LLM Q&A
              </button>
              <button 
                onClick={() => onTileClick('design-agent')}
                className="py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                Design Agent
              </button>
              <button className="py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700">
                Run History
              </button>
            </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Date Filter */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">File Processing Overview</h2>
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
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${dateFilter === 'today' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                    >
                      Today
                    </button>
                    <button
                      onClick={() => handleDateFilterChange('last-7-days')}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${dateFilter === 'last-7-days' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
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
                            className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">To</label>
                          <input
                            type="date"
                            value={customDateRange.end}
                            onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                            className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          />
                        </div>
                        <div className="flex space-x-2 pt-2">
                          <button
                            onClick={handleCustomDateSubmit}
                            disabled={!customDateRange.start || !customDateRange.end}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
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
              {/* Total Files Processed */}
              <div 
                onClick={() => onTileClick('total-files')}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-lg hover:scale-105 hover:border-blue-300 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <Eye className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Files Processed</p>
                  <p className="text-3xl font-bold text-gray-900">{currentData.totalFilesProcessed.toLocaleString()}</p>
                  <p className="text-sm text-blue-600 mt-1">Click to view details</p>
                </div>
              </div>

              {/* Success Rate (Parsing) */}
              <div 
                onClick={() => onTileClick('parsing-success')}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-lg hover:scale-105 hover:border-blue-300 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <Eye className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Rate (Parsing)</p>
                  <p className="text-3xl font-bold text-gray-900">{currentData.successRateParsing}%</p>
                  <p className="text-sm text-green-600 mt-1">Click to view by field</p>
                </div>
              </div>

              {/* Success Rate (Matching) */}
              <div 
                onClick={() => onTileClick('matching-success')}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-lg hover:scale-105 hover:border-blue-300 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Database className="w-6 h-6 text-purple-600" />
                  </div>
                  <Eye className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Rate (Matching)</p>
                  <p className="text-3xl font-bold text-gray-900">{currentData.successRateMatching}%</p>
                  <p className="text-sm text-purple-600 mt-1">Click to view by vendor</p>
                </div>
              </div>

              {/* Total Parsing Errors */}
              <div 
                onClick={() => onTileClick('parsing-errors')}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-lg hover:scale-105 hover:border-blue-300 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <Eye className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Parsing Errors</p>
                  <p className="text-3xl font-bold text-gray-900">{currentData.totalParsingErrors}</p>
                  <p className="text-sm text-red-600 mt-1">Click to view error details</p>
                </div>
              </div>

              {/* Total Matching Errors */}
              <div 
                onClick={() => onTileClick('matching-errors')}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-lg hover:scale-105 hover:border-blue-300 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                  </div>
                  <Eye className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Matching Errors</p>
                  <p className="text-3xl font-bold text-gray-900">{currentData.totalMatchingErrors}</p>
                  <p className="text-sm text-orange-600 mt-1">Click to view error details</p>
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

export default FileWorkflowDashboard;