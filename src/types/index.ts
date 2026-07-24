/**
 * Core Domain Models for NailStudio Manicure PWA
 */

export type GelType = 'base' | 'builder' | 'color' | 'top' | 'effect' | 'other';

export interface Customer {
  id?: number;
  name: string;
  phone: string;
  email?: string;
  instagram?: string;
  note?: string;
  createdAt: string;
  lastVisitAt?: string;
  photoUrl?: string;
  visitCount: number;
}

export interface Gel {
  id?: number;
  manufacturer: string;
  name: string;
  shade: string;
  codeNumber?: string;
  hexColor?: string;
  gelType: GelType;
  volumeMl?: number;
  photoUrl?: string;
  note?: string;
  createdAt: string;
}

export interface Visit {
  id?: number;
  customerId: number;
  date: string;
  photos: string[]; // Array of compressed Base64 DataURLs
  gelIds: number[]; // Array of Gel IDs used in this visit
  note?: string;
  durationMinutes?: number;
  priceEur?: number;
  tags?: string[];
  createdAt: string;
}

export interface AppSetting {
  key: string;
  value: unknown;
}

// AI Recognition Architecture
export interface AIGelRecognitionResult {
  manufacturer?: string;
  name?: string;
  shade?: string;
  codeNumber?: string;
  confidenceScore: number;
  matchedGelId?: number;
  suggestedGel?: Omit<Gel, 'id' | 'createdAt'>;
  rawAnalysis?: string;
}

export interface AINailDesignAnalysis {
  designType?: string;
  primaryColors?: string[];
  suggestedTechniques?: string[];
  detectedTags?: string[];
  rawAnalysis?: string;
}

// Database Export / Import
export interface DatabaseBackup {
  version: number;
  exportedAt: string;
  customers: Customer[];
  gels: Gel[];
  visits: Visit[];
  settings: AppSetting[];
}
