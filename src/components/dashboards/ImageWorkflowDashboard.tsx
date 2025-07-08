import React, { useState } from 'react';
import { Image, CheckCircle, Settings, Eye, Calendar, ChevronDown, BarChart3, Camera, Palette, Zap } from 'lucide-react';
import type { Agent, DateFilter, DateRange } from '../../components/shared/types';

interface ImageWorkflowDashboardProps {
  agent: Agent;
  onTileClick: (tileType: string) => void;
  onBackToHome: () => void;
}

const ImageWorkflowDashboard: React.FC<ImageWorkflowDashboardProps> = ({ 
  agent, 
  onTileClick, 
  onBackToHome 
}) => {
  const [dateFilter, setDateFilter] = useState<DateFilter>('today');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customDateRange, setCustomDateRange] = useState<DateRange>({ start: '', end: '' });

  // Mock data for Image Workflow
  const getImageWorkflowData = (filter: DateFilter) => {
    const baseData = {
      totalImagesProcessed: 1247,
      ocrAccuracy: 94.2,
      imageQualityScore: 87.5,
      totalProcessingErrors: 23,
      averageProcessingTime: 2.3
    };

    switch (filter) {
      case 'today':
        return { ...baseData, totalImagesProcessed: 156, totalProcessingErrors: 3 };
      case 'last-7-days':
        return { ...baseData, totalImagesProcessed: 847, totalProcessingErrors: 18 };
      default:
        return baseData;
    }
  };

  const currentData = getImageWorkflowData(dateFilter);

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
                <div className="p-2 bg-purple-100 rounded-lg">
                  <agent.icon className="w-5 h-5 text-purple-600" />
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
            <button className="py-4 px-1 border-b-2 font-medium text-sm border-purple-500 text-purple-600">
              Dashboard
            </button>
            <button className="py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700">
              Image Analysis
            </button>
            <button className="py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700">
              OCR Results
            </button>
            <button className="py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700">
              Processing History
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Date Filter */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Image Processing Overview</h2>
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
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${dateFilter === 'today' ? 'bg-purple-50 text-purple-700' : 'text-gray-700'}`}
                    >
                      Today
                    </button>
                    <button
                      onClick={() => handleDateFilterChange('last-7-days')}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${dateFilter === 'last-7-days' ? 'bg-purple-50 text-purple-700' : 'text-gray-700'}`}
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
                            className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">To</label>
                          <input
                            type="date"
                            value={customDateRange.end}
                            onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                            className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                          />
                        </div>
                        <div className="flex space-x-2 pt-2">
                          <button
                            onClick={handleCustomDateSubmit}
                            disabled={!customDateRange.start || !customDateRange.end}
                            className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
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
              {/* Total Images Processed */}
              <div 
                onClick={() => onTileClick('total-images')}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-lg hover:scale-105 hover:border-purple-300 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Camera className="w-6 h-6 text-purple-600" />
                  </div>
                  <Eye className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Images Processed</p>
                  <p className="text-3xl font-bold text-gray-900">{currentData.totalImagesProcessed.toLocaleString()}</p>
                  <p className="text-sm text-purple-600 mt-1">Click to view details</p>
                </div>
              </div>

              {/* OCR Accuracy */}
              <div 
                onClick={() => onTileClick('ocr-accuracy')}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-lg hover:scale-105 hover:border-purple-300 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <Eye className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">OCR Accuracy</p>
                  <p className="text-3xl font-bold text-gray-900">{currentData.ocrAccuracy}%</p>
                  <p className="text-sm text-green-600 mt-1">Click to view by field</p>
                </div>
              </div>

              {/* Image Quality Score */}
              <div 
                onClick={() => onTileClick('image-quality')}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-lg hover:scale-105 hover:border-purple-300 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Palette className="w-6 h-6 text-blue-600" />
                  </div>
                  <Eye className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Image Quality Score</p>
                  <p className="text-3xl font-bold text-gray-900">{currentData.imageQualityScore}%</p>
                  <p className="text-sm text-blue-600 mt-1">Click to view analysis</p>
                </div>
              </div>

              {/* Processing Errors */}
              <div 
                onClick={() => onTileClick('processing-errors')}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-lg hover:scale-105 hover:border-purple-300 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <Zap className="w-6 h-6 text-red-600" />
                  </div>
                  <Eye className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Processing Errors</p>
                  <p className="text-3xl font-bold text-gray-900">{currentData.totalProcessingErrors}</p>
                  <p className="text-sm text-red-600 mt-1">Click to view error details</p>
                </div>
              </div>

              {/* Average Processing Time */}
              <div 
                onClick={() => onTileClick('processing-time')}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-lg hover:scale-105 hover:border-purple-300 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Zap className="w-6 h-6 text-orange-600" />
                  </div>
                  <Eye className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Processing Time</p>
                  <p className="text-3xl font-bold text-gray-900">{currentData.averageProcessingTime}s</p>
                  <p className="text-sm text-orange-600 mt-1">Click to view performance</p>
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

export default ImageWorkflowDashboard; 