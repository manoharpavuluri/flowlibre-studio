import React, { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { fileIngestionService, type FileIngestionResult, type FileProcessingStatus } from '../services/fileIngestion';

interface FileUploadProps {
  agentId: number;
  onFileProcessed?: (result: FileIngestionResult) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ agentId, onFileProcessed }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingFiles, setProcessingFiles] = useState<FileProcessingStatus[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<FileIngestionResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    setIsProcessing(true);

    for (const file of fileArray) {
      try {
        console.log('📁 Processing file:', file.name);
        
        const result = await fileIngestionService.uploadAndProcessFile(file, agentId, {
          extractText: true,
          extractTables: true,
          extractKeyValuePairs: true,
          confidenceThreshold: 80
        });

        if (result.success) {
          setUploadedFiles(prev => [...prev, result]);
          onFileProcessed?.(result);
          console.log('✅ File processed successfully:', file.name);
        } else {
          console.error('❌ File processing failed:', file.name, result.message);
        }
      } catch (error) {
        console.error('❌ Error processing file:', file.name, error);
      }
    }

    setIsProcessing(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.fileId !== fileId));
  };

  return (
    <div className="space-y-4">
      {/* File Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.csv,.xlsx,.xls,.txt,.doc,.docx"
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        <div className="space-y-3">
          <Upload className="w-8 h-8 mx-auto text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">
              {isProcessing ? 'Processing files...' : 'Drop files here or click to upload'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supports PDF, CSV, Excel, Word, and text files
            </p>
          </div>
          
          {!isProcessing && (
            <button
              onClick={openFileDialog}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Choose Files
            </button>
          )}
        </div>
      </div>

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
          <span className="text-sm text-blue-600">Processing files...</span>
        </div>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Processed Files</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <div key={file.fileId} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {file.extractedData?.documentType || 'Unknown'} Document
                    </p>
                    <p className="text-xs text-gray-500">
                      Processing time: {file.processingTime ? `${file.processingTime}ms` : 'N/A'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(file.fileId!)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File Processing Details */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Extraction Results</h4>
          {uploadedFiles.map((file) => (
            <div key={file.fileId} className="p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-900">
                    {file.extractedData?.documentType || 'Unknown'} Document
                  </span>
                </div>
                
                {file.extractedData?.keyValuePairs && (
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Key-Value Pairs:</p>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      {Object.entries(file.extractedData.keyValuePairs).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-600">{key}:</span>
                          <span className="font-medium">{value as string}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {file.extractedData?.confidence && (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-600">Confidence:</span>
                    <span className={`text-xs font-medium ${
                      file.extractedData.confidence >= 90 ? 'text-green-600' :
                      file.extractedData.confidence >= 70 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {file.extractedData.confidence}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload; 