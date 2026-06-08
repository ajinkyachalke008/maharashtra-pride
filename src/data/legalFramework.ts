// ════════════════════════════════════════════════════════════════
//  FraudLens — Legal Framework Reference Data
//  All sections/acts are from publicly available Indian law texts.
//  Source: Government of India Gazette, Legislative Department
// ════════════════════════════════════════════════════════════════

export interface LegalSection {
  id: string;
  act: string;
  section: string;
  title: string;
  description: string;
  category: 'cyber' | 'fraud' | 'forgery' | 'money_laundering' | 'identity';
  maxPenalty: string;
}

export const LEGAL_SECTIONS: LegalSection[] = [
  // ── Indian Penal Code (IPC) / Bharatiya Nyaya Sanhita (BNS) ──
  {
    id: 'ipc-420',
    act: 'Indian Penal Code',
    section: 'Section 420',
    title: 'Cheating and Dishonestly Inducing Delivery of Property',
    description: 'Whoever cheats and thereby dishonestly induces the person deceived to deliver any property, or to make, alter or destroy any valuable security.',
    category: 'fraud',
    maxPenalty: '7 years imprisonment + fine',
  },
  {
    id: 'ipc-406',
    act: 'Indian Penal Code',
    section: 'Section 406',
    title: 'Criminal Breach of Trust',
    description: 'Whoever commits criminal breach of trust, being entrusted with property or dominion over property, dishonestly misappropriates or converts to own use.',
    category: 'fraud',
    maxPenalty: '3 years imprisonment + fine',
  },
  {
    id: 'ipc-419',
    act: 'Indian Penal Code',
    section: 'Section 419',
    title: 'Cheating by Personation',
    description: 'Whoever cheats by personation — pretending to be some other person, or knowingly substituting one person for another.',
    category: 'identity',
    maxPenalty: '3 years imprisonment + fine',
  },
  {
    id: 'ipc-463',
    act: 'Indian Penal Code',
    section: 'Section 463',
    title: 'Forgery',
    description: 'Making a false document or false electronic record with intent to cause damage or to support any claim or title.',
    category: 'forgery',
    maxPenalty: '2 years imprisonment + fine',
  },
  {
    id: 'ipc-468',
    act: 'Indian Penal Code',
    section: 'Section 468',
    title: 'Forgery for Purpose of Cheating',
    description: 'Whoever commits forgery intending that the forged document or electronic record shall be used for the purpose of cheating.',
    category: 'forgery',
    maxPenalty: '7 years imprisonment + fine',
  },
  {
    id: 'ipc-471',
    act: 'Indian Penal Code',
    section: 'Section 471',
    title: 'Using Forged Document as Genuine',
    description: 'Whoever fraudulently or dishonestly uses as genuine any forged document or electronic record, knowing or having reason to believe it to be forged.',
    category: 'forgery',
    maxPenalty: 'Same as for forgery of that document',
  },
  {
    id: 'ipc-467',
    act: 'Indian Penal Code',
    section: 'Section 467',
    title: 'Forgery of Valuable Security',
    description: 'Whoever forges a document purporting to be a valuable security, will, authority to adopt a son, or giving authority to make transfers of property.',
    category: 'forgery',
    maxPenalty: 'Life imprisonment / 10 years + fine',
  },

  // ── Information Technology Act, 2000 ──
  {
    id: 'it-66',
    act: 'Information Technology Act, 2000',
    section: 'Section 66',
    title: 'Computer Related Offences',
    description: 'If any person dishonestly or fraudulently does any act referred to in section 43, he shall be punishable with imprisonment or fine.',
    category: 'cyber',
    maxPenalty: '3 years imprisonment + ₹5 lakh fine',
  },
  {
    id: 'it-66c',
    act: 'Information Technology Act, 2000',
    section: 'Section 66C',
    title: 'Identity Theft',
    description: 'Whoever fraudulently or dishonestly makes use of the electronic signature, password or any other unique identification feature of any other person.',
    category: 'identity',
    maxPenalty: '3 years imprisonment + ₹1 lakh fine',
  },
  {
    id: 'it-66d',
    act: 'Information Technology Act, 2000',
    section: 'Section 66D',
    title: 'Cheating by Personation Using Computer Resource',
    description: 'Whoever by means of any communication device or computer resource cheats by personation.',
    category: 'cyber',
    maxPenalty: '3 years imprisonment + ₹1 lakh fine',
  },
  {
    id: 'it-43',
    act: 'Information Technology Act, 2000',
    section: 'Section 43',
    title: 'Unauthorized Access to Computer Systems',
    description: 'Accessing or securing access to computer, computer system or computer network without permission; downloading, copying, extracting data.',
    category: 'cyber',
    maxPenalty: 'Compensation up to ₹1 crore',
  },
  {
    id: 'it-65',
    act: 'Information Technology Act, 2000',
    section: 'Section 65',
    title: 'Tampering with Computer Source Documents',
    description: 'Whoever knowingly or intentionally conceals, destroys or alters computer source code used for a computer program.',
    category: 'cyber',
    maxPenalty: '3 years imprisonment + ₹2 lakh fine',
  },
  {
    id: 'it-72',
    act: 'Information Technology Act, 2000',
    section: 'Section 72',
    title: 'Breach of Confidentiality and Privacy',
    description: 'Any person who has secured access to any electronic record, book, register, correspondence, information, document or material, and discloses it without consent.',
    category: 'cyber',
    maxPenalty: '2 years imprisonment + ₹1 lakh fine',
  },

  // ── Prevention of Money Laundering Act (PMLA), 2002 ──
  {
    id: 'pmla-3',
    act: 'PMLA, 2002',
    section: 'Section 3',
    title: 'Offence of Money Laundering',
    description: 'Whosoever directly or indirectly attempts to indulge or knowingly assists or knowingly is a party in any process or activity connected with proceeds of crime.',
    category: 'money_laundering',
    maxPenalty: '3–7 years imprisonment + ₹5 lakh fine',
  },
  {
    id: 'pmla-4',
    act: 'PMLA, 2002',
    section: 'Section 4',
    title: 'Punishment for Money Laundering',
    description: 'Rigorous imprisonment for not less than 3 years, extendable to 7 years, and fine up to ₹5 lakh. For offences under NDPS Act, up to 10 years.',
    category: 'money_laundering',
    maxPenalty: '3–10 years imprisonment + ₹5 lakh fine',
  },
  {
    id: 'pmla-5',
    act: 'PMLA, 2002',
    section: 'Section 5',
    title: 'Attachment of Property Involved in Money Laundering',
    description: 'Director or officer not below the rank of Deputy Director can provisionally attach property believed to be proceeds of crime for 180 days.',
    category: 'money_laundering',
    maxPenalty: 'Provisional attachment of property',
  },
];

// ── RBI Master Directions & Circulars on Fraud ──
export interface RBICircular {
  id: string;
  reference: string;
  title: string;
  dateIssued: string;
  summary: string;
  url: string;
}

export const RBI_CIRCULARS: RBICircular[] = [
  {
    id: 'rbi-md-fraud',
    reference: 'DBS.FrMC.BC.No.1/23.04.001/2016-17',
    title: 'Master Direction on Frauds — Classification and Reporting',
    dateIssued: '2016-07-01',
    summary: 'Framework for classification of frauds, reporting timelines, staff accountability, and red-flagging of accounts by banks.',
    url: 'https://rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=10477',
  },
  {
    id: 'rbi-dpss-upi',
    reference: 'DPSS.CO.PD.No.629/02.01.014/2020-21',
    title: 'Enhancing Security of Digital Payment Transactions',
    dateIssued: '2021-02-18',
    summary: 'Framework for securing UPI, IMPS, and mobile banking transactions including device binding, additional factors of authentication.',
    url: 'https://rbi.org.in/Scripts/NotificationUser.aspx',
  },
  {
    id: 'rbi-kyc-aml',
    reference: 'DBR.AML.BC.No.81/14.01.001/2015-16',
    title: 'Master Direction — Know Your Customer (KYC) Direction',
    dateIssued: '2016-02-25',
    summary: 'Comprehensive KYC/AML/CFT guidelines for banks including customer due diligence, enhanced due diligence, and suspicious transaction reporting.',
    url: 'https://rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=11566',
  },
  {
    id: 'rbi-str',
    reference: 'DBOD.AML.BC.No.11/14.01.001/2012-13',
    title: 'Suspicious Transaction Reports (STR) Submission to FIU-IND',
    dateIssued: '2012-07-02',
    summary: 'Banks must file STRs with FIU-IND within 7 days of establishing suspicion. Covers cash transactions exceeding ₹10 lakh and all suspicious transactions.',
    url: 'https://fiuindia.gov.in/',
  },
];

// ── Fraud Typology (from RBI / NPCI published advisories) ──
export interface FraudType {
  id: string;
  name: string;
  category: 'social_engineering' | 'technical' | 'insider' | 'document';
  description: string;
  ipcSections: string[];
  itActSections: string[];
}

export const FRAUD_TYPES: FraudType[] = [
  {
    id: 'ft-phishing',
    name: 'Phishing / Spear Phishing',
    category: 'social_engineering',
    description: 'Fraudulent emails/messages impersonating banks or government agencies to extract login credentials, OTPs, or card details.',
    ipcSections: ['420', '468'],
    itActSections: ['66C', '66D'],
  },
  {
    id: 'ft-vishing',
    name: 'Vishing (Voice Phishing)',
    category: 'social_engineering',
    description: 'Phone calls impersonating bank officials, RBI, or police to extract sensitive banking information or induce fund transfers.',
    ipcSections: ['419', '420'],
    itActSections: ['66D'],
  },
  {
    id: 'ft-sim-swap',
    name: 'SIM Swap Fraud',
    category: 'technical',
    description: 'Fraudster obtains duplicate SIM of victim to intercept OTPs and gain access to bank accounts linked to mobile number.',
    ipcSections: ['420', '468', '471'],
    itActSections: ['66', '66C'],
  },
  {
    id: 'ft-upi-fraud',
    name: 'UPI Collect Request Fraud',
    category: 'social_engineering',
    description: 'Sending fraudulent UPI collect requests disguised as refunds or rewards, tricking victims into approving money debits.',
    ipcSections: ['420'],
    itActSections: ['66D'],
  },
  {
    id: 'ft-qr-scam',
    name: 'QR Code Payment Scam',
    category: 'social_engineering',
    description: 'Fraudsters send QR codes claiming to transfer money but the QR is actually a collect/debit request.',
    ipcSections: ['420'],
    itActSections: ['66D'],
  },
  {
    id: 'ft-remote-access',
    name: 'Remote Access / Screen Sharing Fraud',
    category: 'technical',
    description: 'Tricking victims into installing remote access apps (AnyDesk, TeamViewer) giving fraudsters full control of the device.',
    ipcSections: ['420', '406'],
    itActSections: ['43', '66'],
  },
  {
    id: 'ft-loan-app',
    name: 'Illegal Lending App Fraud',
    category: 'social_engineering',
    description: 'Unauthorized lending apps charging exorbitant interest, accessing contacts, and using harassment/blackmail for recovery.',
    ipcSections: ['420', '384', '506'],
    itActSections: ['66', '66D'],
  },
  {
    id: 'ft-money-mule',
    name: 'Money Mule Accounts',
    category: 'insider',
    description: 'Using third-party bank accounts to layer and move illicit funds. Account holders may be witting or unwitting participants.',
    ipcSections: ['420'],
    itActSections: ['66'],
  },
  {
    id: 'ft-kyc-fraud',
    name: 'Fake KYC Update Scam',
    category: 'social_engineering',
    description: 'SMS/calls claiming KYC expiry and directing victims to phishing links or extracting Aadhaar/PAN details for account takeover.',
    ipcSections: ['419', '420', '468'],
    itActSections: ['66C', '66D'],
  },
  {
    id: 'ft-cheque-fraud',
    name: 'Cheque Forgery / Alteration',
    category: 'document',
    description: 'Altering payee name, amount, or date on cheques; creating counterfeit cheques using stolen MICR/IFSC details.',
    ipcSections: ['463', '467', '468', '471'],
    itActSections: [],
  },
];
