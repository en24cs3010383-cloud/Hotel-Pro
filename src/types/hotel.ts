export type UserRole = 'admin' | 'front_desk' | 'housekeeping' | 'revenue_manager' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  token: string;
  expiresIn: string;
}

export type RoomStatus =
  | 'available'
  | 'occupied'
  | 'reserved'
  | 'dirty'
  | 'cleaning'
  | 'inspected'
  | 'out_of_order';

export interface RoomType {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  maxOccupancy: number;
  bedType: string;
  sizeSqFt: number;
  image: string;
  amenities: string[];
}

export interface Room {
  id: string;
  number: string;
  floor: number;
  typeId: string;
  status: RoomStatus;
  currentGuest?: string;
  currentReservationId?: string;
  notes?: string;
  lastCleanedAt?: string;
  assignedStaff?: string;
}

export type ReservationStatus =
  | 'confirmed'
  | 'checked_in'
  | 'checked_out'
  | 'cancelled'
  | 'no_show';

export interface FolioItem {
  id: string;
  date: string;
  time: string;
  description: string;
  category: 'room' | 'dining' | 'spa' | 'minibar' | 'valet' | 'tax' | 'payment';
  amount: number; // positive for charges, negative for payments
  reference?: string;
}

export interface Reservation {
  id: string;
  confirmationCode: string;
  guestId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomNumber: string;
  roomTypeId: string;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  nights: number;
  adults: number;
  children: number;
  status: ReservationStatus;
  ratePerNight: number;
  totalAmount: number;
  paidAmount: number;
  folio: FolioItem[];
  specialRequests?: string;
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  createdAt: string;
  keyCardIssued?: boolean;
  keyCardCode?: string;
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  idPassportNumber: string;
  address: string;
  vipLevel: 'Standard' | 'Silver' | 'Gold' | 'Black Diamond VIP';
  totalStays: number;
  lifetimeSpend: number;
  notes?: string;
  preferences: string[];
  currentRoom?: string;
}

export interface HousekeepingTask {
  id: string;
  roomNumber: string;
  taskType: 'full_clean' | 'turndown' | 'inspection' | 'repair' | 'linen_change';
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo: string;
  reportedAt: string;
  checklist: {
    id: string;
    label: string;
    checked: boolean;
  }[];
  notes?: string;
}

export interface MaintenanceTicket {
  id: string;
  ticketCode: string;
  roomNumber: string;
  area: string;
  issue: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'resolved';
  reportedBy: string;
  reportedAt: string;
  resolvedAt?: string;
  resolutionNotes?: string;
}

export interface HotelKPIs {
  occupancyRate: number;
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  dirtyRooms: number;
  inspectedRooms: number;
  expectedArrivals: number;
  expectedDepartures: number;
  adr: number; // Average Daily Rate
  revPar: number; // Revenue Per Available Room
  totalRevenueToday: number;
  pendingHousekeepingTasks: number;
}
