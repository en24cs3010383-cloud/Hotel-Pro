import React, { useState } from 'react';
import { Room, RoomStatus } from '../types/hotel';
import { useHotel } from '../context/HotelContext';
import { Bed, User, Sparkles, Wrench, Clock, CheckCircle, X, ShieldAlert, ArrowRight } from 'lucide-react';

interface RoomDetailsModalProps {
  room: Room;
  onClose: () => void;
  onOpenFolio?: (resId: string) => void;
  onRequestCleaning?: (roomNumber: string) => void;
  onRequestMaintenance?: (roomNumber: string) => void;
}

export const RoomDetailsModal: React.FC<RoomDetailsModalProps> = ({
  room,
  onClose,
  onOpenFolio,
  onRequestCleaning,
  onRequestMaintenance
}) => {
  const { roomTypes, updateRoomStatus, reservations } = useHotel();
  const roomType = roomTypes.find(rt => rt.id === room.typeId);
  const activeReservation = reservations.find(r => r.id === room.currentReservationId);

  const [notes, setNotes] = useState(room.notes || '');

  const statusOptions: { value: RoomStatus; label: string; color: string }[] = [
    { value: 'available', label: 'Available / Clean', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    { value: 'inspected', label: 'Inspected / Ready', color: 'bg-teal-500/10 text-teal-400 border-teal-500/30' },
    { value: 'occupied', label: 'Occupied (In-House)', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    { value: 'reserved', label: 'Reserved (Arriving)', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' },
    { value: 'cleaning', label: 'Cleaning In Progress', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    { value: 'dirty', label: 'Dirty (Turnover Needed)', color: 'bg-orange-500/10 text-orange-400 border-orange-500/30' },
    { value: 'out_of_order', label: 'Out of Order / Maintenance', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' }
  ];

  const handleStatusChange = (newStatus: RoomStatus) => {
    updateRoomStatus(room.number, newStatus, notes);
  };

  const handleSaveNotes = () => {
    updateRoomStatus(room.number, room.status, notes);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl my-8">
        {/* Header with image preview */}
        <div className="relative h-44 bg-slate-950">
          <img
            src={roomType?.image}
            alt={roomType?.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-300 hover:text-white p-1 rounded-lg bg-slate-900/80 backdrop-blur-sm border border-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-semibold">
                Floor {room.floor} · {roomType?.name}
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Room {room.number}</h2>
            </div>
            <div className="text-right font-mono">
              <span className="text-xs text-slate-400">Nightly Rate</span>
              <div className="text-lg font-bold text-amber-400">₹{roomType?.basePrice.toLocaleString('en-IN')}</div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5 text-xs">
          {/* Quick status selector */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Current Room Operational Status</label>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleStatusChange(opt.value)}
                  className={`px-3 py-2 rounded-lg border text-left flex items-center justify-between transition-all ${
                    room.status === opt.value
                      ? `${opt.color} font-bold ring-1 ring-amber-400/50`
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{opt.label}</span>
                  {room.status === opt.value && <CheckCircle className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Current Occupant Details */}
          {room.currentGuest ? (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                  Current Occupant / Reservation
                </span>
                {activeReservation && onOpenFolio && (
                  <button
                    onClick={() => {
                      onOpenFolio(activeReservation.id);
                      onClose();
                    }}
                    className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <span>View Folio</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-white text-sm">{room.currentGuest}</span>
              </div>
              {activeReservation && (
                <div className="text-slate-400 flex items-center gap-2 font-mono text-[11px]">
                  <span>Stay: {activeReservation.checkInDate} → {activeReservation.checkOutDate}</span>
                  <span>·</span>
                  <span>Conf #{activeReservation.confirmationCode}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-slate-400 flex items-center gap-2">
              <Bed className="w-4 h-4 text-slate-500" />
              <span>No active in-house guest registered in Room {room.number}.</span>
            </div>
          )}

          {/* Amenities & Attributes */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
              Suite Features & Amenities
            </span>
            <div className="flex flex-wrap gap-1.5">
              {roomType?.amenities.map((amenity, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 rounded-md bg-slate-800 text-slate-300 text-[11px] font-medium"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          {/* Room Staff & Notes */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
              <span>Assigned Attendant: <strong className="text-slate-200">{room.assignedStaff || 'Unassigned'}</strong></span>
              <span>Last Cleaned: {room.lastCleanedAt || 'N/A'}</span>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Housekeeping & Operational Notes</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. VIP fruit bowl placed, balcony inspected"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions Footer */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
            {onRequestCleaning && (
              <button
                type="button"
                onClick={() => {
                  onRequestCleaning(room.number);
                  onClose();
                }}
                className="flex-1 py-2 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Request Clean</span>
              </button>
            )}

            {onRequestMaintenance && (
              <button
                type="button"
                onClick={() => {
                  onRequestMaintenance(room.number);
                  onClose();
                }}
                className="flex-1 py-2 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Report Repair</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
