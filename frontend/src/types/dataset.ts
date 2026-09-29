export interface Dataset {
  datasetId: string;
  projectId: string;
  originalName: string;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  status: 'PENDING' | 'UPLOADED' | 'PROCESSING' | 'PROCESSED' | 'FAILED';
  createdAt?: string;
}
