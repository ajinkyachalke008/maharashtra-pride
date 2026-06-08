// ════════════════════════════════════════════════════════════════
//  FraudLens — Pune Police & Law Enforcement Infrastructure
//  All data is publicly available from punepolice.gov.in,
//  cybercrime.gov.in, and Government of India portals.
// ════════════════════════════════════════════════════════════════

export interface LEAContact {
  id: string;
  name: string;
  type: 'cybercrime_cell' | 'helpline' | 'portal' | 'nodal_agency' | 'police_station';
  address?: string;
  phone?: string[];
  email?: string;
  website?: string;
  jurisdiction: string;
  pincode?: string;
}

export const LAW_ENFORCEMENT: LEAContact[] = [
  // ── Pune City Police — Cyber Crime ──
  {
    id: 'pune-cyber-ps',
    name: 'Pune Cyber Police Station',
    type: 'cybercrime_cell',
    address: 'Near Police Headquarter, Police Ground, Shivajinagar, Pune - 411005',
    phone: ['020-29710097', '7058719371', '7058719375'],
    email: 'crimecyber.pune@nic.in',
    website: 'https://punepolice.gov.in',
    jurisdiction: 'Pune City',
    pincode: '411005',
  },
  {
    id: 'pune-cp-office',
    name: 'Office of Commissioner of Police, Pune',
    type: 'police_station',
    address: '2, Sadhu Vaswani Rd, Camp, Pune - 411001',
    phone: ['020-26122880'],
    email: 'cp.pune@mahapolice.gov.in',
    website: 'https://punepolice.gov.in',
    jurisdiction: 'Pune City Commissionerate',
    pincode: '411001',
  },

  // ── National Portals & Helplines ──
  {
    id: 'helpline-1930',
    name: 'National Cyber Crime Helpline',
    type: 'helpline',
    phone: ['1930'],
    website: 'https://cybercrime.gov.in',
    jurisdiction: 'All India',
  },
  {
    id: 'nccrp',
    name: 'National Cyber Crime Reporting Portal',
    type: 'portal',
    website: 'https://cybercrime.gov.in',
    jurisdiction: 'All India',
  },
  {
    id: 'i4c',
    name: 'Indian Cybercrime Coordination Centre (I4C)',
    type: 'nodal_agency',
    address: 'Ministry of Home Affairs, North Block, New Delhi - 110001',
    website: 'https://i4c.mha.gov.in',
    jurisdiction: 'All India — Coordination',
  },
  {
    id: 'cert-in',
    name: 'CERT-In (Indian Computer Emergency Response Team)',
    type: 'nodal_agency',
    address: 'Electronics Niketan, CGO Complex, New Delhi - 110003',
    phone: ['1800-11-4949'],
    email: 'incident@cert-in.org.in',
    website: 'https://cert-in.org.in',
    jurisdiction: 'All India — Incident Response',
  },
  {
    id: 'fiu-ind',
    name: 'Financial Intelligence Unit — India (FIU-IND)',
    type: 'nodal_agency',
    address: 'Financial Intelligence Unit-India, 6th Floor, Hotel Samrat, Chanakyapuri, New Delhi - 110021',
    email: 'fiuindia@nic.in',
    website: 'https://fiuindia.gov.in',
    jurisdiction: 'All India — Suspicious Transaction Reports',
  },

  // ── Maharashtra State ──
  {
    id: 'maha-cyber',
    name: 'Maharashtra Cyber (State Cyber Cell)',
    type: 'cybercrime_cell',
    address: 'BKC, Bandra East, Mumbai - 400051',
    phone: ['022-22159498'],
    email: 'maharashtracyber@mahapolice.gov.in',
    website: 'https://maharashtracyber.gov.in',
    jurisdiction: 'Maharashtra State',
    pincode: '400051',
  },
];

// ════════════════════════════════════════════════════════════════
//  Emergency / Quick Reference for Investigators
// ════════════════════════════════════════════════════════════════
export const EMERGENCY_NUMBERS = {
  cyberCrimeHelpline: '1930',
  policeEmergency: '112',
  punePoliceControl: '100',
  womenHelpline: '181',
  childHelpline: '1098',
} as const;

export const REPORTING_PORTALS = {
  nationalCyberCrime: 'https://cybercrime.gov.in',
  sachet: 'https://sachet.rbi.org.in',          // RBI complaint portal
  cms: 'https://cms.rbi.org.in',                 // RBI Complaint Management System
  fiuReporting: 'https://fiuindia.gov.in',       // STR/CTR filing
  punePolice: 'https://punepolice.gov.in',
  maharashtraCyber: 'https://maharashtracyber.gov.in',
} as const;
