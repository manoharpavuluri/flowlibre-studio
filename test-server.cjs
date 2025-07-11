// Simple test server to demonstrate API integration
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Test server is running!'
  });
});

// Mock file processing metrics endpoint
app.get('/api/agents/:id/file-processing/metrics', (req, res) => {
  const { id } = req.params;
  const { dateFilter, start, end } = req.query;

  console.log(`📡 API Request: Agent ${id}, DateFilter: ${dateFilter}, Start: ${start}, End: ${end}`);

  let mockData;
  if (dateFilter === 'today') {
    mockData = {
      totalFilesProcessed: Math.floor(Math.random() * 100) + 50,
      successRateParsing: Math.floor(Math.random() * 20) + 80,
      successRateMatching: Math.floor(Math.random() * 20) + 80,
      totalParsingErrors: Math.floor(Math.random() * 10),
      totalMatchingErrors: Math.floor(Math.random() * 10)
    };
  } else if (dateFilter === 'last-7-days') {
    mockData = {
      totalFilesProcessed: Math.floor(Math.random() * 500) + 200,
      successRateParsing: Math.floor(Math.random() * 10) + 90,
      successRateMatching: Math.floor(Math.random() * 10) + 90,
      totalParsingErrors: Math.floor(Math.random() * 30),
      totalMatchingErrors: Math.floor(Math.random() * 30)
    };
  } else if (dateFilter === 'date-range' && start && end) {
    mockData = {
      totalFilesProcessed: Math.floor(Math.random() * 1000) + 300,
      successRateParsing: Math.floor(Math.random() * 5) + 95,
      successRateMatching: Math.floor(Math.random() * 5) + 95,
      totalParsingErrors: Math.floor(Math.random() * 50),
      totalMatchingErrors: Math.floor(Math.random() * 50)
    };
  } else {
    mockData = {
      totalFilesProcessed: 0,
      successRateParsing: 0,
      successRateMatching: 0,
      totalParsingErrors: 0,
      totalMatchingErrors: 0
    };
  }

  // Simulate some processing time
  setTimeout(() => {
    res.json({
      success: true,
      data: mockData,
      message: 'Data from real API!'
    });
  }, 500); // Simulate network delay
});

// Mock file processing errors endpoint
app.get('/api/agents/:id/file-processing/errors', (req, res) => {
  const { id } = req.params;
  const { type, dateFilter, start, end } = req.query;

  let errors = [];
  if (type === 'parsing') {
    if (dateFilter === 'today') {
      errors = [
        { file: 'corrupted_invoice_001.pdf', error: 'Azure Document Intelligence failed to extract text', details: 'File appears to be corrupted or in unsupported format', confidence: 0, service: 'Azure Document Intelligence', time: '2025-01-15 14:05', fileSize: '2.3 MB', attemptCount: 3 },
        { file: 'scanned_receipt.pdf', error: 'OCR confidence below threshold', details: 'Text extraction confidence score: 65% (minimum required: 80%)', confidence: 65, service: 'Azure Document Intelligence', time: '2025-01-14 16:23', fileSize: '1.8 MB', attemptCount: 1 },
        { file: 'foreign_language.pdf', error: 'Unsupported language detected', details: 'Document contains text in Spanish, but only English is supported', confidence: 0, service: 'Azure Document Intelligence', time: '2025-01-14 11:45', fileSize: '945 KB', attemptCount: 1 },
        { file: 'blurry_invoice.pdf', error: 'Image quality too low for OCR', details: 'Image resolution insufficient for reliable text extraction', confidence: 45, service: 'Azure Document Intelligence', time: '2025-01-14 10:15', fileSize: '3.2 MB', attemptCount: 2 },
        { file: 'password_protected.pdf', error: 'Password-protected document', details: 'Document is encrypted and requires password for access', confidence: 0, service: 'Azure Document Intelligence', time: '2025-01-14 09:30', fileSize: '1.5 MB', attemptCount: 1 }
      ];
    } else if (dateFilter === 'last-7-days') {
      errors = [
        { file: 'corrupted_invoice_001.pdf', error: 'Azure Document Intelligence failed to extract text', details: 'File appears to be corrupted or in unsupported format', confidence: 0, service: 'Azure Document Intelligence', time: '2025-01-15 14:05', fileSize: '2.3 MB', attemptCount: 3 },
        { file: 'scanned_receipt.pdf', error: 'OCR confidence below threshold', details: 'Text extraction confidence score: 65% (minimum required: 80%)', confidence: 65, service: 'Azure Document Intelligence', time: '2025-01-14 16:23', fileSize: '1.8 MB', attemptCount: 1 },
        { file: 'foreign_language.pdf', error: 'Unsupported language detected', details: 'Document contains text in Spanish, but only English is supported', confidence: 0, service: 'Azure Document Intelligence', time: '2025-01-14 11:45', fileSize: '945 KB', attemptCount: 1 },
        { file: 'blurry_invoice.pdf', error: 'Image quality too low for OCR', details: 'Image resolution insufficient for reliable text extraction', confidence: 45, service: 'Azure Document Intelligence', time: '2025-01-14 10:15', fileSize: '3.2 MB', attemptCount: 2 },
        { file: 'password_protected.pdf', error: 'Password-protected document', details: 'Document is encrypted and requires password for access', confidence: 0, service: 'Azure Document Intelligence', time: '2025-01-14 09:30', fileSize: '1.5 MB', attemptCount: 1 },
        { file: 'missing_metadata.pdf', error: 'Missing required metadata', details: 'Document is missing invoice number field', confidence: 0, service: 'Azure Document Intelligence', time: '2025-01-13 13:10', fileSize: '2.1 MB', attemptCount: 1 },
        { file: 'large_file.pdf', error: 'File size exceeds limit', details: 'File size is 25 MB, exceeds 20 MB limit', confidence: 0, service: 'Azure Document Intelligence', time: '2025-01-12 17:45', fileSize: '25 MB', attemptCount: 1 }
      ];
    } else if (dateFilter === 'date-range' || (start && end)) {
      errors = [
        { file: 'corrupted_invoice_001.pdf', error: 'Azure Document Intelligence failed to extract text', details: 'File appears to be corrupted or in unsupported format', confidence: 0, service: 'Azure Document Intelligence', time: '2025-01-15 14:05', fileSize: '2.3 MB', attemptCount: 3 },
        { file: 'scanned_receipt.pdf', error: 'OCR confidence below threshold', details: 'Text extraction confidence score: 65% (minimum required: 80%)', confidence: 65, service: 'Azure Document Intelligence', time: '2025-01-14 16:23', fileSize: '1.8 MB', attemptCount: 1 },
        { file: 'foreign_language.pdf', error: 'Unsupported language detected', details: 'Document contains text in Spanish, but only English is supported', confidence: 0, service: 'Azure Document Intelligence', time: '2025-01-14 11:45', fileSize: '945 KB', attemptCount: 1 },
        { file: 'blurry_invoice.pdf', error: 'Image quality too low for OCR', details: 'Image resolution insufficient for reliable text extraction', confidence: 45, service: 'Azure Document Intelligence', time: '2025-01-14 10:15', fileSize: '3.2 MB', attemptCount: 2 },
        { file: 'password_protected.pdf', error: 'Password-protected document', details: 'Document is encrypted and requires password for access', confidence: 0, service: 'Azure Document Intelligence', time: '2025-01-14 09:30', fileSize: '1.5 MB', attemptCount: 1 },
        { file: 'missing_metadata.pdf', error: 'Missing required metadata', details: 'Document is missing invoice number field', confidence: 0, service: 'Azure Document Intelligence', time: '2025-01-13 13:10', fileSize: '2.1 MB', attemptCount: 1 },
        { file: 'large_file.pdf', error: 'File size exceeds limit', details: 'File size is 25 MB, exceeds 20 MB limit', confidence: 0, service: 'Azure Document Intelligence', time: '2025-01-12 17:45', fileSize: '25 MB', attemptCount: 1 },
        { file: 'unsupported_format.tiff', error: 'Unsupported file format', details: 'TIFF format is not supported', confidence: 0, service: 'Azure Document Intelligence', time: '2025-01-11 08:30', fileSize: '4.5 MB', attemptCount: 1 }
      ];
    }
  }
  // You can add similar logic for 'matching' errors if needed
  res.json({ data: errors, success: true });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Test server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoint: http://localhost:${PORT}/api/agents/1/file-processing/metrics`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app; 