import React from 'react';
import { Search, FileText } from 'lucide-react';
import type { Agent } from '../shared/types';

interface FileWorkflowDashboardTotalFilesProps {
  agent: Agent;
  onBack: () => void;
}

const FileWorkflowDashboardTotalFiles: React.FC<FileWorkflowDashboardTotalFilesProps> = ({ agent, onBack }) => {
  const processedFiles = [
    { name: 'invoices_batch_001.pdf', status: 'success', processedAt: '2025-01-15 14:23', size: '2.3 MB' },
    { name: 'invoices_batch_002.pdf', status: 'success', processedAt: '2025-01-15 14:18', size: '1.8 MB' },
    { name: 'contract_signed.pdf', status: 'success', processedAt: '2025-01-15 14:12', size: '945 KB' },
    { name: 'receipt_large.pdf', status: 'parsing_error', processedAt: '2025-01-15 14:05', size: '12.4 MB' },
    { name: 'invoice_damaged.pdf', status: 'matching_error', processedAt: '2025-01-15 13:58', size: '756 KB' },
    { name: 'vendor_invoice_003.pdf', status: 'success', processedAt: '2025-01-15 13:45', size: '3.1 MB' },
    { name: 'receipt_small.pdf', status: 'success', processedAt: '2025-01-15 13:30', size: '456 KB' },
    { name: 'contract_amendment.pdf', status: 'success', processedAt: '2025-01-15 13:15', size: '1.2 MB' }
  ];

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'parsing_error': return 'text-red-600 bg-red-100';
      case 'matching_error': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const successCount = processedFiles.filter(file => file.status === 'success').length;
  const errorCount = processedFiles.length - successCount;

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
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Total Files Processed</h1>
                  <p className="text-sm text-gray-500">{agent.name} • Processing Details</p>
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
                <h3 className="text-lg font-semibold text-gray-900">File Processing Details</h3>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-500">
                    {processedFiles.length} total files
                  </div>
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search files..."
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-600">{successCount}</div>
                  <div className="text-sm text-green-700">Successfully Processed</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                  <div className="text-sm text-red-700">With Errors</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">{processedFiles.length}</div>
                  <div className="text-sm text-blue-700">Total Files</div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">File Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Processed At</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedFiles.map((file, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900">{file.name}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(file.status)}`}>
                            {file.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{file.processedAt}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{file.size}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileWorkflowDashboardTotalFiles; 