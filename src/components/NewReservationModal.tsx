import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { Calendar, Users, Bed, CreditCard, Sparkles, X, CheckCircle2, ChevronRight } from 'lucide-react';

interface NewReservationModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export const NewReservationModal: React.FC<NewReservationModalProps> = ({
  onClose,
  onSuccess
}) => {
  const { roomTypes, rooms, createReservation, currentDate } = useHotel();

  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [selectedTypeId, setSelectedTypeId] = useState(roomTypes[0].id);
  const [checkInDate, setCheckInDate] = useState(currentDate);
  const [checkOutDate, setCheckOutDate] = useState('2026-10-30');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [selectedRoomNumber, setSelectedRoomNumber] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [createdConfCode, setCreatedConfCode] = useState<string | null>(null);

  const selectedType = roomTypes.find(rt => rt.id === selectedTypeId) || roomTypes[0];

  // Available rooms for this type
  const matchingRooms = rooms.filter(
    r => r.typeId === selectedTypeId && (r.status === 'available' || r.status === 'inspected')
  );

  // Auto-select first matching room when type changes
  React.useEffect(() => {
    if (matchingRooms.length > 0) {
      setSelectedRoomNumber(matchingRooms[0].number);
    } else {
      setSelectedRoomNumber('');
    }
  }, [selectedTypeId]);

  // Calculations
  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);
  const nights = Math.max(1, Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  const subtotal = selectedType.basePrice * nights;
  const taxes = +(subtotal * 0.18).toFixed(2);
  const total = +(subtotal + taxes).toFixed(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestEmail) return;

    const res = createReservation({
      guestName,
      guestEmail,
      guestPhone,
      roomTypeId: selectedTypeId,
      roomNumber: selectedRoomNumber || (matchingRooms[0]?.number || '102'),
      checkInDate,
      checkOutDate,
      adults,
      children,
      specialRequests,
      ratePerNight: selectedType.basePrice
    });

    setCreatedConfCode(res.confirmationCode);
    setTimeout(() => {
      onSuccess?.();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Create New Reservation</h3>
              <p className="text-[11px] text-slate-400">Direct Front Desk & Online Booking Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {createdConfCode ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white">Reservation Confirmed!</h4>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 max-w-sm mx-auto space-y-1 font-mono text-xs">
              <div className="text-slate-400">Confirmation Code:</div>
              <div className="text-xl font-bold text-amber-400">{createdConfCode}</div>
              <div className="text-slate-400 pt-2 border-t border-slate-800/80">
                Guest: <span className="text-white font-sans">{guestName}</span>
              </div>
              <div className="text-slate-400">
                Room: <span className="text-white">#{selectedRoomNumber}</span> ({selectedType.name})
              </div>
            </div>
            <button
              onClick={onClose}
              className="py-2.5 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all"
            >
              Done & View Reservations
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Room Type Selector with Photos */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Select Suite / Room Category
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {roomTypes.map(rt => {
                  const isSelected = selectedTypeId === rt.id;
                  const availableCount = rooms.filter(
                    r => r.typeId === rt.id && (r.status === 'available' || r.status === 'inspected')
                  ).length;

                  return (
                    <div
                      key={rt.id}
                      onClick={() => setSelectedTypeId(rt.id)}
                      className={`relative rounded-xl border p-3 cursor-pointer transition-all flex flex-col justify-between overflow-hidden group ${
                        isSelected
                          ? 'border-amber-400 bg-slate-850 ring-1 ring-amber-400/50'
                          : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex gap-3">
                        <img
                          src={rt.image}
                          alt={rt.name}
                          className="w-20 h-16 rounded-lg object-cover shrink-0 border border-slate-800"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-white group-hover:text-amber-300 truncate">
                            {rt.name}
                          </h4>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Bed className="w-3 h-3 text-slate-500" />
                            <span className="truncate">{rt.bedType}</span>
                          </div>
                          <div className="flex items-center justify-between mt-1 text-[11px]">
                            <span className="font-mono text-amber-400 font-bold">
                              ₹{rt.basePrice.toLocaleString('en-IN')}
                              <span className="text-[9px] text-slate-400 font-normal"> /night</span>
                            </span>
                            <span
                              className={`text-[9px] font-mono ${
                                availableCount > 0 ? 'text-emerald-400' : 'text-rose-400'
                              }`}
                            >
                              {availableCount} left
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dates & Guests */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Check-In</label>
                <input
                  type="date"
                  required
                  value={checkInDate}
                  onChange={e => setCheckInDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Check-Out</label>
                <input
                  type="date"
                  required
                  value={checkOutDate}
                  onChange={e => setCheckOutDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Adults</label>
                <select
                  value={adults}
                  onChange={e => setAdults(parseInt(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value={1}>1 Adult</option>
                  <option value={2}>2 Adults</option>
                  <option value={3}>3 Adults</option>
                  <option value={4}>4 Adults</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Assign Room</label>
                <select
                  value={selectedRoomNumber}
                  onChange={e => setSelectedRoomNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  {matchingRooms.length > 0 ? (
                    matchingRooms.map(r => (
                      <option key={r.number} value={r.number}>
                        Room {r.number} (Fl {r.floor})
                      </option>
                    ))
                  ) : (
                    <option value="">Auto-Assign on Check-in</option>
                  )}
                </select>
              </div>
            </div>

            {/* Guest Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Primary Guest Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jonathan Hayes"
                  value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="guest@example.com"
                  value={guestEmail}
                  onChange={e => setGuestEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Mobile / Phone</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={guestPhone}
                  onChange={e => setGuestPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Guest Preferences & Special Requests
              </label>
              <input
                type="text"
                placeholder="e.g., High floor, extra pillows, champagne upon arrival"
                value={specialRequests}
                onChange={e => setSpecialRequests(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Booking Summary Box */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="text-slate-400">
                  {nights} Night(s) × ₹{selectedType.basePrice.toLocaleString('en-IN')} + 18% GST & Luxury Cess
                </span>
                <div className="text-[11px] text-amber-400/90 font-medium">
                  Complimentary 1000 Mbps Wi-Fi & Concierge Included
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Total Estimated Folio</div>
                <div className="text-lg font-bold font-mono text-amber-400 tabular-nums">
                  ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 px-4 rounded-xl border border-slate-800 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md active:scale-98 flex items-center justify-center gap-1.5"
              >
                <span>Confirm & Generate Booking</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
