import React, { useState } from 'react';
import { Reservation, Room } from '../types/hotel';
import { useHotel } from '../context/HotelContext';
import { Key, Wifi, CheckCircle2, Shield, X, AlertCircle } from 'lucide-react';

interface KeycardModalProps {
  reservation: Reservation;
  onClose: () => void;
  onSuccess?: () => void;
}

export const KeycardModal: React.FC<KeycardModalProps> = ({
  reservation,
  onClose,
  onSuccess
}) => {
  const { rooms, checkInGuest } = useHotel();
  const [selectedRoom, setSelectedRoom] = useState<string>(reservation.roomNumber || '102');
  const [isEncoding, setIsEncoding] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [idVerified, setIdVerified] = useState(true);

  // Available or currently assigned rooms of the same type
  const eligibleRooms = rooms.filter(
    r =>
      (r.typeId === reservation.roomTypeId && (r.status === 'available' || r.status === 'inspected')) ||
      r.number === reservation.roomNumber
  );

  const handleIssueAndCheckIn = () => {
    setIsEncoding(true);
    setTimeout(() => {
      checkInGuest(reservation.id, selectedRoom);
      setIsEncoding(false);
      setIsComplete(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Express Check-In & RFID Keycard</h3>
              <p className="text-[11px] text-slate-400 font-mono">Conf #{reservation.confirmationCode}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Virtual RFID Keycard Graphic */}
          <div className="relative h-44 rounded-xl bg-gradient-to-tr from-slate-950 via-slate-900 to-amber-950/40 border border-amber-500/30 p-5 flex flex-col justify-between shadow-xl overflow-hidden group">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />
            
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] tracking-widest uppercase font-mono text-amber-400 font-semibold">
                  HotelPro Grand Pass
                </p>
                <h4 className="text-xl font-bold text-white tracking-tight mt-0.5">
                  Room {selectedRoom}
                </h4>
              </div>
              <Wifi className="w-5 h-5 text-amber-400/80 rotate-90" />
            </div>

            <div>
              <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Registered Guest</div>
              <div className="text-sm font-semibold text-slate-100">{reservation.guestName}</div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-2 pt-2 border-t border-slate-800/80">
                <span>Valid: {reservation.checkInDate} to {reservation.checkOutDate}</span>
                <span className="text-amber-400">NFC Active</span>
              </div>
            </div>
          </div>

          {/* Form details */}
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Assigned Room Number</label>
              <select
                value={selectedRoom}
                onChange={e => setSelectedRoom(e.target.value)}
                disabled={isEncoding || isComplete}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
              >
                {eligibleRooms.length > 0 ? (
                  eligibleRooms.map(r => (
                    <option key={r.number} value={r.number}>
                      Room {r.number} (Floor {r.floor} · {r.status.toUpperCase()})
                    </option>
                  ))
                ) : (
                  <option value={reservation.roomNumber}>Room {reservation.roomNumber}</option>
                )}
              </select>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="font-medium text-slate-200">Government ID Verified</div>
                  <div className="text-[10px] text-slate-400">Passport / Driver License on File</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={idVerified}
                onChange={e => setIdVerified(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            {reservation.paymentStatus === 'unpaid' && (
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px]">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Notice: Folio balance of ₹{(reservation.totalAmount - reservation.paidAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })} is pending. Credit card pre-authorization can be settled on departure.</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onClose}
              disabled={isEncoding}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-800 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleIssueAndCheckIn}
              disabled={isEncoding || isComplete || !idVerified}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isEncoding ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Encoding NFC...</span>
                </>
              ) : isComplete ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>Key Issued & Checked In!</span>
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span>Issue Key & Check In</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
