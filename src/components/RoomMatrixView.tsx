import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { Room, RoomStatus } from '../types/hotel';
import { Bed, User, Filter, CheckCircle2, AlertTriangle, Sparkles, Wrench, Layers } from 'lucide-react';

interface RoomMatrixViewProps {
  onSelectRoom: (room: Room) => void;
  onRequestCleaning: (roomNumber: string) => void;
  onRequestMaintenance: (roomNumber: string) => void;
}

export const RoomMatrixView: React.FC<RoomMatrixViewProps> = ({
  onSelectRoom,
  onRequestCleaning,
  onRequestMaintenance
}) => {
  const { rooms, roomTypes, updateRoomStatus } = useHotel();
  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<RoomStatus | 'all'>('all');

  const filteredRooms = rooms.filter(room => {
    if (selectedFloor !== 'all' && room.floor !== selectedFloor) return false;
    if (selectedStatus !== 'all') {
      if (selectedStatus === 'dirty') {
        return room.status === 'dirty' || room.status === 'cleaning';
      }
      return room.status === selectedStatus;
    }
    return true;
  });

  const getStatusDisplay = (status: RoomStatus) => {
    switch (status) {
      case 'available':
        return { label: 'Available', border: 'border-emerald-500/40', badge: 'text-emerald-400 bg-emerald-500/10' };
      case 'inspected':
        return { label: 'Inspected Ready', border: 'border-teal-500/40', badge: 'text-teal-400 bg-teal-500/10' };
      case 'occupied':
        return { label: 'Occupied', border: 'border-blue-500/40', badge: 'text-blue-400 bg-blue-500/10' };
      case 'reserved':
        return { label: 'Reserved', border: 'border-indigo-500/40', badge: 'text-indigo-400 bg-indigo-500/10' };
      case 'cleaning':
        return { label: 'In Cleaning', border: 'border-amber-500/40', badge: 'text-amber-400 bg-amber-500/10' };
      case 'dirty':
        return { label: 'Dirty Turnover', border: 'border-orange-500/40', badge: 'text-orange-400 bg-orange-500/10' };
      case 'out_of_order':
        return { label: 'Out of Order', border: 'border-rose-500/40', badge: 'text-rose-400 bg-rose-500/10' };
    }
  };

  const floors = [
    { id: 'all', label: 'All Floors (1 - 4)' },
    { id: 1, label: 'Floor 1 · Heritage Courtyard' },
    { id: 2, label: 'Floor 2 · Executive Suites' },
    { id: 3, label: 'Floor 3 · Grand Deluxe' },
    { id: 4, label: 'Floor 4 · Sky Penthouses' }
  ];

  const statuses = [
    { id: 'all', label: 'All Statuses' },
    { id: 'available', label: 'Available' },
    { id: 'inspected', label: 'Inspected' },
    { id: 'occupied', label: 'Occupied' },
    { id: 'reserved', label: 'Reserved' },
    { id: 'dirty', label: 'Dirty / Cleaning' },
    { id: 'out_of_order', label: 'Out of Order' }
  ];

  return (
    <div className="space-y-6">
      {/* Title & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <span>Interactive Room Matrix & Floor Grid</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time availability, room conditions, occupancy & fast housekeeping actions
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Floor selector */}
          <select
            value={selectedFloor}
            onChange={e => setSelectedFloor(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-medium"
          >
            {floors.map(f => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>

          {/* Status selector */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-medium"
          >
            {statuses.map(s => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredRooms.map(room => {
          const type = roomTypes.find(t => t.id === room.typeId);
          const statusInfo = getStatusDisplay(room.status);

          return (
            <div
              key={room.number}
              onClick={() => onSelectRoom(room)}
              className={`rounded-xl border bg-slate-900/90 p-4 cursor-pointer hover:border-amber-400/60 transition-all hover:shadow-lg flex flex-col justify-between ${statusInfo.border} group`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold">
                      Floor {room.floor} · {type?.name.split(' ')[0]}
                    </span>
                    <h2 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                      Room {room.number}
                    </h2>
                  </div>
                  <span className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded-md ${statusInfo.badge}`}>
                    {statusInfo.label}
                  </span>
                </div>

                <div className="mt-3 text-xs">
                  {room.currentGuest ? (
                    <div className="flex items-center gap-1.5 text-slate-200">
                      <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="font-semibold truncate">{room.currentGuest}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Bed className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{type?.name}</span>
                    </div>
                  )}

                  {room.notes && (
                    <p className="text-[10px] text-slate-400 mt-1.5 truncate bg-slate-950/60 p-1.5 rounded border border-slate-800">
                      {room.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="font-mono text-amber-400 font-bold">
                  ₹{type?.basePrice.toLocaleString('en-IN')}
                  <span className="text-[10px] text-slate-400 font-normal"> /nt</span>
                </span>

                <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                  {(room.status === 'dirty' || room.status === 'cleaning') && (
                    <button
                      onClick={() => updateRoomStatus(room.number, 'inspected')}
                      className="p-1 px-2 text-[10px] rounded bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 font-medium transition-colors"
                      title="Quick mark ready/inspected"
                    >
                      Mark Ready
                    </button>
                  )}

                  {room.status === 'available' && (
                    <button
                      onClick={() => updateRoomStatus(room.number, 'dirty', 'Turnover requested')}
                      className="p-1 px-2 text-[10px] rounded bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium transition-colors"
                      title="Flag for cleaning"
                    >
                      Flag Dirty
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
