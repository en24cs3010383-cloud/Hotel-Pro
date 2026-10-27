import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { Reservation, ReservationStatus } from '../types/hotel';
import {
  Calendar,
  Search,
  Filter,
  User,
  Plus,
  LogIn,
  LogOut,
  Receipt,
  XCircle,
  Clock,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

interface ReservationsViewProps {
  onOpenNewReservation: () => void;
  onCheckIn: (resId: string) => void;
  onCheckOut: (resId: string) => void;
  onOpenFolio: (resId: string) => void;
}

export const ReservationsView: React.FC<ReservationsViewProps> = ({
  onOpenNewReservation,
  onCheckIn,
  onCheckOut,
  onOpenFolio
}) => {
  const { reservations, cancelReservation, roomTypes, currentDate } = useHotel();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'list' | 'timeline'>('list');

  const filteredReservations = reservations.filter(res => {
    if (statusFilter !== 'all' && res.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = res.guestName.toLowerCase().includes(q);
      const matchConf = res.confirmationCode.toLowerCase().includes(q);
      const matchRoom = res.roomNumber.toLowerCase().includes(q);
      const matchEmail = res.guestEmail.toLowerCase().includes(q);
      if (!matchName && !matchConf && !matchRoom && !matchEmail) return false;
    }
    return true;
  });

  const getStatusBadge = (status: ReservationStatus) => {
    switch (status) {
      case 'confirmed':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'checked_in':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'checked_out':
        return 'text-slate-400 bg-slate-800 border-slate-700';
      case 'cancelled':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'no_show':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
    }
  };

  // Timeline 7-day helper dates: 2026-10-25 to 2026-10-31
  const timelineDates = [
    '2026-10-25',
    '2026-10-26',
    '2026-10-27',
    '2026-10-28',
    '2026-10-29',
    '2026-10-30',
    '2026-10-31'
  ];

  return (
    <div className="space-y-6">
      {/* Top Controls Header */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              <span>Reservation Management</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Live bookings ledger, guest confirmations, occupancy timeline & check-in routing
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View switcher tabs */}
            <div className="flex p-1 rounded-lg bg-slate-950 border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('list')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  activeTab === 'list' ? 'bg-slate-800 text-amber-400 shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Table View
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  activeTab === 'timeline' ? 'bg-slate-800 text-amber-400 shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                7-Day Calendar
              </button>
            </div>

            <button
              onClick={onOpenNewReservation}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Booking</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search guest name, conf #, room, email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 placeholder-slate-500"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto py-1">
            {[
              { id: 'all', label: 'All' },
              { id: 'confirmed', label: 'Confirmed' },
              { id: 'checked_in', label: 'In-House' },
              { id: 'checked_out', label: 'Departed' },
              { id: 'cancelled', label: 'Cancelled' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  statusFilter === tab.id
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content: Table or Visual Timeline */}
      {activeTab === 'list' ? (
        <div className="border border-slate-800 rounded-2xl bg-slate-900 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-medium">Confirmation</th>
                  <th className="py-3 px-4 font-medium">Guest Details</th>
                  <th className="py-3 px-4 font-medium">Room & Type</th>
                  <th className="py-3 px-4 font-medium">Stay Dates</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium text-right">Folio Total</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredReservations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No reservations found matching the current search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredReservations.map(res => {
                    const roomType = roomTypes.find(rt => rt.id === res.roomTypeId);
                    const charges = res.folio.filter(f => f.amount > 0).reduce((s, c) => s + c.amount, 0);
                    const payments = res.folio.filter(f => f.amount < 0).reduce((s, c) => s + Math.abs(c.amount), 0);
                    const balance = +(charges - payments).toFixed(2);

                    return (
                      <tr key={res.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-medium text-amber-400 whitespace-nowrap">
                          #{res.confirmationCode}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white">{res.guestName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{res.guestEmail}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-200">Room {res.roomNumber}</div>
                          <div className="text-[11px] text-slate-400">{roomType?.name}</div>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-300 whitespace-nowrap">
                          <div>
                            {res.checkInDate} → {res.checkOutDate}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {res.nights} Night(s) · {res.adults} Guest(s)
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-md font-mono text-[10px] uppercase font-semibold border ${getStatusBadge(
                              res.status
                            )}`}
                          >
                            {res.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums whitespace-nowrap">
                          <div className="font-bold text-slate-200">₹{res.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                          <div className={`text-[10px] ${balance > 0.01 ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {balance > 0.01 ? `Bal: ₹${balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : 'Settled'}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {res.status === 'confirmed' && (
                              <button
                                onClick={() => onCheckIn(res.id)}
                                className="px-2.5 py-1 rounded bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold transition-colors flex items-center gap-1"
                              >
                                <LogIn className="w-3 h-3" />
                                <span>Check-In</span>
                              </button>
                            )}

                            {res.status === 'checked_in' && (
                              <button
                                onClick={() => onCheckOut(res.id)}
                                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors flex items-center gap-1"
                              >
                                <LogOut className="w-3 h-3" />
                                <span>Check-Out</span>
                              </button>
                            )}

                            <button
                              onClick={() => onOpenFolio(res.id)}
                              className="px-2 py-1 rounded bg-slate-800/70 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
                              title="View and manage guest billing folio"
                            >
                              <Receipt className="w-3.5 h-3.5" />
                            </button>

                            {res.status === 'confirmed' && (
                              <button
                                onClick={() => cancelReservation(res.id)}
                                className="px-2 py-1 rounded text-rose-400 hover:bg-rose-500/10 transition-colors"
                                title="Cancel reservation"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Visual 7-Day Timeline Matrix */
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>7-Day Room Stay Distribution (Oct 25 - Oct 31, 2026)</span>
            <span className="font-mono text-amber-400">Current Today: {currentDate}</span>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[700px] space-y-2">
              {/* Header dates */}
              <div className="grid grid-cols-8 gap-2 font-mono text-[11px] text-slate-400 border-b border-slate-800 pb-2">
                <div className="font-medium text-slate-300">Room</div>
                {timelineDates.map(date => (
                  <div
                    key={date}
                    className={`text-center py-1 rounded ${
                      date === currentDate ? 'bg-amber-500/15 text-amber-400 font-bold' : ''
                    }`}
                  >
                    {date.slice(5)}
                  </div>
                ))}
              </div>

              {/* Room rows */}
              {['101', '104', '201', '204', '301', '401', '402'].map(roomNum => {
                const assignedRes = reservations.filter(
                  r => r.roomNumber === roomNum && r.status !== 'cancelled'
                );

                return (
                  <div
                    key={roomNum}
                    className="grid grid-cols-8 gap-2 items-center text-xs py-1.5 border-b border-slate-800/40"
                  >
                    <div className="font-mono font-bold text-white flex items-center gap-1">
                      <span>Room {roomNum}</span>
                    </div>

                    {timelineDates.map(date => {
                      const activeRes = assignedRes.find(
                        r => date >= r.checkInDate && date <= r.checkOutDate
                      );

                      if (activeRes) {
                        return (
                          <div
                            key={date}
                            onClick={() => onOpenFolio(activeRes.id)}
                            className={`p-1 text-[10px] rounded text-center truncate cursor-pointer transition-colors ${
                              activeRes.status === 'checked_in'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            }`}
                            title={`${activeRes.guestName} (${activeRes.status})`}
                          >
                            {activeRes.guestName.split(' ')[0]}
                          </div>
                        );
                      }

                      return (
                        <div
                          key={date}
                          className="p-1 text-[10px] text-slate-600 font-mono text-center bg-slate-950/40 rounded border border-slate-850"
                        >
                          Vacant
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
