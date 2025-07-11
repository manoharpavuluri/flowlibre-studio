import type { DateFilter } from '../components/shared/types';

export interface FileProcessingError {
  file: string;
  fileSize: string;
  service: string;
  error: string;
  details: string;
  confidence: number;
  attemptCount: number;
  time: string;
}

export const getFileProcessingErrors = (
  errorType: 'parsing' | 'matching',
  dateFilter: DateFilter
): FileProcessingError[] => {
  // Direct feature logic - no API calls
  const parsingErrors: FileProcessingError[] = [
    {
      file: 'invoice_2024_001.pdf',
      fileSize: '2.3 MB',
      service: 'Azure Document Intelligence',
      error: 'OCR confidence below threshold',
      details: 'Text extraction failed due to poor image quality and low confidence scores across multiple regions.',
      confidence: 45,
      attemptCount: 3,
      time: '2024-01-15 14:32:15'
    },
    {
      file: 'receipt_jan_15.pdf',
      fileSize: '1.8 MB',
      service: 'Azure Document Intelligence',
      error: 'Unsupported file format',
      details: 'File contains corrupted data and cannot be processed by the document intelligence service.',
      confidence: 0,
      attemptCount: 1,
      time: '2024-01-15 13:45:22'
    },
    {
      file: 'contract_draft.docx',
      fileSize: '4.1 MB',
      service: 'Azure Document Intelligence',
      error: 'Timeout during processing',
      details: 'Document processing exceeded maximum time limit due to complex layout and large file size.',
      confidence: 62,
      attemptCount: 2,
      time: '2024-01-15 12:18:45'
    }
  ];

  const matchingErrors: FileProcessingError[] = [
    {
      file: 'invoice_2024_002.pdf',
      fileSize: '1.9 MB',
      service: 'Azure Document Intelligence',
      error: 'Field mapping failed',
      details: 'Unable to match extracted fields to expected schema due to inconsistent data format.',
      confidence: 78,
      attemptCount: 2,
      time: '2024-01-15 15:20:30'
    },
    {
      file: 'receipt_jan_16.pdf',
      fileSize: '1.2 MB',
      service: 'Azure Document Intelligence',
      error: 'Schema validation failed',
      details: 'Extracted data does not match required business rules and validation criteria.',
      confidence: 82,
      attemptCount: 1,
      time: '2024-01-15 16:45:12'
    }
  ];

  return errorType === 'parsing' ? parsingErrors : matchingErrors;
}; 