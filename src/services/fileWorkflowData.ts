import type { DateFilter } from '../components/shared/types';

export interface FileWorkflowData {
  totalFilesProcessed: number;
  successRateParsing: number;
  successRateMatching: number;
  totalParsingErrors: number;
  totalMatchingErrors: number;
}

export const getFileWorkflowData = (dateFilter: DateFilter): FileWorkflowData => {
  const dataMap: Record<DateFilter, FileWorkflowData> = {
    'today': {
      totalFilesProcessed: 25,
      successRateParsing: 80.0, // (25-5)/25 = 20/25 = 80%
      successRateMatching: 84.0, // (25-4)/25 = 21/25 = 84%
      totalParsingErrors: 5, // Matches FileWorkflowDashboardParsingError
      totalMatchingErrors: 4  // Matches FileWorkflowDashboardMatchingError
    },
    'last-7-days': {
      totalFilesProcessed: 187,
      successRateParsing: 98.4,
      successRateMatching: 94.1,
      totalParsingErrors: 12,
      totalMatchingErrors: 11
    },
    'date-range': {
      totalFilesProcessed: 456,
      successRateParsing: 97.8,
      successRateMatching: 93.6,
      totalParsingErrors: 25,
      totalMatchingErrors: 29
    }
  };

  return dataMap[dateFilter];
}; 