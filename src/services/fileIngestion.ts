import type { DateFilter } from '../components/shared/types';

export interface FileIngestionResult {
  success: boolean;
  message: string;
  fileId?: string;
  processingTime?: number;
  extractedData?: any;
  errors?: string[];
}

export interface FileProcessingStatus {
  fileId: string;
  fileName: string;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  progress: number;
  startTime: Date;
  endTime?: Date;
  extractedData?: any;
  errors?: string[];
}

// In-memory storage for file processing status
const fileProcessingStatus: Map<string, FileProcessingStatus> = new Map();

export const fileIngestionService = {
  // Upload and process a file
  async uploadAndProcessFile(
    file: File,
    agentId: number,
    processingOptions?: {
      extractText?: boolean;
      extractTables?: boolean;
      extractKeyValuePairs?: boolean;
      confidenceThreshold?: number;
    }
  ): Promise<FileIngestionResult> {
    try {
      console.log('📁 Starting file ingestion:', file.name);
      
      // Generate unique file ID
      const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create processing status
      const status: FileProcessingStatus = {
        fileId,
        fileName: file.name,
        status: 'uploading',
        progress: 0,
        startTime: new Date()
      };
      
      fileProcessingStatus.set(fileId, status);
      
      // Simulate file upload
      await this.simulateFileUpload(file, status);
      
      // Simulate file processing
      await this.simulateFileProcessing(file, status, processingOptions);
      
      // Update status to completed
      status.status = 'completed';
      status.progress = 100;
      status.endTime = new Date();
      
      // Generate mock extracted data
      status.extractedData = this.generateMockExtractedData(file.name);
      
      console.log('✅ File processing completed:', file.name);
      
      return {
        success: true,
        message: 'File processed successfully',
        fileId,
        processingTime: status.endTime.getTime() - status.startTime.getTime(),
        extractedData: status.extractedData
      };
      
    } catch (error) {
      console.error('❌ File processing failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'File processing failed',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  },

  // Get processing status for a file
  getFileProcessingStatus(fileId: string): FileProcessingStatus | null {
    return fileProcessingStatus.get(fileId) || null;
  },

  // Get all processing files for an agent
  getAgentProcessingFiles(agentId: number): FileProcessingStatus[] {
    return Array.from(fileProcessingStatus.values()).filter(
      status => status.status !== 'completed'
    );
  },

  // Simulate file upload
  async simulateFileUpload(file: File, status: FileProcessingStatus): Promise<void> {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          status.status = 'processing';
          status.progress = progress;
          clearInterval(interval);
          resolve();
        } else {
          status.progress = progress;
        }
      }, 100);
    });
  },

  // Simulate file processing
  async simulateFileProcessing(
    file: File, 
    status: FileProcessingStatus,
    options?: any
  ): Promise<void> {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          status.progress = progress;
          clearInterval(interval);
          resolve();
        } else {
          status.progress = progress;
        }
      }, 200);
    });
  },

  // Generate mock extracted data based on file type
  generateMockExtractedData(fileName: string): any {
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    
    switch (fileExtension) {
      case 'pdf':
        return {
          documentType: 'invoice',
          extractedText: 'Sample invoice text content...',
          keyValuePairs: {
            'Invoice Number': 'INV-2024-001',
            'Date': '2024-01-15',
            'Amount': '$1,250.00',
            'Vendor': 'Sample Vendor Inc.'
          },
          tables: [
            {
              title: 'Line Items',
              data: [
                ['Item', 'Quantity', 'Price', 'Total'],
                ['Product A', '2', '$500.00', '$1,000.00'],
                ['Service B', '1', '$250.00', '$250.00']
              ]
            }
          ],
          confidence: 95.5
        };
        
      case 'csv':
        return {
          documentType: 'data_export',
          rows: 150,
          columns: 8,
          headers: ['ID', 'Name', 'Email', 'Department', 'Salary', 'StartDate', 'Status', 'Location'],
          sampleData: [
            ['1', 'John Doe', 'john@example.com', 'Engineering', '$75,000', '2023-01-15', 'Active', 'New York'],
            ['2', 'Jane Smith', 'jane@example.com', 'Marketing', '$65,000', '2023-02-20', 'Active', 'Los Angeles']
          ]
        };
        
      case 'xlsx':
      case 'xls':
        return {
          documentType: 'spreadsheet',
          sheets: ['Sheet1', 'Summary', 'Data'],
          activeSheet: 'Sheet1',
          cellCount: 1250,
          formulas: 45,
          charts: 3
        };
        
      default:
        return {
          documentType: 'unknown',
          extractedText: 'Text content from file...',
          fileSize: '2.3 MB',
          processingNotes: 'File processed with default settings'
        };
    }
  }
}; 