import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { Agent } from '../shared/types';

interface FileWorkflowDashboardMatchingErrorProps {
  agent: Agent;
  onBack: () => void;
}

const FileWorkflowDashboardMatchingError: React.FC<FileWorkflowDashboardMatchingErrorProps> = ({ agent, onBack }) => {
  const matchingErrors = [
    { 
      file: 'new_vendor_invoice.pdf', 
      error: 'Vendor not found in lookup table', 
      vendor: 'Unknown Supplier LLC', 
      time: '2025-01-15 13:58',
      fileSize: '1.2 MB',
      confidence: 85
    },
    { 
      file: 'invoice_format_new.pdf', 
      error: 'Amount format mismatch', 
      amount: '$1,234.56', 
      time: '2025-01-15 12:15',
      fileSize: '856 KB',
      confidence: 72
    },
    { 
      file: 'international_invoice.pdf', 
      error: 'Currency code not recognized', 
      currency: 'GBP', 
      time: '2025-01-14 18:30',
      fileSize: '2.1 MB',
      confidence: 0
    },
    { 
      file: 'partial_match_invoice.pdf', 
      error: 'Partial vendor match found', 
      vendor: 'TechCorp (partial match)', 
      time: '2025-01-14 15:45',
      fileSize: '1.5 MB',
      confidence: 45
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Dashboard</span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Matching Error Details</h1>
                  <p className="text-sm text-gray-500">{agent.name} • Vendor Matching</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Content */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Vendor Matching Errors</h3>
                <div className="text-sm text-gray-500">
                  {matchingErrors.length} files with matching errors
                </div>
              </div>
              
              {matchingErrors.map((error, index) => (
                <div key={index} className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-gray-900">{error.file}</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">{error.fileSize}</span>
                          {error.confidence > 0 && (
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              error.confidence < 50 ? 'bg-red-100 text-red-800' : 
                              error.confidence < 80 ? 'bg-orange-100 text-orange-800' : 
                              'bg-green-100 text-green-800'
                            }`}>
                              {error.confidence}% match
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-orange-700 font-medium">{error.error}</p>
                      
                      <div className="mt-3 text-xs text-gray-600 space-y-1">
                        {error.vendor && (
                          <p>Vendor: {error.vendor}</p>
                        )}
                        {error.amount && (
                          <p>Amount: {error.amount}</p>
                        )}
                        {error.currency && (
                          <p>Currency: {error.currency}</p>
                        )}
                        <p className="mt-1">{error.time}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileWorkflowDashboardMatchingError; 