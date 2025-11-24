export enum UserRole {
  RESIDENT = 'RESIDENT',
  MANAGER = 'MANAGER',
  GUEST = 'GUEST',
  NONE = 'NONE'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}

export interface Ticket {
  id: string;
  title: string;
  severity: 'LOW' | 'MEDIUM' | 'CRITICAL';
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
  area: string;
}

export interface AnalysisResult {
  issue: string;
  severity: string;
  action: string;
  confidence: string;
}

export enum LensMode {
  ANALYZE = 'ANALYZE',
  EDIT = 'EDIT'
}

export interface CommunityPost {
  id: string;
  author: string;
  title: string;
  price?: string;
  content: string;
  type: 'SALE' | 'EVENT' | 'ANNOUNCEMENT';
  likes: number;
}

export interface ParkingSpot {
  id: string;
  level: string;
  number: string;
  status: 'OCCUPIED' | 'AVAILABLE' | 'ASSIGNED';
  type: 'RESIDENT' | 'GUEST' | 'EV';
}