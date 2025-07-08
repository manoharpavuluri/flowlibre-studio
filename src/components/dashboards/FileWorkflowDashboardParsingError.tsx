import React from 'react';
import { XCircle } from 'lucide-react';
import type { Agent } from '../shared/types';

interface FileWorkflowDashboardParsingErrorProps {
  agent: Agent;
  onBack: () => void;
}

const FileWorkflowDashboardParsingError: React.FC<FileWorkflowDashboardParsingErrorProps> = ({ agent, onBack }) => {
  // This data would typically come from an API or props
  const parsingErrors = [
    { 
      file: 'corrupted_invoice_001.pdf', 
      error: 'Azure Document Intelligence failed to extract text',
      details: 'File appears to be corrupted or in unsupported format',
      confidence: 0,
      service: 'Azure Document Intelligence',
      time: '2025-01-15 14:05',
      fileSize: '2.3 MB',
      attemptCount: 3
    },
    { 
      file: 'scanned_receipt.pdf', 
      error: 'OCR confidence below threshold',
      details: 'Text extraction confidence score: 65% (minimum required: 80%)',
      confidence: 65,
      service: 'Azure Document Intelligence',
      time: '2025-01-14 16:23',
      fileSize: '1.8 MB',
      attemptCount: 1
    },
    { 
      file: 'foreign_language.pdf', 
      error: 'Unsupported language detected',
      details: 'Document contains text in Spanish, but only English is supported',
      confidence: 0,
      service: 'Azure Document Intelligence',
      time: '2025-01-14 11:45',
      fileSize: '945 KB',
      attemptCount: 1
    },
    { 
      file: 'blurry_invoice.pdf', 
      error: 'Image quality too low for OCR',
      details: 'Image resolution insufficient for reliable text extraction',
      confidence: 45,
      service: 'Azure Document Intelligence',
      time: '2025-01-14 10:15',
      fileSize: '3.2 MB',
      attemptCount: 2
    },
    { 
      file: 'password_protected.pdf', 
      error: 'Password-protected document',
      details: 'Document is encrypted and requires password for access',
      confidence: 0,
      service: 'Azure Document Intelligence',
      time: '2025-01-14 09:30',
      fileSize: '1.5 MB',
      attemptCount: 1
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
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Parsing Error Details</h1>
                  <p className="text-sm text-gray-500">{agent.name} • Azure Document Intelligence</p>
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
                <h3 className="text-lg font-semibold text-gray-900">Azure Document Intelligence Parsing Errors</h3>
                <div className="text-sm text-gray-500">
                  {parsingErrors.length} files with parsing errors
                </div>
              </div>
              
              {parsingErrors.map((error, index) => (
                <div key={index} className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-start space-x-3">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-gray-900">{error.file}</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">{error.fileSize}</span>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {error.service}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-red-700 font-medium">{error.error}</p>
                      <p className="text-sm text-gray-600 mt-1">{error.details}</p>
                      
                      <div className="flex items-center space-x-4 mt-3 text-xs text-gray-600">
                        {error.confidence > 0 && (
                          <div className="flex items-center space-x-1">
                            <span>Confidence:</span>
                            <span className={`font-medium ${error.confidence < 50 ? 'text-red-600' : error.confidence < 80 ? 'text-orange-600' : 'text-green-600'}`}>
                              {error.confidence}%
                            </span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <span>Attempts:</span>
                          <span className="font-medium">{error.attemptCount}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>Time:</span>
                          <span className="font-medium">{error.time}</span>
                        </div>
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

export default FileWorkflowDashboardParsingError; 