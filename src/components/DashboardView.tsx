import React from 'react';
import { useHotel } from '../context/HotelContext';
import {
  Bed,
  IndianRupee,
  TrendingUp,
  LogIn,
  LogOut,
  Sparkles,
  Wrench,
  Calendar,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight
} from 'lucide-react';

interface DashboardViewProps {
  onNavigateTab: (tab: string) => void;
  onOpenNewReservation: () => void;
  onCheckIn: (resId: string) => void;
  onCheckOut: (resId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateTab,
  onOpenNewReservation,
  onCheckIn,
  onCheckOut
}) => {
  const { kpis, rooms, reservations, currentDate, currentTime } = useHotel();

  // Today's pending arrivals
  const todaysArrivals = reservations.filter(
    r => r.checkInDate === currentDate && r.status === 'confirmed'
  );

  // Today's pending departures
  const todaysDepartures = reservations.filter(
    r => r.checkOutDate === currentDate && r.status === 'checked_in'
  );

  // Recent in-house checked-in
  const inHouseGuests = reservations.filter(r => r.status === 'checked_in').slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome Banner with Grand Hotel Lobby Ambient */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
        <div className="relative h-48 sm:h-56">
          <img
            src="/src/assets/images/hotel_lobby_grand_1793117720071.jpg"
            alt="HotelPro Grand Lobby"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          
          <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <span className="font-semibold tracking-wider uppercase">Hotel Operations Console</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-300">{currentDate}</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-300">{currentTime}</span>
            </div>

            <div className="max-w-2xl">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                HotelPro Grand Executive Overview
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Real-time room occupancy, front desk operations, guest folios, and housekeeping dispatch.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onNavigateTab('front-desk')}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Front Desk Terminal</span>
              </button>
              <button
                onClick={() => onNavigateTab('rooms')}
                className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-750 transition-colors flex items-center gap-1.5"
              >
                <Bed className="w-3.5 h-3.5" />
                <span>Floor Matrix ({kpis.totalRooms} Rooms)</span>
              </button>
              <button
                onClick={onOpenNewReservation}
                className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-750 transition-colors flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Book Guest Suite</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Column Primary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Occupancy Rate */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Occupancy Rate</span>
            <Bed className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              {kpis.occupancyRate}%
            </span>
            <span className="text-xs font-mono text-slate-400">
              {kpis.occupiedRooms} / {kpis.totalRooms} Rooms
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${kpis.occupancyRate}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 font-mono pt-1">
            <span className="text-emerald-400">{kpis.availableRooms} Available</span>
            <span className="text-rose-400">{kpis.dirtyRooms} Dirty/Turnover</span>
          </div>
        </div>

        {/* ADR (Average Daily Rate) */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Average Daily Rate (ADR)</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              ${kpis.adr}
            </span>
            <span className="text-xs font-mono text-emerald-400">+12% vs LY</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Weighted across luxury suites & penthouses.
          </p>
          <div className="pt-1 text-[11px] text-slate-400 font-mono">
            RevPAR: <strong className="text-slate-200">${kpis.revPar}</strong>
          </div>
        </div>

        {/* Expected Today Movement */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Today's Front Desk Pace</span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Arrivals</div>
              <div className="text-xl font-bold font-mono text-amber-400 tabular-nums">
                {kpis.expectedArrivals}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Departures</div>
              <div className="text-xl font-bold font-mono text-sky-400 tabular-nums">
                {kpis.expectedDepartures}
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 text-center">
            {kpis.inspectedRooms} rooms inspected & ready for arrival
          </p>
        </div>

        {/* Total Today's Revenue */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Daily Realized Revenue (INR)</span>
            <IndianRupee className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
              ₹{kpis.totalRevenueToday.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-mono text-emerald-400">Pacing On Target</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Includes room stay rates, culinary dining & spa.
          </p>
          <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
            <span>Pending HK Tasks:</span>
            <span className="font-mono text-amber-400 font-semibold">
              {kpis.pendingHousekeepingTasks} active
            </span>
          </div>
        </div>
      </div>

      {/* Operations Quick Action Grids: Arrivals vs Departures */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Expected Arrivals Queue */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LogIn className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white">Expected Arrivals Today ({todaysArrivals.length})</h2>
            </div>
            <button
              onClick={() => onNavigateTab('front-desk')}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-medium"
            >
              <span>View Terminal</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {todaysArrivals.length === 0 ? (
            <div className="p-6 rounded-xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-400">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              All scheduled arrivals for today have been checked in.
            </div>
          ) : (
            <div className="space-y-2.5">
              {todaysArrivals.map(res => (
                <div
                  key={res.id}
                  className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate">{res.guestName}</span>
                      <span className="text-[10px] font-mono text-amber-400">#{res.confirmationCode}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>Room {res.roomNumber}</span>
                      <span>·</span>
                      <span>{res.nights} Night(s)</span>
                      <span>·</span>
                      <span className="capitalize">{res.paymentStatus}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onCheckIn(res.id)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors whitespace-nowrap shadow-xs flex items-center gap-1"
                  >
                    <span>Check-In</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Today's Expected Departures Queue */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LogOut className="w-4 h-4 text-sky-400" />
              <h2 className="text-sm font-bold text-white">Expected Departures Today ({todaysDepartures.length})</h2>
            </div>
            <button
              onClick={() => onNavigateTab('front-desk')}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-medium"
            >
              <span>View Terminal</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {todaysDepartures.length === 0 ? (
            <div className="p-6 rounded-xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-400">
              <CheckCircle2 className="w-6 h-6 text-sky-400 mx-auto mb-2" />
              No pending departures remaining for today.
            </div>
          ) : (
            <div className="space-y-2.5">
              {todaysDepartures.map(res => {
                const charges = res.folio.filter(f => f.amount > 0).reduce((s, c) => s + c.amount, 0);
                const payments = res.folio.filter(f => f.amount < 0).reduce((s, c) => s + Math.abs(c.amount), 0);
                const balance = +(charges - payments).toFixed(2);

                return (
                  <div
                    key={res.id}
                    className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">{res.guestName}</span>
                        <span className="text-[10px] font-mono text-slate-400">Room {res.roomNumber}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>Folio: ₹{res.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        <span>·</span>
                        <span className={balance > 0.01 ? 'text-amber-400 font-mono' : 'text-emerald-400 font-mono'}>
                          {balance > 0.01 ? `Due: ₹${balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : 'Folio Settled'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onCheckOut(res.id)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors whitespace-nowrap shadow-xs"
                    >
                      Check-Out
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Real-time Room Status Matrix Overview Card */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">Live Room Status Distribution</h2>
            <p className="text-[11px] text-slate-400">Current state across all {rooms.length} hotel suites & rooms</p>
          </div>
          <button
            onClick={() => onNavigateTab('rooms')}
            className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-medium"
          >
            <span>Interactive Floor Grid</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {[
            { label: 'Available', count: rooms.filter(r => r.status === 'available').length, color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' },
            { label: 'Inspected', count: rooms.filter(r => r.status === 'inspected').length, color: 'text-teal-400 border-teal-500/20 bg-teal-500/5' },
            { label: 'Occupied', count: rooms.filter(r => r.status === 'occupied').length, color: 'text-blue-400 border-blue-500/20 bg-blue-500/5' },
            { label: 'Reserved', count: rooms.filter(r => r.status === 'reserved').length, color: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5' },
            { label: 'Dirty/Cleaning', count: rooms.filter(r => r.status === 'dirty' || r.status === 'cleaning').length, color: 'text-amber-400 border-amber-500/20 bg-amber-500/5' },
            { label: 'Out of Order', count: rooms.filter(r => r.status === 'out_of_order').length, color: 'text-rose-400 border-rose-500/20 bg-rose-500/5' }
          ].map(stat => (
            <div key={stat.label} className={`p-3 rounded-xl border ${stat.color} text-center`}>
              <div className="text-xl font-bold font-mono tabular-nums">{stat.count}</div>
              <div className="text-[11px] font-medium mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
