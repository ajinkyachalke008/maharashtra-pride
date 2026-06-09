// ════════════════════════════════════════════════════════════════
//  FraudLens — Regulatory & Financial Reference Data
//  Sources: RBI, NPCI, MCA, NSE/BSE — all publicly available
// ════════════════════════════════════════════════════════════════

// ── RBI Monetary Policy Rates (as of June 2025 MPC meeting) ──
// Source: https://rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx
export const RBI_POLICY_RATES = {
  lastUpdated: '2025-06-06',
  source: 'RBI Monetary Policy Committee (MPC)',
  repoRate: 5.50,
  standingDepositFacility: 5.25,
  marginalStandingFacility: 5.75,
  bankRate: 5.75,
  cashReserveRatio: 3.00,
  statutoryLiquidityRatio: 18.00,
  policyStance: 'Neutral',
} as const;

// ── Bank Regulatory Identifiers (MCA / RBI / Stock Exchange) ──
// CIN from MCA, BSE/NSE codes from respective exchanges
export interface BankRegInfo {
  bankCode: string;
  fullName: string;
  cin?: string;        // MCA Corporate Identification Number (SBI is statutory, no CIN)
  bseCode?: string;    // BSE scrip code
  nseSymbol?: string;  // NSE trading symbol
  rbiRegType: string;  // Type of RBI registration
  headquarters: string;
  foundedYear: number;
  website: string;
}

export const BANK_REG_INFO: BankRegInfo[] = [
  {
    bankCode: 'SBI',
    fullName: 'State Bank of India',
    bseCode: '500112',
    nseSymbol: 'SBIN',
    rbiRegType: 'Statutory Body (SBI Act, 1955)',
    headquarters: 'Mumbai, Maharashtra',
    foundedYear: 1955,
    website: 'https://bank.sbi',
  },
  {
    bankCode: 'HDFC',
    fullName: 'HDFC Bank Limited',
    cin: 'L65920MH1994PLC080618',
    bseCode: '500180',
    nseSymbol: 'HDFCBANK',
    rbiRegType: 'Scheduled Commercial Bank',
    headquarters: 'Mumbai, Maharashtra',
    foundedYear: 1994,
    website: 'https://www.hdfcbank.com',
  },
  {
    bankCode: 'ICICI',
    fullName: 'ICICI Bank Limited',
    cin: 'L65190GJ1994PLC021012',
    bseCode: '532174',
    nseSymbol: 'ICICIBANK',
    rbiRegType: 'Scheduled Commercial Bank',
    headquarters: 'Mumbai, Maharashtra',
    foundedYear: 1994,
    website: 'https://www.icicibank.com',
  },
  {
    bankCode: 'Axis',
    fullName: 'Axis Bank Limited',
    cin: 'L65110GJ1993PLC020769',
    bseCode: '532215',
    nseSymbol: 'AXISBANK',
    rbiRegType: 'Scheduled Commercial Bank',
    headquarters: 'Mumbai, Maharashtra',
    foundedYear: 1993,
    website: 'https://www.axisbank.com',
  },
  {
    bankCode: 'Kotak',
    fullName: 'Kotak Mahindra Bank Limited',
    cin: 'L65110MH1985PLC038137',
    bseCode: '500247',
    nseSymbol: 'KOTAKBANK',
    rbiRegType: 'Scheduled Commercial Bank',
    headquarters: 'Mumbai, Maharashtra',
    foundedYear: 2003,
    website: 'https://www.kotak.com',
  },
  {
    bankCode: 'BoM',
    fullName: 'Bank of Maharashtra',
    cin: 'L65920PN2003GOI133608',
    bseCode: '532525',
    nseSymbol: 'MAHABANK',
    rbiRegType: 'Public Sector Bank',
    headquarters: 'Pune, Maharashtra',
    foundedYear: 1935,
    website: 'https://bankofmaharashtra.in',
  },
  {
    bankCode: 'PNB',
    fullName: 'Punjab National Bank',
    cin: 'L65110DL1895GOI002810',
    bseCode: '532461',
    nseSymbol: 'PNB',
    rbiRegType: 'Public Sector Bank',
    headquarters: 'New Delhi',
    foundedYear: 1894,
    website: 'https://www.pnbindia.in',
  },
  {
    bankCode: 'Canara',
    fullName: 'Canara Bank',
    cin: 'L65110KA1969GOI001350',
    bseCode: '532483',
    nseSymbol: 'CANBK',
    rbiRegType: 'Public Sector Bank',
    headquarters: 'Bengaluru, Karnataka',
    foundedYear: 1906,
    website: 'https://canarabank.com',
  },
  {
    bankCode: 'Union',
    fullName: 'Union Bank of India',
    cin: 'L65110MH1919GOI000567',
    bseCode: '532477',
    nseSymbol: 'UNIONBANK',
    rbiRegType: 'Public Sector Bank',
    headquarters: 'Mumbai, Maharashtra',
    foundedYear: 1919,
    website: 'https://www.unionbankofindia.co.in',
  },
  {
    bankCode: 'BoB',
    fullName: 'Bank of Baroda',
    cin: 'L65110GJ1908GOI001023',
    bseCode: '532134',
    nseSymbol: 'BANKBARODA',
    rbiRegType: 'Public Sector Bank',
    headquarters: 'Vadodara, Gujarat',
    foundedYear: 1908,
    website: 'https://www.bankofbaroda.in',
  },
  {
    bankCode: 'IndusInd',
    fullName: 'IndusInd Bank Limited',
    cin: 'L65191PN1994PLC008197',
    bseCode: '532187',
    nseSymbol: 'INDUSINDBK',
    rbiRegType: 'Scheduled Commercial Bank',
    headquarters: 'Mumbai, Maharashtra',
    foundedYear: 1994,
    website: 'https://www.indusind.com',
  },
  {
    bankCode: 'Yes',
    fullName: 'Yes Bank Limited',
    cin: 'L65190MH2003PLC143249',
    bseCode: '532648',
    nseSymbol: 'YESBANK',
    rbiRegType: 'Scheduled Commercial Bank',
    headquarters: 'Mumbai, Maharashtra',
    foundedYear: 2004,
    website: 'https://www.yesbank.in',
  },
  {
    bankCode: 'IDBI',
    fullName: 'IDBI Bank Limited',
    cin: 'L65190MH2004GOI148838',
    bseCode: '500116',
    nseSymbol: 'IDBI',
    rbiRegType: 'Scheduled Commercial Bank',
    headquarters: 'Mumbai, Maharashtra',
    foundedYear: 1964,
    website: 'https://www.idbibank.in',
  },
  {
    bankCode: 'RBL',
    fullName: 'RBL Bank Limited',
    cin: 'L65191PN1943PLC007308',
    bseCode: '540065',
    nseSymbol: 'RBLBANK',
    rbiRegType: 'Scheduled Commercial Bank',
    headquarters: 'Mumbai, Maharashtra',
    foundedYear: 1943,
    website: 'https://www.rblbank.com',
  },
  {
    bankCode: 'Bandhan',
    fullName: 'Bandhan Bank Limited',
    cin: 'L65110WB2014PLC204317',
    bseCode: '541153',
    nseSymbol: 'BANDHANBNK',
    rbiRegType: 'Scheduled Commercial Bank',
    headquarters: 'Kolkata, West Bengal',
    foundedYear: 2015,
    website: 'https://www.bandhanbank.com',
  },
  {
    bankCode: 'Federal',
    fullName: 'Federal Bank Limited',
    cin: 'L65191KL1931PLC000368',
    bseCode: '500469',
    nseSymbol: 'FEDERALBNK',
    rbiRegType: 'Scheduled Commercial Bank',
    headquarters: 'Aluva, Kerala',
    foundedYear: 1931,
    website: 'https://www.federalbank.co.in',
  },
  {
    bankCode: 'SIB',
    fullName: 'South Indian Bank Limited',
    cin: 'L65191KL1929PLC001017',
    bseCode: '532218',
    nseSymbol: 'SOUTHBANK',
    rbiRegType: 'Scheduled Commercial Bank',
    headquarters: 'Thrissur, Kerala',
    foundedYear: 1929,
    website: 'https://www.southindianbank.com',
  },
];

// ── UPI / Digital Payment Infrastructure (NPCI published data) ──
// Source: NPCI monthly press releases — https://www.npci.org.in/statistics
export const PAYMENT_INFRASTRUCTURE = {
  upi: {
    operator: 'National Payments Corporation of India (NPCI)',
    website: 'https://www.npci.org.in',
    maxTransactionLimit: '₹1,00,000',  // Standard UPI limit
    maxP2MLimit: '₹2,00,000',          // P2M enhanced limit
    settlementCycles: 'Near real-time',
    regulatedBy: 'RBI — Department of Payment and Settlement Systems (DPSS)',
  },
  imps: {
    operator: 'NPCI',
    maxLimit: '₹5,00,000',
    availability: '24x7x365',
    settlementCycles: 'Near real-time',
  },
  neft: {
    operator: 'RBI',
    availability: '24x7x365 (since Dec 2019)',
    settlementCycles: 'Half-hourly batches',
    minAmount: '₹1',
    maxAmount: 'No upper limit',
  },
  rtgs: {
    operator: 'RBI',
    availability: '24x7x365 (since Dec 2020)',
    settlementCycles: 'Real-time gross settlement',
    minAmount: '₹2,00,000',
    maxAmount: 'No upper limit',
  },
} as const;

// ── Key Regulatory Bodies ──
export const REGULATORY_BODIES = [
  {
    id: 'rbi',
    name: 'Reserve Bank of India',
    role: 'Central bank, monetary authority, banking regulator',
    website: 'https://rbi.org.in',
    complaintPortal: 'https://cms.rbi.org.in',
  },
  {
    id: 'sebi',
    name: 'Securities and Exchange Board of India',
    role: 'Capital markets regulator',
    website: 'https://www.sebi.gov.in',
  },
  {
    id: 'npci',
    name: 'National Payments Corporation of India',
    role: 'Retail payment and settlement systems (UPI, IMPS, RuPay)',
    website: 'https://www.npci.org.in',
  },
  {
    id: 'fiu',
    name: 'Financial Intelligence Unit — India',
    role: 'Anti-money laundering intelligence; receives STR/CTR from banks',
    website: 'https://fiuindia.gov.in',
  },
  {
    id: 'ed',
    name: 'Enforcement Directorate',
    role: 'PMLA enforcement, FEMA violations, economic offences',
    website: 'https://enforcementdirectorate.gov.in',
  },
] as const;
