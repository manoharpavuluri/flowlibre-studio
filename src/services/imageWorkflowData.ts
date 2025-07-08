import type { DateFilter } from '../components/shared/types';

export interface ImageWorkflowData {
  totalImagesProcessed: number;
  successRateOCR: number;
  successRateClassification: number;
  totalOCRErrors: number;
  totalClassificationErrors: number;
  averageProcessingTime: number;
}

export const getImageWorkflowData = (dateFilter: DateFilter): ImageWorkflowData => {
  const dataMap: Record<DateFilter, ImageWorkflowData> = {
    'today': {
      totalImagesProcessed: 45,
      successRateOCR: 92.3,
      successRateClassification: 88.7,
      totalOCRErrors: 3,
      totalClassificationErrors: 5,
      averageProcessingTime: 2.4
    },
    'last-7-days': {
      totalImagesProcessed: 312,
      successRateOCR: 94.1,
      successRateClassification: 91.2,
      totalOCRErrors: 18,
      totalClassificationErrors: 27,
      averageProcessingTime: 2.1
    },
    'date-range': {
      totalImagesProcessed: 789,
      successRateOCR: 93.8,
      successRateClassification: 90.5,
      totalOCRErrors: 49,
      totalClassificationErrors: 75,
      averageProcessingTime: 2.3
    }
  };

  return dataMap[dateFilter];
}; 