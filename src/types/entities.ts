export interface District {
  id: number;
  name: string;
  headquarters: string;
  division: string;
}

export interface Assembly {
  id: number;
  name: string;
  reservation: 'GEN' | 'SC' | 'ST';
  totalBooths: number;
  blocks: number;
  zones: number;
  flaggedRecords: number;
  notesLogged: number;
  openIssues: number;
  eventsLogged: number;
  totalEntries: number;
  districtId: number;
}

export interface Block {
  id: number;
  assemblyNumber: number;
  name: string;
  inchargeName: string | null;
  inchargePhones: string[];
}

export interface Zone {
  id: number;
  blockId: number;
  zoneNo: number;
  zoneName: string;
  inchargeName: string | null;
  inchargePhones: string[];
  notesLogged: number;
  openIssues: number;
  eventsLogged: number;
  totalEntries: number;
}

export interface Mandal {
  id: number;
  zoneId: number;
  mandalNo: number;
  inchargeName: string | null;
  inchagePhones: string[];
  notesLogged: number;
  openIssues: number;
  eventsLogged: number;
  totalEntries: number;
}

export interface Panchayat {
  id: number;
  mandalId: number;
  name: string;
  notesLogged: number;
  openIssues: number;
  eventsLogged: number;
  totalEntries: number;
}

export interface Booth {
  id: number;
  panchayatId: number;
  boothNo: number;
  boothName: string;
  inchargeName: string | null;
  inchargePhones: string[];
  flags: string[];
  notesLogged: number;
  openIssues: number;
  eventsLogged: number;
  totalEntries: number;
}

export type EntityType = 'zone' | 'mandal' | 'panchayat' | 'booth';
export type SubmissionType = 'note' | 'issue' | 'event';
export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface Submission {
  id: number;
  entityType: EntityType;
  entityId: number;
  entityLabel: string;
  type: SubmissionType;
  message: string;
  submitterName: string | null;
  submitterPhone: string | null;
  status: SubmissionStatus;
  reviewNote: string | null;
  createdAt: string;
  reviewedAt: string | null;
}
