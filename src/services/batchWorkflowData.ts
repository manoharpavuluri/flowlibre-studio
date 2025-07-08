import type { DateFilter } from '../components/shared/types';

export interface BatchWorkflowData {
  totalBatchesProcessed: number;
  successRateBatchProcessing: number;
  averageBatchSize: number;
  totalBatchErrors: number;
  totalPartialFailures: number;
  averageProcessingTime: number;
}

export const getBatchWorkflowData = (dateFilter: DateFilter): BatchWorkflowData => {
  const dataMap: Record<DateFilter, BatchWorkflowData> = {
    'today': {
      totalBatchesProcessed: 8,
      successRateBatchProcessing: 87.5,
      averageBatchSize: 23.4,
      totalBatchErrors: 1,
      totalPartialFailures: 2,
      averageProcessingTime: 45.2
    },
    'last-7-days': {
      totalBatchesProcessed: 67,
      successRateBatchProcessing: 89.6,
      averageBatchSize: 25.1,
      totalBatchErrors: 7,
      totalPartialFailures: 12,
      averageProcessingTime: 42.8
    },
    'date-range': {
      totalBatchesProcessed: 156,
      successRateBatchProcessing: 91.2,
      averageBatchSize: 24.7,
      totalBatchErrors: 14,
      totalPartialFailures: 23,
      averageProcessingTime: 44.1
    }
  };

  return dataMap[dateFilter];
}; 