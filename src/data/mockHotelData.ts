import { Room, RoomType, Reservation, Guest, HousekeepingTask, MaintenanceTicket, User } from '../types/hotel';

export const INITIAL_ROOM_TYPES: RoomType[] = [
  {
    id: 'deluxe-king',
    name: 'Deluxe King Suite',
    description: 'Bespoke walnut paneling, plush king bedding, designer workspace, and floor-to-ceiling city skyline views.',
    basePrice: 9500,
    maxOccupancy: 2,
    bedType: '1 California King',
    sizeSqFt: 480,
    image: '/src/assets/images/hotel_suite_deluxe_1793117717496.jpg',
    amenities: ['City View', 'High-Speed Wi-Fi', 'Marble Rain Shower', 'Smart 65" TV', 'Nespresso Bar', 'Artisanal Bathrobes']
  },
  {
    id: 'executive-suite',
    name: 'Executive Business Lounge Suite',
    description: 'Separate formal living parlor, executive boardroom desk, marble bar with premium cellar selection, and VIP club lounge access.',
    basePrice: 16500,
    maxOccupancy: 3,
    bedType: '1 King Bed + 1 Daybed',
    sizeSqFt: 780,
    image: '/src/assets/images/hotel_suite_executive_1793117718620.jpg',
    amenities: ['Lounge Access', 'Deep Soaking Tub', 'Double Vanity', 'Bespoke Bar', 'Dedicated Butler Call', 'Turndown Service']
  },
  {
    id: 'presidential-penthouse',
    name: 'The Grand Sky Penthouse',
    description: 'Dual-level architectural masterpiece with 270° panoramic wraparound skyline glass, private terrace, grand piano, and dedicated concierge.',
    basePrice: 38000,
    maxOccupancy: 4,
    bedType: '2 Master King Bedrooms',
    sizeSqFt: 1850,
    image: '/src/assets/images/hotel_suite_penthouse_1793117719740.jpg',
    amenities: ['Private Elevator', 'Wraparound Terrace', 'Personal Chef Kitchen', 'Chauffeured Limousine', '24/7 Concierge', 'Complimentary Champagne']
  },
  {
    id: 'courtyard-double',
    name: 'Heritage Courtyard Double',
    description: 'Overlooking the landscaped fountain courtyard, dual queen beds with Egyptian cotton, and soundproof double-glazed windows.',
    basePrice: 7800,
    maxOccupancy: 4,
    bedType: '2 Queen Beds',
    sizeSqFt: 440,
    image: '/src/assets/images/hotel_suite_deluxe_1793117717496.jpg',
    amenities: ['Courtyard Garden View', 'Deep Sleep Soundproofing', 'Espresso Machine', 'Twin Rain Showers', 'Ergonomic Workstation']
  }
];

export const INITIAL_ROOMS: Room[] = [
  // Floor 1 (Heritage & Courtyard)
  { id: '101', number: '101', floor: 1, typeId: 'courtyard-double', status: 'occupied', currentGuest: 'Sophia Laurent', currentReservationId: 'RES-8921', lastCleanedAt: '2026-10-26 14:30', assignedStaff: 'Maria Santos' },
  { id: '102', number: '102', floor: 1, typeId: 'courtyard-double', status: 'available', lastCleanedAt: '2026-10-27 08:45', assignedStaff: 'Elena Ramos' },
  { id: '103', number: '103', floor: 1, typeId: 'courtyard-double', status: 'dirty', notes: 'Late checkout departure at 11:30 AM', lastCleanedAt: '2026-10-25 16:00', assignedStaff: 'Maria Santos' },
  { id: '104', number: '104', floor: 1, typeId: 'deluxe-king', status: 'occupied', currentGuest: 'Marcus Sterling', currentReservationId: 'RES-8922', lastCleanedAt: '2026-10-26 15:00', assignedStaff: 'Chen Wei' },
  { id: '105', number: '105', floor: 1, typeId: 'deluxe-king', status: 'reserved', currentGuest: 'David Kim', currentReservationId: 'RES-8923', lastCleanedAt: '2026-10-27 08:15', assignedStaff: 'Chen Wei' },
  { id: '106', number: '106', floor: 1, typeId: 'courtyard-double', status: 'inspected', lastCleanedAt: '2026-10-27 09:00', assignedStaff: 'Supervisor Rosa' },

  // Floor 2 (Deluxe & Executive)
  { id: '201', number: '201', floor: 2, typeId: 'deluxe-king', status: 'occupied', currentGuest: 'Victoria Vance', currentReservationId: 'RES-8924', lastCleanedAt: '2026-10-26 11:20', assignedStaff: 'Chen Wei' },
  { id: '202', number: '202', floor: 2, typeId: 'deluxe-king', status: 'cleaning', notes: 'Deep linen refresh in progress', lastCleanedAt: '2026-10-25 15:30', assignedStaff: 'Elena Ramos' },
  { id: '203', number: '203', floor: 2, typeId: 'deluxe-king', status: 'available', lastCleanedAt: '2026-10-27 07:30', assignedStaff: 'Elena Ramos' },
  { id: '204', number: '204', floor: 2, typeId: 'executive-suite', status: 'occupied', currentGuest: 'Alexander Wright', currentReservationId: 'RES-8925', lastCleanedAt: '2026-10-26 13:00', assignedStaff: 'Maria Santos' },
  { id: '205', number: '205', floor: 2, typeId: 'executive-suite', status: 'reserved', currentGuest: 'Amara Okafor', currentReservationId: 'RES-8926', lastCleanedAt: '2026-10-27 08:00', assignedStaff: 'Maria Santos' },
  { id: '206', number: '206', floor: 2, typeId: 'deluxe-king', status: 'out_of_order', notes: 'Bathroom mixer tap replacement', assignedStaff: 'Tech Kevin' },

  // Floor 3 (High Executive)
  { id: '301', number: '301', floor: 3, typeId: 'executive-suite', status: 'occupied', currentGuest: 'Jonathan Hayes', currentReservationId: 'RES-8920', lastCleanedAt: '2026-10-26 16:30', assignedStaff: 'Chen Wei' },
  { id: '302', number: '302', floor: 3, typeId: 'executive-suite', status: 'inspected', lastCleanedAt: '2026-10-27 08:30', assignedStaff: 'Supervisor Rosa' },
  { id: '303', number: '303', floor: 3, typeId: 'deluxe-king', status: 'available', lastCleanedAt: '2026-10-27 07:45', assignedStaff: 'Elena Ramos' },
  { id: '304', number: '304', floor: 3, typeId: 'deluxe-king', status: 'occupied', currentGuest: 'Camila Rodriguez', currentReservationId: 'RES-8927', lastCleanedAt: '2026-10-26 12:00', assignedStaff: 'Chen Wei' },
  { id: '305', number: '305', floor: 3, typeId: 'executive-suite', status: 'dirty', notes: 'Guest checked out 10:15 AM', lastCleanedAt: '2026-10-25 14:00', assignedStaff: 'Maria Santos' },
  { id: '306', number: '306', floor: 3, typeId: 'deluxe-king', status: 'available', lastCleanedAt: '2026-10-27 08:50', assignedStaff: 'Elena Ramos' },

  // Floor 4 (Penthouse & Top Executive)
  { id: '401', number: '401', floor: 4, typeId: 'presidential-penthouse', status: 'occupied', currentGuest: 'Lord Julian Hawthorne', currentReservationId: 'RES-8928', lastCleanedAt: '2026-10-26 17:00', assignedStaff: 'Supervisor Rosa' },
  { id: '402', number: '402', floor: 4, typeId: 'presidential-penthouse', status: 'reserved', currentGuest: 'Evelyn Montgomery', currentReservationId: 'RES-8929', lastCleanedAt: '2026-10-27 09:10', assignedStaff: 'Supervisor Rosa' },
  { id: '403', number: '403', floor: 4, typeId: 'executive-suite', status: 'available', lastCleanedAt: '2026-10-27 08:10', assignedStaff: 'Chen Wei' },
  { id: '404', number: '404', floor: 4, typeId: 'executive-suite', status: 'occupied', currentGuest: 'Dr. Sanjay Patel', currentReservationId: 'RES-8930', lastCleanedAt: '2026-10-26 10:00', assignedStaff: 'Maria Santos' }
];

export const INITIAL_GUESTS: Guest[] = [
  {
    id: 'GST-101',
    name: 'Jonathan Hayes',
    email: 'j.hayes@apexcapital.com',
    phone: '+91 98201 99012',
    idPassportNumber: 'IND-982341908',
    address: 'Nariman Point, Marine Drive, Mumbai',
    vipLevel: 'Black Diamond VIP',
    totalStays: 14,
    lifetimeSpend: 845000,
    notes: 'Prefers high floor, extra goose down pillows, sparkling San Pellegrino in minibar.',
    preferences: ['Extra Pillows', 'High Floor', 'Late Checkout 2PM', 'Sparkling Water'],
    currentRoom: '301'
  },
  {
    id: 'GST-102',
    name: 'Sophia Laurent',
    email: 'sophia.laurent@parisart.fr',
    phone: '+33 6 40 19 82 71',
    idPassportNumber: 'FRA-48910283',
    address: '18 Rue de la Paix, 75002 Paris',
    vipLevel: 'Gold',
    totalStays: 6,
    lifetimeSpend: 280000,
    notes: 'Allergic to feather pillows, requests hypoallergenic synthetic bedding.',
    preferences: ['Hypoallergenic Linens', 'Quiet Courtyard View', 'Decaf Espresso'],
    currentRoom: '101'
  },
  {
    id: 'GST-103',
    name: 'Lord Julian Hawthorne',
    email: 'julian@hawthorne-estate.co.uk',
    phone: '+44 20 7946 0912',
    idPassportNumber: 'GBR-88192039',
    address: 'Hawthorne Hall, Gloucestershire, UK',
    vipLevel: 'Black Diamond VIP',
    totalStays: 22,
    lifetimeSpend: 1950000,
    notes: 'Requires private direct elevator bypass and 7:00 AM Financial Times printed.',
    preferences: ['Terrace Morning Sun', 'Private Valet', 'Vintage Champagne on Arrival'],
    currentRoom: '401'
  },
  {
    id: 'GST-104',
    name: 'Alexander Wright',
    email: 'awright@quantumcore.tech',
    phone: '+91 98450 12390',
    idPassportNumber: 'IND-671239081',
    address: 'Indiranagar, Bangalore, Karnataka',
    vipLevel: 'Silver',
    totalStays: 4,
    lifetimeSpend: 145000,
    preferences: ['High-speed LAN cable', 'Ergonomic Chair'],
    currentRoom: '204'
  },
  {
    id: 'GST-105',
    name: 'Victoria Vance',
    email: 'victoria.vance@archstudio.de',
    phone: '+49 171 892109',
    idPassportNumber: 'DEU-19028471',
    address: 'Kurfürstendamm 142, Berlin',
    vipLevel: 'Gold',
    totalStays: 7,
    lifetimeSpend: 340000,
    preferences: ['East Facing Window', 'Soy Milk in Room'],
    currentRoom: '201'
  },
  {
    id: 'GST-106',
    name: 'David Kim',
    email: 'dkim@seoulbio.kr',
    phone: '+82 10 9982 1204',
    idPassportNumber: 'KOR-98120394',
    address: 'Gangnam-gu, Seoul',
    vipLevel: 'Standard',
    totalStays: 2,
    lifetimeSpend: 54000,
    preferences: ['Near Elevator', 'Double Keycards']
  },
  {
    id: 'GST-107',
    name: 'Amara Okafor',
    email: 'amara@okaforcapital.ng',
    phone: '+234 803 912 3456',
    idPassportNumber: 'NGA-39018274',
    address: 'Victoria Island, Lagos',
    vipLevel: 'Gold',
    totalStays: 5,
    lifetimeSpend: 245000,
    preferences: ['Airport Shuttle Transfer', 'Room Temperature 21°C']
  }
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'RES-8920',
    confirmationCode: 'HP-948102',
    guestId: 'GST-101',
    guestName: 'Jonathan Hayes',
    guestEmail: 'j.hayes@apexcapital.com',
    guestPhone: '+91 98201 99012',
    roomNumber: '301',
    roomTypeId: 'executive-suite',
    checkInDate: '2026-10-25',
    checkOutDate: '2026-10-29',
    nights: 4,
    adults: 1,
    children: 0,
    status: 'checked_in',
    ratePerNight: 16500,
    totalAmount: 77880.00,
    paidAmount: 77880.00,
    paymentStatus: 'paid',
    createdAt: '2026-10-18',
    keyCardIssued: true,
    keyCardCode: 'KC-301-8920',
    specialRequests: 'Black Diamond VIP amenities package, extra San Pellegrino.',
    folio: [
      { id: 'f1', date: '2026-10-25', time: '15:00', description: 'Room Charge - Executive Suite (Night 1)', category: 'room', amount: 16500 },
      { id: 'f2', date: '2026-10-25', time: '15:00', description: 'Luxury GST Tax (18%)', category: 'tax', amount: 2970 },
      { id: 'f3', date: '2026-10-25', time: '19:45', description: 'The Grand Brass Dining - Royal Awadhi Dinner & Wine', category: 'dining', amount: 6850 },
      { id: 'f4', date: '2026-10-26', time: '15:00', description: 'Room Charge - Executive Suite (Night 2)', category: 'room', amount: 16500 },
      { id: 'f5', date: '2026-10-26', time: '15:00', description: 'Luxury GST Tax (18%)', category: 'tax', amount: 2970 },
      { id: 'f6', date: '2026-10-26', time: '16:30', description: 'The Spa at HotelPro - 90min Ayurvedic Deep Tissue Therapy', category: 'spa', amount: 7200 },
      { id: 'f7', date: '2026-10-26', time: '22:15', description: 'In-Room Minibar - Premium Malt & Sparkling Water', category: 'minibar', amount: 3450 },
      { id: 'f8', date: '2026-10-27', time: '15:00', description: 'Room Charge - Executive Suite (Night 3)', category: 'room', amount: 16500 },
      { id: 'f9', date: '2026-10-27', time: '15:00', description: 'Luxury GST Tax (18%)', category: 'tax', amount: 2970 },
      { id: 'f10', date: '2026-10-27', time: '18:00', description: 'Corporate Advance Payment (Settled)', category: 'payment', amount: -77880.00, reference: 'HDFC-CORP-8192' }
    ]
  },
  {
    id: 'RES-8921',
    confirmationCode: 'HP-948103',
    guestId: 'GST-102',
    guestName: 'Sophia Laurent',
    guestEmail: 'sophia.laurent@parisart.fr',
    guestPhone: '+33 6 40 19 82 71',
    roomNumber: '101',
    roomTypeId: 'courtyard-double',
    checkInDate: '2026-10-26',
    checkOutDate: '2026-10-28',
    nights: 2,
    adults: 2,
    children: 0,
    status: 'checked_in',
    ratePerNight: 7800,
    totalAmount: 19884.00,
    paidAmount: 19884.00,
    paymentStatus: 'paid',
    createdAt: '2026-10-20',
    keyCardIssued: true,
    keyCardCode: 'KC-101-8921',
    specialRequests: 'Synthetic pillows and quiet courtyard room.',
    folio: [
      { id: 'f11', date: '2026-10-26', time: '14:00', description: 'Room Charge - Heritage Courtyard (Night 1)', category: 'room', amount: 7800 },
      { id: 'f12', date: '2026-10-26', time: '14:00', description: 'Hospitality GST (18%)', category: 'tax', amount: 1404 },
      { id: 'f13', date: '2026-10-27', time: '08:30', description: 'Courtyard Bistro Artisan Breakfast', category: 'dining', amount: 1480 },
      { id: 'f14', date: '2026-10-27', time: '14:00', description: 'Room Charge - Heritage Courtyard (Night 2)', category: 'room', amount: 7800 },
      { id: 'f15', date: '2026-10-27', time: '14:00', description: 'Hospitality GST (18%)', category: 'tax', amount: 1404 },
      { id: 'f16', date: '2026-10-26', time: '14:15', description: 'Pre-authorized Visa Platinum', category: 'payment', amount: -19884.00, reference: 'VISA-4091' }
    ]
  },
  {
    id: 'RES-8928',
    confirmationCode: 'HP-948110',
    guestId: 'GST-103',
    guestName: 'Lord Julian Hawthorne',
    guestEmail: 'julian@hawthorne-estate.co.uk',
    guestPhone: '+44 20 7946 0912',
    roomNumber: '401',
    roomTypeId: 'presidential-penthouse',
    checkInDate: '2026-10-24',
    checkOutDate: '2026-10-30',
    nights: 6,
    adults: 2,
    children: 0,
    status: 'checked_in',
    ratePerNight: 38000,
    totalAmount: 285400.00,
    paidAmount: 150000.00,
    paymentStatus: 'partial',
    createdAt: '2026-10-01',
    keyCardIssued: true,
    keyCardCode: 'KC-401-8928',
    specialRequests: 'Dom Pérignon 2012 on ice upon arrival, private direct lift.',
    folio: [
      { id: 'f17', date: '2026-10-24', time: '16:00', description: 'Sky Penthouse Suite (Night 1)', category: 'room', amount: 38000 },
      { id: 'f18', date: '2026-10-24', time: '16:00', description: 'Hospitality GST (18%)', category: 'tax', amount: 6840 },
      { id: 'f19', date: '2026-10-25', time: '16:00', description: 'Sky Penthouse Suite (Night 2)', category: 'room', amount: 38000 },
      { id: 'f20', date: '2026-10-25', time: '16:00', description: 'Hospitality GST (18%)', category: 'tax', amount: 6840 },
      { id: 'f21', date: '2026-10-25', time: '20:30', description: 'Private Chef Dining Experience', category: 'dining', amount: 18500 },
      { id: 'f22', date: '2026-10-26', time: '16:00', description: 'Sky Penthouse Suite (Night 3)', category: 'room', amount: 38000 },
      { id: 'f23', date: '2026-10-26', time: '16:00', description: 'Hospitality GST (18%)', category: 'tax', amount: 6840 },
      { id: 'f24', date: '2026-10-26', time: '11:00', description: 'Chauffeured Airport Mercedes S-Class Transfer', category: 'valet', amount: 7500 },
      { id: 'f25', date: '2026-10-24', time: '16:30', description: 'Mastercard Centurion Deposit', category: 'payment', amount: -150000.00, reference: 'MC-0012' }
    ]
  },
  {
    id: 'RES-8923',
    confirmationCode: 'HP-948112',
    guestId: 'GST-106',
    guestName: 'David Kim',
    guestEmail: 'dkim@seoulbio.kr',
    guestPhone: '+82 10 9982 1204',
    roomNumber: '105',
    roomTypeId: 'deluxe-king',
    checkInDate: '2026-10-27',
    checkOutDate: '2026-10-31',
    nights: 4,
    adults: 1,
    children: 0,
    status: 'confirmed',
    ratePerNight: 9500,
    totalAmount: 44840.00,
    paidAmount: 0,
    paymentStatus: 'unpaid',
    createdAt: '2026-10-22',
    keyCardIssued: false,
    specialRequests: 'Arriving approximately 2:30 PM from airport flight KE081.',
    folio: [
      { id: 'f26', date: '2026-10-27', time: '15:00', description: 'Expected Room Charge - Deluxe King Suite (4 nights)', category: 'room', amount: 38000 },
      { id: 'f27', date: '2026-10-27', time: '15:00', description: 'Estimated Taxes & Service Fees (18% GST)', category: 'tax', amount: 6840 }
    ]
  },
  {
    id: 'RES-8926',
    confirmationCode: 'HP-948115',
    guestId: 'GST-107',
    guestName: 'Amara Okafor',
    guestEmail: 'amara@okaforcapital.ng',
    guestPhone: '+234 803 912 3456',
    roomNumber: '205',
    roomTypeId: 'executive-suite',
    checkInDate: '2026-10-27',
    checkOutDate: '2026-10-30',
    nights: 3,
    adults: 2,
    children: 0,
    status: 'confirmed',
    ratePerNight: 16500,
    totalAmount: 58410.00,
    paidAmount: 20000.00,
    paymentStatus: 'partial',
    createdAt: '2026-10-24',
    keyCardIssued: false,
    specialRequests: 'Airport transfer confirmed. High floor suite preferred.',
    folio: [
      { id: 'f28', date: '2026-10-27', time: '14:00', description: 'Executive Suite (3 nights)', category: 'room', amount: 49500 },
      { id: 'f29', date: '2026-10-27', time: '14:00', description: 'Taxes & City Fees (18% GST)', category: 'tax', amount: 8910 },
      { id: 'f30', date: '2026-10-24', time: '11:20', description: 'Advance Booking Deposit', category: 'payment', amount: -20000.00, reference: 'VISA-9912' }
    ]
  },
  {
    id: 'RES-8929',
    confirmationCode: 'HP-948119',
    guestId: 'GST-108',
    guestName: 'Evelyn Montgomery',
    guestEmail: 'evelyn@montgomeryarts.org',
    guestPhone: '+1 (312) 555-8912',
    roomNumber: '402',
    roomTypeId: 'presidential-penthouse',
    checkInDate: '2026-10-27',
    checkOutDate: '2026-11-02',
    nights: 6,
    adults: 2,
    children: 0,
    status: 'confirmed',
    ratePerNight: 38000,
    totalAmount: 269040.00,
    paidAmount: 100000.00,
    paymentStatus: 'partial',
    createdAt: '2026-10-15',
    keyCardIssued: false,
    specialRequests: 'Celebrating 20th Wedding Anniversary. Fresh orchids in master bath.',
    folio: [
      { id: 'f31', date: '2026-10-27', time: '15:00', description: 'Grand Sky Penthouse 402 (6 nights)', category: 'room', amount: 228000 },
      { id: 'f32', date: '2026-10-27', time: '15:00', description: 'Hospitality GST (18%)', category: 'tax', amount: 41040 },
      { id: 'f33', date: '2026-10-15', time: '10:00', description: 'Reservation Guarantee Deposit', category: 'payment', amount: -100000.00, reference: 'AMEX-0021' }
    ]
  }
];

export const INITIAL_HOUSEKEEPING_TASKS: HousekeepingTask[] = [
  {
    id: 'HK-401',
    roomNumber: '103',
    taskType: 'full_clean',
    priority: 'high',
    status: 'pending',
    assignedTo: 'Maria Santos',
    reportedAt: '10:30 AM',
    checklist: [
      { id: 'c1', label: 'Strip and replace bed linens with 400-thread count cotton', checked: false },
      { id: 'c2', label: 'Sanitize bathroom, mirrors, and replace plush towel sets', checked: false },
      { id: 'c3', label: 'Vacuum wool carpet and dust architectural surfaces', checked: false },
      { id: 'c4', label: 'Restock Nespresso pods, bottled water, and organic toiletries', checked: false },
      { id: 'c5', label: 'Verify high-speed Wi-Fi, HVAC set to 21.5°C, and TV welcome card', checked: false }
    ],
    notes: 'Next guest scheduled for 3:00 PM check-in.'
  },
  {
    id: 'HK-402',
    roomNumber: '202',
    taskType: 'full_clean',
    priority: 'medium',
    status: 'in_progress',
    assignedTo: 'Elena Ramos',
    reportedAt: '09:15 AM',
    checklist: [
      { id: 'c1', label: 'Strip and replace bed linens with 400-thread count cotton', checked: true },
      { id: 'c2', label: 'Sanitize bathroom, mirrors, and replace plush towel sets', checked: true },
      { id: 'c3', label: 'Vacuum wool carpet and dust architectural surfaces', checked: false },
      { id: 'c4', label: 'Restock Nespresso pods, bottled water, and organic toiletries', checked: false },
      { id: 'c5', label: 'Verify high-speed Wi-Fi, HVAC set to 21.5°C, and TV welcome card', checked: false }
    ],
    notes: 'In progress now, approximately 20 minutes remaining.'
  },
  {
    id: 'HK-403',
    roomNumber: '305',
    taskType: 'full_clean',
    priority: 'high',
    status: 'pending',
    assignedTo: 'Chen Wei',
    reportedAt: '10:20 AM',
    checklist: [
      { id: 'c1', label: 'Full turnover clean & sanitize', checked: false },
      { id: 'c2', label: 'Restock complimentary bar & espresso', checked: false },
      { id: 'c3', label: 'Inspect safe and balcony latch', checked: false }
    ],
    notes: 'VIP guest arrival requested early check-in if possible.'
  },
  {
    id: 'HK-404',
    roomNumber: '106',
    taskType: 'inspection',
    priority: 'low',
    status: 'completed',
    assignedTo: 'Supervisor Rosa',
    reportedAt: '08:45 AM',
    checklist: [
      { id: 'c1', label: 'Quality inspection checklist passed', checked: true },
      { id: 'c2', label: 'Room sealed and marked Inspected / Ready for Arrival', checked: true }
    ],
    notes: 'Pristine condition.'
  }
];

export const INITIAL_MAINTENANCE_TICKETS: MaintenanceTicket[] = [
  {
    id: 'MNT-101',
    ticketCode: 'TKT-9912',
    roomNumber: '206',
    area: 'Master En-suite Bathroom',
    issue: 'Thermostatic shower mixer cartridge leaking, water temperature fluctuating.',
    priority: 'high',
    status: 'in_progress',
    reportedBy: 'Housekeeper Elena',
    reportedAt: '2026-10-26 16:40',
    resolutionNotes: 'Replacement Grohe cartridge dispatched with engineering tech Kevin.'
  },
  {
    id: 'MNT-102',
    ticketCode: 'TKT-9913',
    roomNumber: '304',
    area: 'Living Space HVAC',
    issue: 'Slight fan vibration noise on low fan mode.',
    priority: 'medium',
    status: 'open',
    reportedBy: 'Guest Camila Rodriguez',
    reportedAt: '2026-10-27 08:10'
  },
  {
    id: 'MNT-103',
    ticketCode: 'TKT-9914',
    roomNumber: 'Floor 4 Hallway',
    area: 'North Elevator Foyer',
    issue: 'Sconce recessed accent LED driver flicker.',
    priority: 'low',
    status: 'resolved',
    reportedBy: 'Front Desk Elena',
    reportedAt: '2026-10-25 11:00',
    resolvedAt: '2026-10-26 09:30',
    resolutionNotes: 'Driver unit replaced with 24V constant voltage supply. Tested stable.'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Elena Vance',
    email: 'elena.vance@hotelpro-grand.com',
    role: 'front_desk',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c3ItMSIsInJvbGUiOiJmcm9udF9kZXNrIn0.hotelpro_sig_99812',
    expiresIn: '2026-10-28 08:00 UTC'
  },
  {
    id: 'usr-2',
    name: 'Alexander Cross',
    email: 'admin.cross@hotelpro-grand.com',
    role: 'admin',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c3ItMiIsInJvbGUiOiJhZG1pbiJ9.hotelpro_sig_admin_77819',
    expiresIn: '2026-10-28 08:00 UTC'
  },
  {
    id: 'usr-3',
    name: 'Rosa Mendez',
    email: 'rosa.m@hotelpro-grand.com',
    role: 'housekeeping',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c3ItMyIsInJvbGUiOiJob3VzZWtlZXBpbmcifQ.hotelpro_sig_hk_11892',
    expiresIn: '2026-10-28 08:00 UTC'
  },
  {
    id: 'usr-4',
    name: 'Sarah Lin',
    email: 'sarah.lin@hotelpro-grand.com',
    role: 'revenue_manager',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c3ItNCIsInJvbGUiOiJyZXZlbnVlX21hbmFnZXIifQ.hotelpro_sig_rev_44128',
    expiresIn: '2026-10-28 08:00 UTC'
  },
  {
    id: 'usr-5',
    name: 'Jonathan Hayes',
    email: 'j.hayes@apexcapital.com',
    role: 'guest',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c3ItNSIsInJvbGUiOiJndWVzdCJ9.hotelpro_sig_gst_30101',
    expiresIn: '2026-10-28 08:00 UTC'
  }
];
