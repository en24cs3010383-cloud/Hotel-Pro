import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { Reservation } from '../types/hotel';
import {
  LogIn,
  LogOut,
  UserCheck,
  Search,
  Key,
  Receipt,
  Bed,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText
} from 'lucide-react';

interface FrontDeskViewProps {
  onCheckIn: (resId: string) => void;
  onCheckOut: (resId: string) => void;
  onOpenFolio: (resId: string) => void;
}

export const FrontDeskView: React.FC<FrontDeskViewProps> = ({
  onCheckIn,
  onCheckOut,
  onOpenFolio
}) => {
  const { reservations, rooms, roomTypes, currentDate } = useHotel();
  const [subTab, setSubTab] = useState<'arrivals' | 'in_house' | 'departures'>('arrivals');
  const [search, setSearch] = useState('');

  const arrivalsToday = reservations.filter(
    r => r.checkInDate === currentDate && r.status === 'confirmed'
  );

  const inHouseGuests = reservations.filter(r => r.status === 'checked_in');

  const departuresToday = reservations.filter(
    r => r.checkOutDate === currentDate && r.status === 'checked_in'
  );

  const currentList =
    subTab === 'arrivals'
      ? arrivalsToday
      : subTab === 'departures'
      ? departuresToday
      : inHouseGuests;

  const filteredList = currentList.filter(res => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      res.guestName.toLowerCase().includes(q) ||
      res.confirmationCode.toLowerCase().includes(q) ||
      res.roomNumber.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Front Desk Terminal Banner */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <LogIn className="w-5 h-5 text-amber-400" />
              <span>Front Desk Operations Console</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Arrival processing, RFID keycard encoding, in-house management & balance settlement
            </p>
          </div>

          {/* Sub-tabs with counts */}
          <div className="flex p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <button
              onClick={() => setSubTab('arrivals')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                subTab === 'arrivals'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5 text-amber-400" />
              <span>Arrivals ({arrivalsToday.length})</span>
            </button>
            <button
              onClick={() => setSubTab('in_house')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                subTab === 'in_house'
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>In-House ({inHouseGuests.length})</span>
            </button>
            <button
              onClick={() => setSubTab('departures')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                subTab === 'departures'
                  ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogOut className="w-3.5 h-3.5 text-sky-400" />
              <span>Departures ({departuresToday.length})</span>
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative pt-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search by guest name, room number, or confirmation #..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Grid of guest cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredList.length === 0 ? (
          <div className="col-span-full p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-xs">
            <CheckCircle2 className="w-6 h-6 text-slate-500 mx-auto mb-2" />
            No records in the current queue matching your search.
          </div>
        ) : (
          filteredList.map(res => {
            const roomType = roomTypes.find(rt => rt.id === res.roomTypeId);
            const assignedRoom = rooms.find(r => r.number === res.roomNumber);

            const charges = res.folio.filter(f => f.amount > 0).reduce((s, c) => s + c.amount, 0);
            const payments = res.folio.filter(f => f.amount < 0).reduce((s, c) => s + Math.abs(c.amount), 0);
            const balance = +(charges - payments).toFixed(2);

            return (
              <div
                key={res.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">
                        #{res.confirmationCode}
                      </span>
                      <h2 className="text-base font-bold text-white mt-0.5">{res.guestName}</h2>
                      <p className="text-[11px] text-slate-400 font-mono">{res.guestEmail}</p>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-bold text-white font-mono">
                        Room {res.roomNumber}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {assignedRoom?.status.toUpperCase() || 'ASSIGNED'}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-500">Suite Type:</span>
                      <span className="font-medium truncate max-w-[170px]">{roomType?.name}</span>
                    </div>
                    <div className="flex justify-between text-slate-300 font-mono text-[11px]">
                      <span className="text-slate-500">Dates:</span>
                      <span>{res.checkInDate} → {res.checkOutDate}</span>
                    </div>
                    <div className="flex justify-between text-slate-300 font-mono text-[11px]">
                      <span className="text-slate-500">Nights / Party:</span>
                      <span>{res.nights}n · {res.adults} Guest(s)</span>
                    </div>
                    {res.specialRequests && (
                      <div className="pt-1 text-[11px] text-amber-300/90 italic border-t border-slate-850">
                        "{res.specialRequests}"
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Folio Balance:</span>
                    <span className={`font-bold tabular-nums ${balance > 0.01 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {balance > 0.01 ? `₹${balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹0.00 (Settled)'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {res.status === 'confirmed' && (
                      <button
                        onClick={() => onCheckIn(res.id)}
                        className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>Issue Key & Check-In</span>
                      </button>
                    )}

                    {res.status === 'checked_in' && (
                      <button
                        onClick={() => onCheckOut(res.id)}
                        className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Process Departure</span>
                      </button>
                    )}

                    <button
                      onClick={() => onOpenFolio(res.id)}
                      className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Open Billing Folio"
                    >
                      <Receipt className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
