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
}

export interface Mandal {
  id: number;
  zoneId: number;
  mandalNo: number;
  inchargeName: string | null;
  inchagePhones: string[];
}

export interface Panchayat {
  id: number;
  mandalId: number;
  name: string;
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
