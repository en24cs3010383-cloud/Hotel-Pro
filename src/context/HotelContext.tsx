import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Room,
  RoomType,
  Reservation,
  Guest,
  HousekeepingTask,
  MaintenanceTicket,
  User,
  HotelKPIs,
  FolioItem,
  RoomStatus
} from '../types/hotel';
import {
  INITIAL_ROOMS,
  INITIAL_ROOM_TYPES,
  INITIAL_RESERVATIONS,
  INITIAL_GUESTS,
  INITIAL_HOUSEKEEPING_TASKS,
  INITIAL_MAINTENANCE_TICKETS,
  INITIAL_USERS
} from '../data/mockHotelData';

interface HotelContextType {
  rooms: Room[];
  roomTypes: RoomType[];
  reservations: Reservation[];
  guests: Guest[];
  housekeepingTasks: HousekeepingTask[];
  maintenanceTickets: MaintenanceTicket[];
  currentUser: User;
  users: User[];
  currentDate: string;
  currentTime: string;
  kpis: HotelKPIs;
  setCurrentUser: (user: User) => void;
  switchRole: (role: User['role']) => void;
  createReservation: (data: {
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    roomTypeId: string;
    roomNumber: string;
    checkInDate: string;
    checkOutDate: string;
    adults: number;
    children: number;
    specialRequests?: string;
    ratePerNight: number;
  }) => Reservation;
  checkInGuest: (reservationId: string, targetRoomNumber?: string) => void;
  checkOutGuest: (reservationId: string) => void;
  cancelReservation: (reservationId: string) => void;
  updateRoomStatus: (roomNumber: string, status: RoomStatus, notes?: string) => void;
  addFolioCharge: (
    reservationId: string,
    charge: { description: string; category: FolioItem['category']; amount: number }
  ) => void;
  recordFolioPayment: (
    reservationId: string,
    amount: number,
    referenceMethod: string
  ) => void;
  createHousekeepingTask: (
    task: Omit<HousekeepingTask, 'id' | 'reportedAt'>
  ) => void;
  updateHousekeepingTask: (
    taskId: string,
    status: HousekeepingTask['status'],
    checklist?: HousekeepingTask['checklist'],
    notes?: string
  ) => void;
  createMaintenanceTicket: (
    ticket: Omit<MaintenanceTicket, 'id' | 'ticketCode' | 'reportedAt'>
  ) => void;
  updateMaintenanceTicket: (
    ticketId: string,
    status: MaintenanceTicket['status'],
    resolutionNotes?: string
  ) => void;
  updateGuestProfile: (guest: Guest) => void;
  resetDemoData: () => void;
}

const STORAGE_KEYS = {
  ROOMS: 'hotelpro_rooms_v3_inr_rupees',
  RESERVATIONS: 'hotelpro_reservations_v3_inr_rupees',
  GUESTS: 'hotelpro_guests_v3_inr_rupees',
  TASKS: 'hotelpro_tasks_v3_inr_rupees',
  MAINTENANCE: 'hotelpro_maintenance_v3_inr_rupees',
  CURRENT_USER: 'hotelpro_current_user_v3_inr_rupees'
};

const HotelContext = createContext<HotelContextType | undefined>(undefined);

export const HotelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const currentDate = '2026-10-27';
  const [currentTime, setCurrentTime] = useState('09:14 AM');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROOMS);
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  const [roomTypes] = useState<RoomType[]>(INITIAL_ROOM_TYPES);

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
  });

  const [guests, setGuests] = useState<Guest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GUESTS);
    return saved ? JSON.parse(saved) : INITIAL_GUESTS;
  });

  const [housekeepingTasks, setHousekeepingTasks] = useState<HousekeepingTask[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    return saved ? JSON.parse(saved) : INITIAL_HOUSEKEEPING_TASKS;
  });

  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceTicket[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MAINTENANCE);
    return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE_TICKETS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // Default: Front desk Elena
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(guests));
  }, [guests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(housekeepingTasks));
  }, [housekeepingTasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify(maintenanceTickets));
  }, [maintenanceTickets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  const switchRole = (role: User['role']) => {
    const match = INITIAL_USERS.find(u => u.role === role) || INITIAL_USERS[0];
    setCurrentUser(match);
  };

  // Calculate high-precision KPIs
  const kpis: HotelKPIs = useMemo(() => {
    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
    const dirtyRooms = rooms.filter(r => r.status === 'dirty' || r.status === 'cleaning').length;
    const inspectedRooms = rooms.filter(r => r.status === 'inspected').length;
    const availableRooms = rooms.filter(r => r.status === 'available' || r.status === 'inspected').length;

    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    // Expected arrivals & departures today
    const expectedArrivals = reservations.filter(
      r => r.checkInDate === currentDate && r.status === 'confirmed'
    ).length;

    const expectedDepartures = reservations.filter(
      r => r.checkOutDate === currentDate && r.status === 'checked_in'
    ).length;

    // Daily Room Revenue (sum of nightly rates of currently occupied rooms)
    const activeCheckedInRes = reservations.filter(r => r.status === 'checked_in');
    const roomRevenueToday = activeCheckedInRes.reduce((acc, curr) => acc + (curr.ratePerNight || 0), 0);
    const totalRevenueToday = activeCheckedInRes.reduce((acc, curr) => {
      // Charges recorded today
      const todayFolio = curr.folio
        .filter(f => f.date === currentDate && f.amount > 0)
        .reduce((sum, item) => sum + item.amount, 0);
      return acc + (todayFolio > 0 ? todayFolio : curr.ratePerNight);
    }, 0);

    const adr = occupiedRooms > 0 ? Math.round(roomRevenueToday / occupiedRooms) : 0;
    const revPar = totalRooms > 0 ? Math.round(roomRevenueToday / totalRooms) : 0;
    const pendingHousekeepingTasks = housekeepingTasks.filter(t => t.status !== 'completed').length;

    return {
      occupancyRate,
      totalRooms,
      occupiedRooms,
      availableRooms,
      dirtyRooms,
      inspectedRooms,
      expectedArrivals,
      expectedDepartures,
      adr,
      revPar,
      totalRevenueToday: totalRevenueToday > 0 ? totalRevenueToday : 145000,
      pendingHousekeepingTasks
    };
  }, [rooms, reservations, housekeepingTasks, currentDate]);

  const createReservation = (data: {
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    roomTypeId: string;
    roomNumber: string;
    checkInDate: string;
    checkOutDate: string;
    adults: number;
    children: number;
    specialRequests?: string;
    ratePerNight: number;
  }): Reservation => {
    const start = new Date(data.checkInDate);
    const end = new Date(data.checkOutDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const roomSubtotal = data.ratePerNight * nights;
    const taxes = +(roomSubtotal * 0.18).toFixed(2);
    const totalAmount = +(roomSubtotal + taxes).toFixed(2);

    const confCode = `HP-${Math.floor(100000 + Math.random() * 900000)}`;
    const resId = `RES-${Math.floor(1000 + Math.random() * 9000)}`;

    // Find or create guest
    let guest = guests.find(g => g.email.toLowerCase() === data.guestEmail.toLowerCase());
    let guestId = guest ? guest.id : `GST-${Math.floor(100 + Math.random() * 900)}`;

    if (!guest) {
      guest = {
        id: guestId,
        name: data.guestName,
        email: data.guestEmail,
        phone: data.guestPhone,
        idPassportNumber: `ID-${Math.floor(10000000 + Math.random() * 90000000)}`,
        address: 'Guest Provided Address',
        vipLevel: 'Standard',
        totalStays: 1,
        lifetimeSpend: totalAmount,
        notes: data.specialRequests,
        preferences: ['Standard Room Preference']
      };
      setGuests(prev => [guest!, ...prev]);
    } else {
      setGuests(prev =>
        prev.map(g =>
          g.id === guestId
            ? { ...g, totalStays: g.totalStays + 1, lifetimeSpend: g.lifetimeSpend + totalAmount }
            : g
        )
      );
    }

    const newReservation: Reservation = {
      id: resId,
      confirmationCode: confCode,
      guestId,
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      guestPhone: data.guestPhone,
      roomNumber: data.roomNumber,
      roomTypeId: data.roomTypeId,
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
      nights,
      adults: data.adults,
      children: data.children,
      status: 'confirmed',
      ratePerNight: data.ratePerNight,
      totalAmount,
      paidAmount: 0,
      paymentStatus: 'unpaid',
      createdAt: currentDate,
      specialRequests: data.specialRequests,
      folio: [
        {
          id: `fol-${Date.now()}-1`,
          date: data.checkInDate,
          time: '14:00',
          description: `Room Charge - ${nights} Night(s)`,
          category: 'room',
          amount: roomSubtotal
        },
        {
          id: `fol-${Date.now()}-2`,
          date: data.checkInDate,
          time: '14:00',
          description: 'Hospitality GST (18%)',
          category: 'tax',
          amount: taxes
        }
      ]
    };

    setReservations(prev => [newReservation, ...prev]);

    // Mark room as reserved if room assigned
    if (data.roomNumber) {
      setRooms(prev =>
        prev.map(r =>
          r.number === data.roomNumber
            ? {
                ...r,
                status: 'reserved',
                currentGuest: data.guestName,
                currentReservationId: resId
              }
            : r
        )
      );
    }

    return newReservation;
  };

  const checkInGuest = (reservationId: string, targetRoomNumber?: string) => {
    const res = reservations.find(r => r.id === reservationId);
    if (!res) return;

    const assignedRoom = targetRoomNumber || res.roomNumber;
    const keyCardCode = `KC-${assignedRoom}-${res.confirmationCode.slice(3)}`;

    // Update reservation
    setReservations(prev =>
      prev.map(r =>
        r.id === reservationId
          ? {
              ...r,
              roomNumber: assignedRoom,
              status: 'checked_in',
              keyCardIssued: true,
              keyCardCode
            }
          : r
      )
    );

    // Update room status
    setRooms(prev =>
      prev.map(r =>
        r.number === assignedRoom
          ? {
              ...r,
              status: 'occupied',
              currentGuest: res.guestName,
              currentReservationId: reservationId
            }
          : r
      )
    );

    // Update guest current room
    setGuests(prev =>
      prev.map(g => (g.id === res.guestId ? { ...g, currentRoom: assignedRoom } : g))
    );
  };

  const checkOutGuest = (reservationId: string) => {
    const res = reservations.find(r => r.id === reservationId);
    if (!res) return;

    setReservations(prev =>
      prev.map(r => (r.id === reservationId ? { ...r, status: 'checked_out' } : r))
    );

    // Mark room as dirty and trigger housekeeping task
    setRooms(prev =>
      prev.map(r =>
        r.number === res.roomNumber
          ? {
              ...r,
              status: 'dirty',
              currentGuest: undefined,
              currentReservationId: undefined,
              notes: `Departure checkout on ${currentDate}. Requires turnover.`
            }
          : r
      )
    );

    // Create a turnover housekeeping task
    createHousekeepingTask({
      roomNumber: res.roomNumber,
      taskType: 'full_clean',
      priority: 'high',
      status: 'pending',
      assignedTo: 'Maria Santos',
      checklist: [
        { id: '1', label: 'Complete linen stripping and bed dress', checked: false },
        { id: '2', label: 'Bathroom chemical wash and seal', checked: false },
        { id: '3', label: 'Replenish luxury amenities & minibar', checked: false },
        { id: '4', label: 'Floor vacuum & dust surfaces', checked: false },
        { id: '5', label: 'Supervisor ready inspection', checked: false }
      ],
      notes: `Turnover following checkout of ${res.guestName}.`
    });

    // Remove room from guest
    setGuests(prev =>
      prev.map(g => (g.id === res.guestId ? { ...g, currentRoom: undefined } : g))
    );
  };

  const cancelReservation = (reservationId: string) => {
    const res = reservations.find(r => r.id === reservationId);
    if (!res) return;

    setReservations(prev =>
      prev.map(r => (r.id === reservationId ? { ...r, status: 'cancelled' } : r))
    );

    if (res.roomNumber) {
      setRooms(prev =>
        prev.map(r =>
          r.number === res.roomNumber && r.status === 'reserved'
            ? { ...r, status: 'available', currentGuest: undefined, currentReservationId: undefined }
            : r
        )
      );
    }
  };

  const updateRoomStatus = (roomNumber: string, status: RoomStatus, notes?: string) => {
    setRooms(prev =>
      prev.map(r =>
        r.number === roomNumber
          ? {
              ...r,
              status,
              notes: notes !== undefined ? notes : r.notes,
              lastCleanedAt: status === 'inspected' || status === 'available' ? `${currentDate} 09:00` : r.lastCleanedAt
            }
          : r
      )
    );
  };

  const addFolioCharge = (
    reservationId: string,
    charge: { description: string; category: FolioItem['category']; amount: number }
  ) => {
    const newItem: FolioItem = {
      id: `fol-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      date: currentDate,
      time: currentTime,
      description: charge.description,
      category: charge.category,
      amount: charge.amount
    };

    setReservations(prev =>
      prev.map(res => {
        if (res.id !== reservationId) return res;
        const newFolio = [...res.folio, newItem];
        const newTotal = +(res.totalAmount + charge.amount).toFixed(2);
        const newPaymentStatus =
          res.paidAmount >= newTotal ? 'paid' : res.paidAmount > 0 ? 'partial' : 'unpaid';

        return {
          ...res,
          folio: newFolio,
          totalAmount: newTotal,
          paymentStatus: newPaymentStatus
        };
      })
    );
  };

  const recordFolioPayment = (
    reservationId: string,
    amount: number,
    referenceMethod: string
  ) => {
    const paymentItem: FolioItem = {
      id: `pay-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      date: currentDate,
      time: currentTime,
      description: `Payment Received - ${referenceMethod}`,
      category: 'payment',
      amount: -Math.abs(amount),
      reference: referenceMethod
    };

    setReservations(prev =>
      prev.map(res => {
        if (res.id !== reservationId) return res;
        const newFolio = [...res.folio, paymentItem];
        const newPaid = +(res.paidAmount + amount).toFixed(2);
        const newPaymentStatus = newPaid >= res.totalAmount - 0.05 ? 'paid' : 'partial';

        return {
          ...res,
          folio: newFolio,
          paidAmount: newPaid,
          paymentStatus: newPaymentStatus
        };
      })
    );
  };

  const createHousekeepingTask = (
    task: Omit<HousekeepingTask, 'id' | 'reportedAt'>
  ) => {
    const newTask: HousekeepingTask = {
      ...task,
      id: `HK-${Math.floor(500 + Math.random() * 500)}`,
      reportedAt: currentTime
    };
    setHousekeepingTasks(prev => [newTask, ...prev]);
  };

  const updateHousekeepingTask = (
    taskId: string,
    status: HousekeepingTask['status'],
    checklist?: HousekeepingTask['checklist'],
    notes?: string
  ) => {
    setHousekeepingTasks(prev =>
      prev.map(t => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          status,
          checklist: checklist || t.checklist,
          notes: notes !== undefined ? notes : t.notes
        };
      })
    );

    // If task completed, check if room can be set to inspected
    const task = housekeepingTasks.find(t => t.id === taskId);
    if (task && status === 'completed') {
      updateRoomStatus(task.roomNumber, 'inspected');
    } else if (task && status === 'in_progress') {
      updateRoomStatus(task.roomNumber, 'cleaning');
    }
  };

  const createMaintenanceTicket = (
    ticket: Omit<MaintenanceTicket, 'id' | 'ticketCode' | 'reportedAt'>
  ) => {
    const newTicket: MaintenanceTicket = {
      ...ticket,
      id: `MNT-${Math.floor(200 + Math.random() * 800)}`,
      ticketCode: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      reportedAt: `${currentDate} ${currentTime}`
    };
    setMaintenanceTickets(prev => [newTicket, ...prev]);

    // If high or urgent, mark room out of order
    if (ticket.priority === 'urgent' || ticket.priority === 'high') {
      updateRoomStatus(ticket.roomNumber, 'out_of_order', ticket.issue);
    }
  };

  const updateMaintenanceTicket = (
    ticketId: string,
    status: MaintenanceTicket['status'],
    resolutionNotes?: string
  ) => {
    setMaintenanceTickets(prev =>
      prev.map(t =>
        t.id === ticketId
          ? {
              ...t,
              status,
              resolutionNotes: resolutionNotes || t.resolutionNotes,
              resolvedAt: status === 'resolved' ? `${currentDate} ${currentTime}` : t.resolvedAt
            }
          : t
      )
    );

    const ticket = maintenanceTickets.find(t => t.id === ticketId);
    if (ticket && status === 'resolved') {
      // Room can return to dirty for cleaning inspection
      updateRoomStatus(ticket.roomNumber, 'dirty', 'Maintenance completed. Requires clean.');
    }
  };

  const updateGuestProfile = (guest: Guest) => {
    setGuests(prev => prev.map(g => (g.id === guest.id ? guest : g)));
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.ROOMS);
    localStorage.removeItem(STORAGE_KEYS.RESERVATIONS);
    localStorage.removeItem(STORAGE_KEYS.GUESTS);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.MAINTENANCE);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);

    setRooms(INITIAL_ROOMS);
    setReservations(INITIAL_RESERVATIONS);
    setGuests(INITIAL_GUESTS);
    setHousekeepingTasks(INITIAL_HOUSEKEEPING_TASKS);
    setMaintenanceTickets(INITIAL_MAINTENANCE_TICKETS);
    setCurrentUser(INITIAL_USERS[0]);
  };

  return (
    <HotelContext.Provider
      value={{
        rooms,
        roomTypes,
        reservations,
        guests,
        housekeepingTasks,
        maintenanceTickets,
        currentUser,
        users: INITIAL_USERS,
        currentDate,
        currentTime,
        kpis,
        setCurrentUser,
        switchRole,
        createReservation,
        checkInGuest,
        checkOutGuest,
        cancelReservation,
        updateRoomStatus,
        addFolioCharge,
        recordFolioPayment,
        createHousekeepingTask,
        updateHousekeepingTask,
        createMaintenanceTicket,
        updateMaintenanceTicket,
        updateGuestProfile,
        resetDemoData
      }}
    >
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = () => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error('useHotel must be used within a HotelProvider');
  }
  return context;
};
