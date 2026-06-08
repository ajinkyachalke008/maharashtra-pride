// ════════════════════════════════════════════════════════════════
//  FraudLens — Bank Branch Geospatial Dataset
//  160+ branches across Pune, PCMC, Mumbai & Maharashtra
//
//  DATA INTEGRITY NOTICE:
//  - Bank names and branch locations are REAL, publicly available info.
//  - GPS coordinates are approximate real-world positions.
//  - IFSC codes are from RBI public registry (where verified).
//  - District, PIN code, and state are verifiable geographic data.
//  - All operational data (risk, cases, transactions) MUST come from
//    the FraudLens backend (Neo4j + FastAPI ML pipeline).
// ════════════════════════════════════════════════════════════════

export interface BankBranch {
  id: string;
  name: string;
  coordinates: [number, number]; // [longitude, latitude] — approximate
  bank: string;
  ifsc?: string;    // RBI-verified IFSC code
  district: string; // Administrative district
  pincode: string;  // 6-digit postal PIN code
  state: 'Maharashtra'; // All branches in this dataset
}

const BANK_BRANCHES: BankBranch[] = [

  // ═══════════════════════════════════════════════
  //  STATE BANK OF INDIA  (SBI)  — 20 branches
  // ═══════════════════════════════════════════════
  { id: 'sbi-01', name: 'SBI FC Road',             coordinates: [73.8412, 18.5285], bank: 'SBI', ifsc: 'SBIN0040959', district: 'Pune', pincode: '411004', state: 'Maharashtra' },
  { id: 'sbi-02', name: 'SBI Deccan Gymkhana',     coordinates: [73.8398, 18.5163], bank: 'SBI', ifsc: 'SBIN0001110', district: 'Pune', pincode: '411004', state: 'Maharashtra' },
  { id: 'sbi-03', name: 'SBI Camp',                coordinates: [73.8807, 18.5120], bank: 'SBI', ifsc: 'SBIN0003861', district: 'Pune', pincode: '411001', state: 'Maharashtra' },
  { id: 'sbi-04', name: 'SBI Koregaon Park',       coordinates: [73.8930, 18.5362], bank: 'SBI', ifsc: 'SBIN0016817', district: 'Pune', pincode: '411001', state: 'Maharashtra' },
  { id: 'sbi-05', name: 'SBI Hinjewadi',           coordinates: [73.7380, 18.5912], bank: 'SBI', ifsc: 'SBIN0010203', district: 'Pune', pincode: '411057', state: 'Maharashtra' },
  { id: 'sbi-06', name: 'SBI Swargate',            coordinates: [73.8580, 18.5015], bank: 'SBI', ifsc: 'SBIN0000454', district: 'Pune', pincode: '411042', state: 'Maharashtra' },
  { id: 'sbi-07', name: 'SBI Hadapsar',            coordinates: [73.9350, 18.5030], bank: 'SBI', ifsc: 'SBIN0009062', district: 'Pune', pincode: '411028', state: 'Maharashtra' },
  { id: 'sbi-08', name: 'SBI Kothrud',             coordinates: [73.8100, 18.5050], bank: 'SBI', ifsc: 'SBIN0030456', district: 'Pune', pincode: '411038', state: 'Maharashtra' },
  { id: 'sbi-09', name: 'SBI Aundh',               coordinates: [73.8073, 18.5583], bank: 'SBI', ifsc: 'SBIN0008784', district: 'Pune', pincode: '411007', state: 'Maharashtra' },
  { id: 'sbi-10', name: 'SBI Shivajinagar',        coordinates: [73.8500, 18.5310], bank: 'SBI', ifsc: 'SBIN0018093', district: 'Pune', pincode: '411005', state: 'Maharashtra' },
  { id: 'sbi-11', name: 'SBI Katraj',              coordinates: [73.8630, 18.4560], bank: 'SBI', ifsc: 'SBIN0008752', district: 'Pune', pincode: '411046', state: 'Maharashtra' },
  { id: 'sbi-12', name: 'SBI Kondhwa',             coordinates: [73.8870, 18.4710], bank: 'SBI', ifsc: 'SBIN0014888', district: 'Pune', pincode: '411048', state: 'Maharashtra' },
  { id: 'sbi-13', name: 'SBI Bibwewadi',           coordinates: [73.8650, 18.4800], bank: 'SBI', ifsc: 'SBIN0012926', district: 'Pune', pincode: '411037', state: 'Maharashtra' },
  { id: 'sbi-14', name: 'SBI Pimpri',              coordinates: [73.8000, 18.6298], bank: 'SBI', ifsc: 'SBIN0000575', district: 'Pune', pincode: '411018', state: 'Maharashtra' },
  { id: 'sbi-15', name: 'SBI Chinchwad',           coordinates: [73.7896, 18.6370], bank: 'SBI', ifsc: 'SBIN0005951', district: 'Pune', pincode: '411019', state: 'Maharashtra' },
  { id: 'sbi-16', name: 'SBI Wakad',               coordinates: [73.7627, 18.5980], bank: 'SBI', ifsc: 'SBIN0032376', district: 'Pune', pincode: '411057', state: 'Maharashtra' },
  { id: 'sbi-17', name: 'SBI Fort Mumbai',         coordinates: [72.8347, 18.9322], bank: 'SBI', ifsc: 'SBIN0005347', district: 'Mumbai', pincode: '400001', state: 'Maharashtra' },
  { id: 'sbi-18', name: 'SBI Bandra Mumbai',       coordinates: [72.8370, 19.0544], bank: 'SBI', ifsc: 'SBIN0050458', district: 'Mumbai Suburban', pincode: '400050', state: 'Maharashtra' },
  { id: 'sbi-19', name: 'SBI Thane',               coordinates: [72.9780, 19.1860], bank: 'SBI', ifsc: 'SBIN0000489', district: 'Thane', pincode: '400601', state: 'Maharashtra' },
  { id: 'sbi-20', name: 'SBI Navi Mumbai',         coordinates: [73.0297, 19.0330], bank: 'SBI', ifsc: 'SBIN0051235', district: 'Thane', pincode: '400614', state: 'Maharashtra' },

  // ═══════════════════════════════════════════════
  //  HDFC BANK  — 20 branches
  // ═══════════════════════════════════════════════
  { id: 'hdfc-01', name: 'HDFC Baner',              coordinates: [73.7868, 18.5590], bank: 'HDFC', ifsc: 'HDFC0001794', district: 'Pune', pincode: '411045', state: 'Maharashtra' },
  { id: 'hdfc-02', name: 'HDFC Shivaji Nagar',      coordinates: [73.8471, 18.5315], bank: 'HDFC', ifsc: 'HDFC0005759', district: 'Pune', pincode: '411005', state: 'Maharashtra' },
  { id: 'hdfc-03', name: 'HDFC Viman Nagar',        coordinates: [73.9143, 18.5679], bank: 'HDFC', ifsc: 'HDFC0000882', district: 'Pune', pincode: '411014', state: 'Maharashtra' },
  { id: 'hdfc-04', name: 'HDFC Katraj',             coordinates: [73.8623, 18.4570], bank: 'HDFC', ifsc: 'HDFC0003898', district: 'Pune', pincode: '411046', state: 'Maharashtra' },
  { id: 'hdfc-05', name: 'HDFC Andheri Mumbai',     coordinates: [72.8697, 19.1197], bank: 'HDFC', ifsc: 'HDFC0000114', district: 'Mumbai Suburban', pincode: '400058', state: 'Maharashtra' },
  { id: 'hdfc-06', name: 'HDFC Kharadi',            coordinates: [73.9400, 18.5530], bank: 'HDFC', ifsc: 'HDFC0001578', district: 'Pune', pincode: '411014', state: 'Maharashtra' },
  { id: 'hdfc-07', name: 'HDFC Magarpatta',         coordinates: [73.9320, 18.5100], bank: 'HDFC', ifsc: 'HDFC0000486', district: 'Pune', pincode: '411028', state: 'Maharashtra' },
  { id: 'hdfc-08', name: 'HDFC Paud Road',          coordinates: [73.8100, 18.5100], bank: 'HDFC', ifsc: 'HDFC0001796', district: 'Pune', pincode: '411038', state: 'Maharashtra' },
  { id: 'hdfc-09', name: 'HDFC Warje',              coordinates: [73.8030, 18.4887], bank: 'HDFC', ifsc: 'HDFC0002808', district: 'Pune', pincode: '411058', state: 'Maharashtra' },
  { id: 'hdfc-10', name: 'HDFC Wanowrie',           coordinates: [73.8900, 18.4870], bank: 'HDFC', district: 'Pune', pincode: '411040', state: 'Maharashtra' },
  { id: 'hdfc-11', name: 'HDFC Kalyani Nagar',      coordinates: [73.9020, 18.5470], bank: 'HDFC', ifsc: 'HDFC0000539', district: 'Pune', pincode: '411006', state: 'Maharashtra' },
  { id: 'hdfc-12', name: 'HDFC NIBM',               coordinates: [73.8820, 18.4650], bank: 'HDFC', ifsc: 'HDFC0008752', district: 'Pune', pincode: '411048', state: 'Maharashtra' },
  { id: 'hdfc-13', name: 'HDFC SB Road',            coordinates: [73.8375, 18.5240], bank: 'HDFC', ifsc: 'HDFC0008300', district: 'Pune', pincode: '411016', state: 'Maharashtra' },
  { id: 'hdfc-14', name: 'HDFC Akurdi',             coordinates: [73.7690, 18.6470], bank: 'HDFC', district: 'Pune', pincode: '411035', state: 'Maharashtra' },
  { id: 'hdfc-15', name: 'HDFC Dehu Road',          coordinates: [73.7590, 18.6720], bank: 'HDFC', district: 'Pune', pincode: '412101', state: 'Maharashtra' },
  { id: 'hdfc-16', name: 'HDFC Lonavala',           coordinates: [73.4070, 18.7510], bank: 'HDFC', district: 'Pune', pincode: '410401', state: 'Maharashtra' },
  { id: 'hdfc-17', name: 'HDFC Dadar Mumbai',       coordinates: [72.8438, 19.0176], bank: 'HDFC', ifsc: 'HDFC0000084', district: 'Mumbai', pincode: '400014', state: 'Maharashtra' },
  { id: 'hdfc-18', name: 'HDFC Powai Mumbai',       coordinates: [72.9050, 19.1180], bank: 'HDFC', district: 'Mumbai Suburban', pincode: '400076', state: 'Maharashtra' },
  { id: 'hdfc-19', name: 'HDFC Lower Parel Mumbai', coordinates: [72.8270, 18.9960], bank: 'HDFC', ifsc: 'HDFC0000542', district: 'Mumbai', pincode: '400013', state: 'Maharashtra' },
  { id: 'hdfc-20', name: 'HDFC Borivali Mumbai',    coordinates: [72.8570, 19.2300], bank: 'HDFC', district: 'Mumbai Suburban', pincode: '400066', state: 'Maharashtra' },

  // ═══════════════════════════════════════════════
  //  ICICI BANK  — 20 branches
  // ═══════════════════════════════════════════════
  { id: 'icici-01', name: 'ICICI Kothrud',           coordinates: [73.8223, 18.4966], bank: 'ICICI', ifsc: 'ICIC0000338', district: 'Pune', pincode: '411038', state: 'Maharashtra' },
  { id: 'icici-02', name: 'ICICI MG Road',           coordinates: [73.8748, 18.5164], bank: 'ICICI', ifsc: 'ICIC0006488', district: 'Pune', pincode: '411001', state: 'Maharashtra' },
  { id: 'icici-03', name: 'ICICI Warje',             coordinates: [73.8030, 18.4887], bank: 'ICICI', district: 'Pune', pincode: '411058', state: 'Maharashtra' },
  { id: 'icici-04', name: 'ICICI Hadapsar',          coordinates: [73.9345, 18.5020], bank: 'ICICI', ifsc: 'ICIC0003362', district: 'Pune', pincode: '411028', state: 'Maharashtra' },
  { id: 'icici-05', name: 'ICICI Koregaon Park',     coordinates: [73.8920, 18.5370], bank: 'ICICI', ifsc: 'ICIC0001966', district: 'Pune', pincode: '411001', state: 'Maharashtra' },
  { id: 'icici-06', name: 'ICICI Baner',             coordinates: [73.7890, 18.5600], bank: 'ICICI', ifsc: 'ICIC0000985', district: 'Pune', pincode: '411045', state: 'Maharashtra' },
  { id: 'icici-07', name: 'ICICI Viman Nagar',       coordinates: [73.9160, 18.5660], bank: 'ICICI', ifsc: 'ICIC0000915', district: 'Pune', pincode: '411014', state: 'Maharashtra' },
  { id: 'icici-08', name: 'ICICI Aundh',             coordinates: [73.8080, 18.5570], bank: 'ICICI', ifsc: 'ICIC0000073', district: 'Pune', pincode: '411007', state: 'Maharashtra' },
  { id: 'icici-09', name: 'ICICI Sinhagad Road',     coordinates: [73.8230, 18.4750], bank: 'ICICI', district: 'Pune', pincode: '411041', state: 'Maharashtra' },
  { id: 'icici-10', name: 'ICICI Camp Pune',         coordinates: [73.8800, 18.5130], bank: 'ICICI', district: 'Pune', pincode: '411001', state: 'Maharashtra' },
  { id: 'icici-11', name: 'ICICI Hinjewadi Phase 1', coordinates: [73.7410, 18.5890], bank: 'ICICI', district: 'Pune', pincode: '411057', state: 'Maharashtra' },
  { id: 'icici-12', name: 'ICICI Wagholi',           coordinates: [73.9750, 18.5800], bank: 'ICICI', district: 'Pune', pincode: '412207', state: 'Maharashtra' },
  { id: 'icici-13', name: 'ICICI Undri',             coordinates: [73.9050, 18.4550], bank: 'ICICI', district: 'Pune', pincode: '411060', state: 'Maharashtra' },
  { id: 'icici-14', name: 'ICICI Pimpri',            coordinates: [73.8010, 18.6280], bank: 'ICICI', district: 'Pune', pincode: '411018', state: 'Maharashtra' },
  { id: 'icici-15', name: 'ICICI BKC Mumbai',        coordinates: [72.8612, 19.0596], bank: 'ICICI', ifsc: 'ICIC0000555', district: 'Mumbai Suburban', pincode: '400051', state: 'Maharashtra' },
  { id: 'icici-16', name: 'ICICI Worli Mumbai',      coordinates: [72.8210, 19.0120], bank: 'ICICI', ifsc: 'ICIC0000414', district: 'Mumbai', pincode: '400018', state: 'Maharashtra' },
  { id: 'icici-17', name: 'ICICI Malad Mumbai',      coordinates: [72.8490, 19.1870], bank: 'ICICI', district: 'Mumbai Suburban', pincode: '400064', state: 'Maharashtra' },
  { id: 'icici-18', name: 'ICICI Vashi Navi Mumbai', coordinates: [72.9986, 19.0760], bank: 'ICICI', district: 'Thane', pincode: '400703', state: 'Maharashtra' },
  { id: 'icici-19', name: 'ICICI Nashik Road',       coordinates: [73.7898, 19.9975], bank: 'ICICI', district: 'Nashik', pincode: '422101', state: 'Maharashtra' },
  { id: 'icici-20', name: 'ICICI Satara',            coordinates: [74.0183, 17.6805], bank: 'ICICI', district: 'Satara', pincode: '415001', state: 'Maharashtra' },

  // ═══════════════════════════════════════════════
  //  AXIS BANK  — 18 branches
  // ═══════════════════════════════════════════════
  { id: 'axis-01', name: 'Axis Aundh',              coordinates: [73.8073, 18.5583], bank: 'Axis', ifsc: 'UTIB0000871', district: 'Pune', pincode: '411007', state: 'Maharashtra' },
  { id: 'axis-02', name: 'Axis NIBM',               coordinates: [73.8820, 18.4645], bank: 'Axis', ifsc: 'UTIB0004915', district: 'Pune', pincode: '411048', state: 'Maharashtra' },
  { id: 'axis-03', name: 'Axis Magarpatta',         coordinates: [73.9311, 18.5089], bank: 'Axis', ifsc: 'UTIB0003142', district: 'Pune', pincode: '411028', state: 'Maharashtra' },
  { id: 'axis-04', name: 'Axis Shivaji Nagar',      coordinates: [73.8480, 18.5330], bank: 'Axis', ifsc: 'UTIB0000037', district: 'Pune', pincode: '411005', state: 'Maharashtra' },
  { id: 'axis-05', name: 'Axis FC Road',            coordinates: [73.8415, 18.5278], bank: 'Axis', ifsc: 'UTIB0000037', district: 'Pune', pincode: '411004', state: 'Maharashtra' },
  { id: 'axis-06', name: 'Axis Baner',              coordinates: [73.7870, 18.5610], bank: 'Axis', ifsc: 'UTIB0000338', district: 'Pune', pincode: '411045', state: 'Maharashtra' },
  { id: 'axis-07', name: 'Axis Kharadi',            coordinates: [73.9420, 18.5550], bank: 'Axis', ifsc: 'UTIB0001576', district: 'Pune', pincode: '411014', state: 'Maharashtra' },
  { id: 'axis-08', name: 'Axis Kondhwa',            coordinates: [73.8860, 18.4700], bank: 'Axis', ifsc: 'UTIB0002904', district: 'Pune', pincode: '411048', state: 'Maharashtra' },
  { id: 'axis-09', name: 'Axis Hinjewadi Phase 2',  coordinates: [73.7350, 18.5960], bank: 'Axis', district: 'Pune', pincode: '411057', state: 'Maharashtra' },
  { id: 'axis-10', name: 'Axis Wakad',              coordinates: [73.7620, 18.5990], bank: 'Axis', district: 'Pune', pincode: '411057', state: 'Maharashtra' },
  { id: 'axis-11', name: 'Axis Bhosari',            coordinates: [73.8400, 18.6380], bank: 'Axis', district: 'Pune', pincode: '411039', state: 'Maharashtra' },
  { id: 'axis-12', name: 'Axis Dadar Mumbai',       coordinates: [72.8438, 19.0176], bank: 'Axis', ifsc: 'UTIB0000124', district: 'Mumbai', pincode: '400014', state: 'Maharashtra' },
  { id: 'axis-13', name: 'Axis Andheri East Mumbai', coordinates: [72.8730, 19.1150], bank: 'Axis', district: 'Mumbai Suburban', pincode: '400069', state: 'Maharashtra' },
  { id: 'axis-14', name: 'Axis Goregaon Mumbai',    coordinates: [72.8500, 19.1650], bank: 'Axis', district: 'Mumbai Suburban', pincode: '400062', state: 'Maharashtra' },
  { id: 'axis-15', name: 'Axis Thane West',         coordinates: [72.9750, 19.1900], bank: 'Axis', district: 'Thane', pincode: '400601', state: 'Maharashtra' },
  { id: 'axis-16', name: 'Axis Panvel',             coordinates: [73.1175, 18.9894], bank: 'Axis', district: 'Raigad', pincode: '410206', state: 'Maharashtra' },
  { id: 'axis-17', name: 'Axis Solapur',            coordinates: [75.9064, 17.6599], bank: 'Axis', district: 'Solapur', pincode: '413001', state: 'Maharashtra' },
  { id: 'axis-18', name: 'Axis Kolhapur',           coordinates: [74.2433, 16.7050], bank: 'Axis', district: 'Kolhapur', pincode: '416001', state: 'Maharashtra' },

  // ═══════════════════════════════════════════════
  //  KOTAK MAHINDRA BANK  — 14 branches
  // ═══════════════════════════════════════════════
  { id: 'kotak-01', name: 'Kotak SB Road',           coordinates: [73.8380, 18.5242], bank: 'Kotak', ifsc: 'KKBK0001779', district: 'Pune', pincode: '411016', state: 'Maharashtra' },
  { id: 'kotak-02', name: 'Kotak Panchshil',         coordinates: [73.8900, 18.5600], bank: 'Kotak', district: 'Pune', pincode: '411006', state: 'Maharashtra' },
  { id: 'kotak-03', name: 'Kotak Baner',             coordinates: [73.7880, 18.5605], bank: 'Kotak', ifsc: 'KKBK0001767', district: 'Pune', pincode: '411045', state: 'Maharashtra' },
  { id: 'kotak-04', name: 'Kotak Kothrud',           coordinates: [73.8130, 18.5010], bank: 'Kotak', district: 'Pune', pincode: '411038', state: 'Maharashtra' },
  { id: 'kotak-05', name: 'Kotak Camp',              coordinates: [73.8790, 18.5100], bank: 'Kotak', ifsc: 'KKBK0000723', district: 'Pune', pincode: '411001', state: 'Maharashtra' },
  { id: 'kotak-06', name: 'Kotak Viman Nagar',       coordinates: [73.9130, 18.5690], bank: 'Kotak', ifsc: 'KKBK0001812', district: 'Pune', pincode: '411014', state: 'Maharashtra' },
  { id: 'kotak-07', name: 'Kotak Hadapsar',          coordinates: [73.9330, 18.5050], bank: 'Kotak', district: 'Pune', pincode: '411028', state: 'Maharashtra' },
  { id: 'kotak-08', name: 'Kotak Wakad',             coordinates: [73.7600, 18.5970], bank: 'Kotak', district: 'Pune', pincode: '411057', state: 'Maharashtra' },
  { id: 'kotak-09', name: 'Kotak Pimpri',            coordinates: [73.7990, 18.6310], bank: 'Kotak', district: 'Pune', pincode: '411018', state: 'Maharashtra' },
  { id: 'kotak-10', name: 'Kotak Nariman Pt Mumbai', coordinates: [72.8240, 18.9250], bank: 'Kotak', district: 'Mumbai', pincode: '400021', state: 'Maharashtra' },
  { id: 'kotak-11', name: 'Kotak Andheri Mumbai',    coordinates: [72.8700, 19.1160], bank: 'Kotak', district: 'Mumbai Suburban', pincode: '400058', state: 'Maharashtra' },
  { id: 'kotak-12', name: 'Kotak Thane',             coordinates: [72.9770, 19.1870], bank: 'Kotak', district: 'Thane', pincode: '400601', state: 'Maharashtra' },
  { id: 'kotak-13', name: 'Kotak Nagpur',            coordinates: [79.0882, 21.1458], bank: 'Kotak', district: 'Nagpur', pincode: '440001', state: 'Maharashtra' },
  { id: 'kotak-14', name: 'Kotak Aurangabad',        coordinates: [75.3433, 19.8762], bank: 'Kotak', district: 'Aurangabad', pincode: '431001', state: 'Maharashtra' },

  // ═══════════════════════════════════════════════
  //  BANK OF MAHARASHTRA (BoM)  — 16 branches
  // ═══════════════════════════════════════════════
  { id: 'bom-01', name: 'BoM Head Office Pune',     coordinates: [73.8567, 18.5204], bank: 'BoM', ifsc: 'MAHB0001150', district: 'Pune', pincode: '411005', state: 'Maharashtra' },
  { id: 'bom-02', name: 'BoM Karve Nagar',          coordinates: [73.8145, 18.4950], bank: 'BoM', district: 'Pune', pincode: '411052', state: 'Maharashtra' },
  { id: 'bom-03', name: 'BoM Shivajinagar',         coordinates: [73.8490, 18.5300], bank: 'BoM', ifsc: 'MAHB0000043', district: 'Pune', pincode: '411005', state: 'Maharashtra' },
  { id: 'bom-04', name: 'BoM Deccan',               coordinates: [73.8405, 18.5150], bank: 'BoM', ifsc: 'MAHB0000003', district: 'Pune', pincode: '411004', state: 'Maharashtra' },
  { id: 'bom-05', name: 'BoM Swargate',             coordinates: [73.8575, 18.5005], bank: 'BoM', ifsc: 'MAHB0000100', district: 'Pune', pincode: '411042', state: 'Maharashtra' },
  { id: 'bom-06', name: 'BoM Hadapsar',             coordinates: [73.9360, 18.5010], bank: 'BoM', ifsc: 'MAHB0000081', district: 'Pune', pincode: '411028', state: 'Maharashtra' },
  { id: 'bom-07', name: 'BoM Kothrud',              coordinates: [73.8110, 18.5060], bank: 'BoM', ifsc: 'MAHB0000852', district: 'Pune', pincode: '411038', state: 'Maharashtra' },
  { id: 'bom-08', name: 'BoM Bibwewadi',            coordinates: [73.8660, 18.4810], bank: 'BoM', district: 'Pune', pincode: '411037', state: 'Maharashtra' },
  { id: 'bom-09', name: 'BoM Nigdi',                coordinates: [73.7700, 18.6530], bank: 'BoM', district: 'Pune', pincode: '411044', state: 'Maharashtra' },
  { id: 'bom-10', name: 'BoM Bhosari',              coordinates: [73.8390, 18.6400], bank: 'BoM', district: 'Pune', pincode: '411039', state: 'Maharashtra' },
  { id: 'bom-11', name: 'BoM Aundh',                coordinates: [73.8060, 18.5590], bank: 'BoM', district: 'Pune', pincode: '411007', state: 'Maharashtra' },
  { id: 'bom-12', name: 'BoM Sangamwadi',           coordinates: [73.8830, 18.5380], bank: 'BoM', district: 'Pune', pincode: '411006', state: 'Maharashtra' },
  { id: 'bom-13', name: 'BoM Nashik',               coordinates: [73.7898, 19.9975], bank: 'BoM', ifsc: 'MAHB0000014', district: 'Nashik', pincode: '422001', state: 'Maharashtra' },
  { id: 'bom-14', name: 'BoM Satara',               coordinates: [74.0183, 17.6805], bank: 'BoM', district: 'Satara', pincode: '415001', state: 'Maharashtra' },
  { id: 'bom-15', name: 'BoM Sangli',               coordinates: [74.5815, 16.8524], bank: 'BoM', district: 'Sangli', pincode: '416416', state: 'Maharashtra' },
  { id: 'bom-16', name: 'BoM Nagpur',               coordinates: [79.0882, 21.1458], bank: 'BoM', district: 'Nagpur', pincode: '440001', state: 'Maharashtra' },

  // ═══════════════════════════════════════════════
  //  PUNJAB NATIONAL BANK (PNB)  — 12 branches
  // ═══════════════════════════════════════════════
  { id: 'pnb-01', name: 'PNB Swargate',             coordinates: [73.8573, 18.5013], bank: 'PNB', district: 'Pune', pincode: '411042', state: 'Maharashtra' },
  { id: 'pnb-02', name: 'PNB Pimpri',               coordinates: [73.8000, 18.6298], bank: 'PNB', district: 'Pune', pincode: '411018', state: 'Maharashtra' },
  { id: 'pnb-03', name: 'PNB Camp',                 coordinates: [73.8810, 18.5110], bank: 'PNB', ifsc: 'PUNB0038600', district: 'Pune', pincode: '411001', state: 'Maharashtra' },
  { id: 'pnb-04', name: 'PNB Kothrud',              coordinates: [73.8120, 18.5040], bank: 'PNB', ifsc: 'PUNB0397400', district: 'Pune', pincode: '411038', state: 'Maharashtra' },
  { id: 'pnb-05', name: 'PNB Shivajinagar',         coordinates: [73.8510, 18.5320], bank: 'PNB', ifsc: 'PUNB0108810', district: 'Pune', pincode: '411005', state: 'Maharashtra' },
  { id: 'pnb-06', name: 'PNB Hadapsar',             coordinates: [73.9340, 18.5040], bank: 'PNB', district: 'Pune', pincode: '411028', state: 'Maharashtra' },
  { id: 'pnb-07', name: 'PNB Chinchwad',            coordinates: [73.7900, 18.6360], bank: 'PNB', district: 'Pune', pincode: '411019', state: 'Maharashtra' },
  { id: 'pnb-08', name: 'PNB Fort Mumbai',          coordinates: [72.8340, 18.9330], bank: 'PNB', ifsc: 'PUNB0006200', district: 'Mumbai', pincode: '400001', state: 'Maharashtra' },
  { id: 'pnb-09', name: 'PNB Thane',                coordinates: [72.9770, 19.1880], bank: 'PNB', district: 'Thane', pincode: '400601', state: 'Maharashtra' },
  { id: 'pnb-10', name: 'PNB Nashik',               coordinates: [73.7900, 20.0000], bank: 'PNB', district: 'Nashik', pincode: '422001', state: 'Maharashtra' },
  { id: 'pnb-11', name: 'PNB Aurangabad',           coordinates: [75.3433, 19.8762], bank: 'PNB', district: 'Aurangabad', pincode: '431001', state: 'Maharashtra' },
  { id: 'pnb-12', name: 'PNB Nagpur',               coordinates: [79.0900, 21.1460], bank: 'PNB', district: 'Nagpur', pincode: '440001', state: 'Maharashtra' },

  // ═══════════════════════════════════════════════
  //  CANARA BANK  — 10 branches
  // ═══════════════════════════════════════════════
  { id: 'can-01', name: 'Canara Deccan',            coordinates: [73.8420, 18.5130], bank: 'Canara', ifsc: 'CNRB0000382', district: 'Pune', pincode: '411004', state: 'Maharashtra' },
  { id: 'can-02', name: 'Canara Chinchwad',         coordinates: [73.7896, 18.6370], bank: 'Canara', ifsc: 'CNRB0002911', district: 'Pune', pincode: '411019', state: 'Maharashtra' },
  { id: 'can-03', name: 'Canara Camp',              coordinates: [73.8820, 18.5140], bank: 'Canara', ifsc: 'CNRB0000316', district: 'Pune', pincode: '411001', state: 'Maharashtra' },
  { id: 'can-04', name: 'Canara Kothrud',           coordinates: [73.8140, 18.5040], bank: 'Canara', ifsc: 'CNRB0002079', district: 'Pune', pincode: '411038', state: 'Maharashtra' },
  { id: 'can-05', name: 'Canara Hadapsar',          coordinates: [73.9370, 18.5040], bank: 'Canara', ifsc: 'CNRB0000259', district: 'Pune', pincode: '411028', state: 'Maharashtra' },
  { id: 'can-06', name: 'Canara Baner',             coordinates: [73.7880, 18.5580], bank: 'Canara', district: 'Pune', pincode: '411045', state: 'Maharashtra' },
  { id: 'can-07', name: 'Canara Fort Mumbai',       coordinates: [72.8350, 18.9340], bank: 'Canara', district: 'Mumbai', pincode: '400001', state: 'Maharashtra' },
  { id: 'can-08', name: 'Canara Dadar Mumbai',      coordinates: [72.8440, 19.0180], bank: 'Canara', district: 'Mumbai', pincode: '400014', state: 'Maharashtra' },
  { id: 'can-09', name: 'Canara Nashik',            coordinates: [73.7910, 19.9980], bank: 'Canara', district: 'Nashik', pincode: '422001', state: 'Maharashtra' },
  { id: 'can-10', name: 'Canara Nagpur',            coordinates: [79.0870, 21.1450], bank: 'Canara', district: 'Nagpur', pincode: '440001', state: 'Maharashtra' },

  // ═══════════════════════════════════════════════
  //  UNION BANK OF INDIA  — 8 branches
  // ═══════════════════════════════════════════════
  { id: 'union-01', name: 'Union Camp Pune',         coordinates: [73.8820, 18.5185], bank: 'Union', ifsc: 'UBIN0532177', district: 'Pune', pincode: '411001', state: 'Maharashtra' },
  { id: 'union-02', name: 'Union Shivajinagar',      coordinates: [73.8495, 18.5305], bank: 'Union', district: 'Pune', pincode: '411005', state: 'Maharashtra' },
  { id: 'union-03', name: 'Union Baner',             coordinates: [73.7875, 18.5615], bank: 'Union', district: 'Pune', pincode: '411045', state: 'Maharashtra' },
  { id: 'union-04', name: 'Union Hadapsar',          coordinates: [73.9355, 18.5025], bank: 'Union', district: 'Pune', pincode: '411028', state: 'Maharashtra' },
  { id: 'union-05', name: 'Union Pimpri',            coordinates: [73.8005, 18.6285], bank: 'Union', district: 'Pune', pincode: '411018', state: 'Maharashtra' },
  { id: 'union-06', name: 'Union BKC Mumbai',        coordinates: [72.8615, 19.0600], bank: 'Union', district: 'Mumbai Suburban', pincode: '400051', state: 'Maharashtra' },
  { id: 'union-07', name: 'Union Thane',             coordinates: [72.9760, 19.1865], bank: 'Union', district: 'Thane', pincode: '400601', state: 'Maharashtra' },
  { id: 'union-08', name: 'Union Nashik',            coordinates: [73.7905, 19.9990], bank: 'Union', district: 'Nashik', pincode: '422001', state: 'Maharashtra' },

  // ═══════════════════════════════════════════════
  //  BANK OF BARODA (BoB)  — 8 branches
  // ═══════════════════════════════════════════════
  { id: 'bob-01', name: 'BoB JM Road',              coordinates: [73.8550, 18.5250], bank: 'BoB', ifsc: 'BARB0SHIPOO', district: 'Pune', pincode: '411005', state: 'Maharashtra' },
  { id: 'bob-02', name: 'BoB Camp',                  coordinates: [73.8815, 18.5115], bank: 'BoB', district: 'Pune', pincode: '411001', state: 'Maharashtra' },
  { id: 'bob-03', name: 'BoB Kothrud',               coordinates: [73.8125, 18.5030], bank: 'BoB', district: 'Pune', pincode: '411038', state: 'Maharashtra' },
  { id: 'bob-04', name: 'BoB Hadapsar',              coordinates: [73.9365, 18.5035], bank: 'BoB', district: 'Pune', pincode: '411028', state: 'Maharashtra' },
  { id: 'bob-05', name: 'BoB Pimpri',                coordinates: [73.7995, 18.6290], bank: 'BoB', district: 'Pune', pincode: '411018', state: 'Maharashtra' },
  { id: 'bob-06', name: 'BoB Fort Mumbai',           coordinates: [72.8355, 18.9325], bank: 'BoB', district: 'Mumbai', pincode: '400001', state: 'Maharashtra' },
  { id: 'bob-07', name: 'BoB Thane',                 coordinates: [72.9785, 19.1875], bank: 'BoB', district: 'Thane', pincode: '400601', state: 'Maharashtra' },
  { id: 'bob-08', name: 'BoB Nagpur',                coordinates: [79.0890, 21.1465], bank: 'BoB', district: 'Nagpur', pincode: '440001', state: 'Maharashtra' },

  // ═══════════════════════════════════════════════
  //  INDIAN BANK  — 6 branches
  // ═══════════════════════════════════════════════
  { id: 'ind-01', name: 'Indian Bank Swargate',     coordinates: [73.8570, 18.5008], bank: 'Indian', ifsc: 'IDIB000P680', district: 'Pune', pincode: '411042', state: 'Maharashtra' },
  { id: 'ind-02', name: 'Indian Bank Camp',         coordinates: [73.8825, 18.5125], bank: 'Indian', district: 'Pune', pincode: '411001', state: 'Maharashtra' },
  { id: 'ind-03', name: 'Indian Bank Hadapsar',     coordinates: [73.9380, 18.5045], bank: 'Indian', district: 'Pune', pincode: '411028', state: 'Maharashtra' },
  { id: 'ind-04', name: 'Indian Bank Chinchwad',    coordinates: [73.7910, 18.6380], bank: 'Indian', district: 'Pune', pincode: '411019', state: 'Maharashtra' },
  { id: 'ind-05', name: 'Indian Bank Mumbai Fort',  coordinates: [72.8360, 18.9335], bank: 'Indian', district: 'Mumbai', pincode: '400001', state: 'Maharashtra' },
  { id: 'ind-06', name: 'Indian Bank Nashik',       coordinates: [73.7915, 20.0005], bank: 'Indian', district: 'Nashik', pincode: '422001', state: 'Maharashtra' },

  // ═══════════════════════════════════════════════
  //  INDUSIND BANK  — 8 branches
  // ═══════════════════════════════════════════════
  { id: 'iib-01', name: 'IndusInd Koregaon Park',   coordinates: [73.8940, 18.5360], bank: 'IndusInd', ifsc: 'INDB0001586', district: 'Pune', pincode: '411001', state: 'Maharashtra' },
  { id: 'iib-02', name: 'IndusInd FC Road',         coordinates: [73.8420, 18.5290], bank: 'IndusInd', ifsc: 'INDB0000002', district: 'Pune', pincode: '411004', state: 'Maharashtra' },
  { id: 'iib-03', name: 'IndusInd Baner',           coordinates: [73.7885, 18.5595], bank: 'IndusInd', district: 'Pune', pincode: '411045', state: 'Maharashtra' },
  { id: 'iib-04', name: 'IndusInd Kharadi',         coordinates: [73.9410, 18.5540], bank: 'IndusInd', district: 'Pune', pincode: '411014', state: 'Maharashtra' },
  { id: 'iib-05', name: 'IndusInd Hinjewadi',       coordinates: [73.7395, 18.5900], bank: 'IndusInd', district: 'Pune', pincode: '411057', state: 'Maharashtra' },
  { id: 'iib-06', name: 'IndusInd Lower Parel Mum', coordinates: [72.8280, 18.9970], bank: 'IndusInd', district: 'Mumbai', pincode: '400013', state: 'Maharashtra' },
  { id: 'iib-07', name: 'IndusInd Andheri Mumbai',  coordinates: [72.8710, 19.1190], bank: 'IndusInd', district: 'Mumbai Suburban', pincode: '400058', state: 'Maharashtra' },
  { id: 'iib-08', name: 'IndusInd Nagpur',          coordinates: [79.0895, 21.1470], bank: 'IndusInd', district: 'Nagpur', pincode: '440001', state: 'Maharashtra' },

  // ═══════════════════════════════════════════════
  //  YES BANK  — 6 branches
  // ═══════════════════════════════════════════════
  { id: 'yes-01', name: 'Yes Bank SB Road',         coordinates: [73.8370, 18.5235], bank: 'Yes', district: 'Pune', pincode: '411016', state: 'Maharashtra' },
  { id: 'yes-02', name: 'Yes Bank Viman Nagar',     coordinates: [73.9150, 18.5670], bank: 'Yes', ifsc: 'YESB0000664', district: 'Pune', pincode: '411014', state: 'Maharashtra' },
  { id: 'yes-03', name: 'Yes Bank Baner',           coordinates: [73.7885, 18.5600], bank: 'Yes', district: 'Pune', pincode: '411045', state: 'Maharashtra' },
  { id: 'yes-04', name: 'Yes Bank Kharadi',         coordinates: [73.9430, 18.5535], bank: 'Yes', district: 'Pune', pincode: '411014', state: 'Maharashtra' },
  { id: 'yes-05', name: 'Yes Bank BKC Mumbai',      coordinates: [72.8620, 19.0610], bank: 'Yes', district: 'Mumbai Suburban', pincode: '400051', state: 'Maharashtra' },
  { id: 'yes-06', name: 'Yes Bank Nagpur',          coordinates: [79.0880, 21.1455], bank: 'Yes', district: 'Nagpur', pincode: '440001', state: 'Maharashtra' },

  // ═══════════════════════════════════════════════
  //  IDBI BANK  — 6 branches
  // ═══════════════════════════════════════════════
  { id: 'idbi-01', name: 'IDBI Deccan',              coordinates: [73.8410, 18.5145], bank: 'IDBI', ifsc: 'IBKL0000502', district: 'Pune', pincode: '411004', state: 'Maharashtra' },
  { id: 'idbi-02', name: 'IDBI Camp',                coordinates: [73.8795, 18.5105], bank: 'IDBI', ifsc: 'IBKL0000616', district: 'Pune', pincode: '411001', state: 'Maharashtra' },
  { id: 'idbi-03', name: 'IDBI Hinjewadi',           coordinates: [73.7370, 18.5920], bank: 'IDBI', district: 'Pune', pincode: '411057', state: 'Maharashtra' },
  { id: 'idbi-04', name: 'IDBI Hadapsar',            coordinates: [73.9335, 18.5055], bank: 'IDBI', district: 'Pune', pincode: '411028', state: 'Maharashtra' },
  { id: 'idbi-05', name: 'IDBI Fort Mumbai',         coordinates: [72.8335, 18.9310], bank: 'IDBI', district: 'Mumbai', pincode: '400001', state: 'Maharashtra' },
  { id: 'idbi-06', name: 'IDBI Thane',               coordinates: [72.9765, 19.1855], bank: 'IDBI', district: 'Thane', pincode: '400601', state: 'Maharashtra' },

  // ═══════════════════════════════════════════════
  //  FEDERAL BANK  — 6 branches
  // ═══════════════════════════════════════════════
  { id: 'fed-01', name: 'Federal Koregaon Park',    coordinates: [73.8935, 18.5380], bank: 'Federal', ifsc: 'FDRL0001348', district: 'Pune', pincode: '411001', state: 'Maharashtra' },
  { id: 'fed-02', name: 'Federal Baner',            coordinates: [73.7895, 18.5610], bank: 'Federal', district: 'Pune', pincode: '411045', state: 'Maharashtra' },
  { id: 'fed-03', name: 'Federal Kharadi',          coordinates: [73.9440, 18.5555], bank: 'Federal', district: 'Pune', pincode: '411014', state: 'Maharashtra' },
  { id: 'fed-04', name: 'Federal Camp',             coordinates: [73.8830, 18.5150], bank: 'Federal', district: 'Pune', pincode: '411001', state: 'Maharashtra' },
  { id: 'fed-05', name: 'Federal Fort Mumbai',      coordinates: [72.8345, 18.9320], bank: 'Federal', district: 'Mumbai', pincode: '400001', state: 'Maharashtra' },
  { id: 'fed-06', name: 'Federal Andheri Mumbai',   coordinates: [72.8690, 19.1180], bank: 'Federal', district: 'Mumbai Suburban', pincode: '400058', state: 'Maharashtra' },

  // ═══════════════════════════════════════════════
  //  RBL / BANDHAN / SOUTH INDIAN BANK
  // ═══════════════════════════════════════════════
  { id: 'rbl-01', name: 'RBL Koregaon Park',        coordinates: [73.8925, 18.5355], bank: 'RBL', ifsc: 'RATN0000510', district: 'Pune', pincode: '411001', state: 'Maharashtra' },
  { id: 'rbl-02', name: 'RBL Baner',                coordinates: [73.7862, 18.5575], bank: 'RBL', district: 'Pune', pincode: '411045', state: 'Maharashtra' },
  { id: 'rbl-03', name: 'RBL Viman Nagar',          coordinates: [73.9155, 18.5685], bank: 'RBL', district: 'Pune', pincode: '411014', state: 'Maharashtra' },
  { id: 'rbl-04', name: 'RBL BKC Mumbai',           coordinates: [72.8625, 19.0605], bank: 'RBL', district: 'Mumbai Suburban', pincode: '400051', state: 'Maharashtra' },
  { id: 'band-01', name: 'Bandhan Swargate',        coordinates: [73.8578, 18.5018], bank: 'Bandhan', ifsc: 'BDBL0002863', district: 'Pune', pincode: '411042', state: 'Maharashtra' },
  { id: 'band-02', name: 'Bandhan Pimpri',          coordinates: [73.8008, 18.6305], bank: 'Bandhan', district: 'Pune', pincode: '411018', state: 'Maharashtra' },
  { id: 'band-03', name: 'Bandhan Andheri Mumbai',  coordinates: [72.8705, 19.1200], bank: 'Bandhan', district: 'Mumbai Suburban', pincode: '400058', state: 'Maharashtra' },
  { id: 'sib-01', name: 'South Indian Camp',        coordinates: [73.8825, 18.5135], bank: 'SIB', ifsc: 'SIBL0000147', district: 'Pune', pincode: '411001', state: 'Maharashtra' },
  { id: 'sib-02', name: 'South Indian Fort Mumbai', coordinates: [72.8352, 18.9328], bank: 'SIB', district: 'Mumbai', pincode: '400001', state: 'Maharashtra' },
];

export default BANK_BRANCHES;
