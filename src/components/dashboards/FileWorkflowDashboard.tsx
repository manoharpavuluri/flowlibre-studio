import React, { useState, useCallback, useEffect } from 'react';
import { 
  Calendar, 
  ChevronDown, 
  Eye, 
  FileText, 
  CheckCircle, 
  Database, 
  AlertTriangle, 
  BarChart3,
  Upload
} from 'lucide-react';
import type { Agent, DateFilter, DateRange } from '../shared/types';
import { getFileWorkflowData } from '../../services/fileWorkflowData';
import FileUpload from '../FileUpload';

interface FileWorkflowDashboardProps {
  agent: Agent;
  onTileClick: (tileType: string, dateFilter: DateFilter, customDateRange: DateRange) => void;
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

  // Use the smart data service with API integration
  const [currentData, setCurrentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔄 Getting file workflow data for dateFilter:', dateFilter);
        // Direct integration - no API calls
        const data = getFileWorkflowData(dateFilter);
        setCurrentData(data);
      } catch (err) {
        console.error('Failed to get data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [agent.id, dateFilter]);

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

  // Show loading state
  if (loading && !currentData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Dashboard</h3>
              <p className="text-gray-600">Fetching latest metrics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !currentData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Data</h3>
              <p className="text-gray-600 mb-4">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Use fallback data if API fails
  const metrics = (currentData?.data || currentData) || {
    totalFilesProcessed: 0,
    successRateParsing: 0,
    successRateMatching: 0,
    totalParsingErrors: 0,
    totalMatchingErrors: 0,
  };

  // Debug: Log the data we're receiving
  console.log('📊 Current workflow data:', currentData);
  console.log('📊 Processed metrics:', metrics);

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
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Home</span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">{agent.name}</h1>
                  <p className="text-sm text-gray-500">File Workflow • {agent.status}</p>
                </div>
              </div>
            </div>
            
            {/* Navigation Tabs */}
            <nav className="flex space-x-8">
              <button className="py-4 px-1 border-b-2 font-medium text-sm border-blue-500 text-blue-600">
                Dashboard
              </button>
              <button className="py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700">
                Design Agent
              </button>
              <button className="py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700">
                Run History
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* File Upload Section */}
          {agent.status === 'active' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Upload className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">File Ingestion</h3>
              </div>
              <FileUpload 
                agentId={agent.id} 
                onFileProcessed={(result) => {
                  console.log('📁 File processed:', result);
                  // You can add logic here to update metrics or refresh data
                }}
              />
            </div>
          )}

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
                onClick={() => onTileClick('total-files', dateFilter, customDateRange)}
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
                  <p className="text-3xl font-bold text-gray-900">{metrics.totalFilesProcessed.toLocaleString()}</p>
                  <p className="text-sm text-blue-600 mt-1">Click to view details</p>
                </div>
              </div>

              {/* Success Rate (File Reading) */}
              <div 
                onClick={() => onTileClick('parsing-success', dateFilter, customDateRange)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-lg hover:scale-105 hover:border-blue-300 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <Eye className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Rate (File Reading)</p>
                  <p className="text-3xl font-bold text-gray-900">{metrics.successRateParsing}%</p>
                  <p className="text-sm text-green-600 mt-1">Click to view by field</p>
                </div>
              </div>

              {/* Success Rate (Matching) */}
              <div 
                onClick={() => onTileClick('matching-success', dateFilter, customDateRange)}
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
                  <p className="text-3xl font-bold text-gray-900">{metrics.successRateMatching}%</p>
                  <p className="text-sm text-purple-600 mt-1">Click to view by vendor</p>
                </div>
              </div>

              {/* Total File Reading Errors */}
              <div 
                onClick={() => onTileClick('parsing-errors', dateFilter, customDateRange)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-lg hover:scale-105 hover:border-blue-300 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <Eye className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total File Reading Errors</p>
                  <p className="text-3xl font-bold text-gray-900">{metrics.totalParsingErrors}</p>
                  <p className="text-sm text-red-600 mt-1">Click to view error details</p>
                </div>
              </div>

              {/* Total Matching Errors */}
              <div 
                onClick={() => onTileClick('matching-errors', dateFilter, customDateRange)}
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
                  <p className="text-3xl font-bold text-gray-900">{metrics.totalMatchingErrors}</p>
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