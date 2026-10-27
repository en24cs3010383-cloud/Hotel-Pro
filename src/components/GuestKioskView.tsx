import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import {
  Wifi,
  Key,
  Utensils,
  Sparkles,
  Clock,
  Coffee,
  CheckCircle2,
  Lock,
  Unlock,
  AlertCircle,
  Receipt,
  BedDouble,
  ShieldCheck
} from 'lucide-react';

interface GuestKioskViewProps {
  onOpenFolio: (resId: string) => void;
}

export const GuestKioskView: React.FC<GuestKioskViewProps> = ({ onOpenFolio }) => {
  const { reservations, addFolioCharge, createHousekeepingTask, roomTypes } = useHotel();
  
  // Find current in-house guest (default to Jonathan Hayes or first checked in)
  const activeStay =
    reservations.find(r => r.status === 'checked_in' && r.roomNumber === '301') ||
    reservations.find(r => r.status === 'checked_in') ||
    reservations[0];

  const roomType = roomTypes.find(rt => rt.id === activeStay?.roomTypeId);

  const [doorUnlocked, setDoorUnlocked] = useState(false);
  const [requestSent, setRequestSent] = useState<string | null>(null);

  const handleUnlockDoor = () => {
    setDoorUnlocked(true);
    setTimeout(() => {
      setDoorUnlocked(false);
    }, 4000);
  };

  const handleOrderDining = (item: { name: string; price: number }) => {
    if (!activeStay) return;
    addFolioCharge(activeStay.id, {
      description: `In-Room Tablet Order: ${item.name}`,
      category: 'dining',
      amount: item.price
    });
    setRequestSent(`Ordered: ${item.name}. Chef preparing delivery in 20 mins.`);
    setTimeout(() => setRequestSent(null), 4000);
  };

  const handleGuestAmenityRequest = (serviceName: string) => {
    if (!activeStay) return;
    createHousekeepingTask({
      roomNumber: activeStay.roomNumber,
      taskType: 'turndown',
      priority: 'high',
      status: 'pending',
      assignedTo: 'Chen Wei',
      checklist: [{ id: '1', label: `Deliver guest request: ${serviceName}`, checked: false }],
      notes: `In-Room Guest Tablet direct request: ${serviceName}`
    });
    setRequestSent(`Request dispatched to room attendant: ${serviceName}`);
    setTimeout(() => setRequestSent(null), 4000);
  };

  if (!activeStay) {
    return (
      <div className="p-12 text-center text-slate-400">
        No active in-house stay detected. Please check in a guest at the Front Desk first.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-amber-400">
          <span>In-Room Hospitality Suite · Tablet Mode</span>
          <span>Room {activeStay.roomNumber}</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Welcome back, {activeStay.guestName}
        </h1>
        <p className="text-xs text-slate-300">
          {roomType?.name} · Departure: {activeStay.checkOutDate} · High-Speed Wi-Fi: HotelPro-VIP (Connected)
        </p>

        {requestSent && (
          <div className="p-3 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs flex items-center gap-2 animate-in fade-in duration-200 mt-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-400" />
            <span>{requestSent}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Digital Keycard & Door Unlock */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" />
            <span>Digital NFC Smart Key</span>
          </h2>

          <div className="p-5 rounded-xl bg-gradient-to-tr from-slate-950 via-slate-900 to-amber-950/40 border border-amber-500/30 flex flex-col justify-between h-48 text-xs relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-semibold">
                  HotelPro Pass
                </span>
                <div className="text-xl font-bold text-white mt-0.5">Suite {activeStay.roomNumber}</div>
              </div>
              <Wifi className="w-5 h-5 text-amber-400 rotate-90" />
            </div>

            <div>
              <div className="text-[10px] text-slate-400 font-mono">Guest Holder</div>
              <div className="font-semibold text-white">{activeStay.guestName}</div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mt-2 pt-2 border-t border-slate-800">
                <span>Keycard ID: {activeStay.keyCardCode || 'KC-301-ACTIVE'}</span>
                <span className="text-emerald-400">Authorized</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleUnlockDoor}
            className={`w-full py-3 px-4 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
              doorUnlocked
                ? 'bg-emerald-500 text-slate-950 scale-102 ring-2 ring-emerald-400'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-950 active:scale-98'
            }`}
          >
            {doorUnlocked ? (
              <>
                <Unlock className="w-4 h-4" />
                <span>Suite 301 Door Unlocked (Welcome In!)</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Tap Tablet to Unlock Door</span>
              </>
            )}
          </button>

          <button
            onClick={() => onOpenFolio(activeStay.id)}
            className="w-full py-2 px-3 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
          >
            <Receipt className="w-3.5 h-3.5 text-amber-400" />
            <span>Audit Live Stay Folio (₹{activeStay.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })})</span>
          </button>
        </div>

        {/* Middle Column: In-Room Dining Express Order */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Utensils className="w-4 h-4 text-amber-400" />
              <span>In-Room Dining Express</span>
            </h2>
            <span className="text-[10px] text-emerald-400 font-mono">Kitchen Open</span>
          </div>

          <p className="text-xs text-slate-400">
            Selected culinary delicacies charged directly to your guest folio.
          </p>

          <div className="space-y-2.5">
            {[
              { name: 'Royal Awadhi Gosht Biryani & Raita', price: 1450 },
              { name: 'Artisan Continental Breakfast Tray', price: 850 },
              { name: 'Moët & Chandon Impérial Champagne (750ml)', price: 14500 },
              { name: 'Norwegian Salmon Steak & Asparagus', price: 1850 }
            ].map(item => (
              <div
                key={item.name}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-200">{item.name}</div>
                  <div className="font-mono text-amber-400 font-bold mt-0.5">₹{item.price.toLocaleString('en-IN')}</div>
                </div>
                <button
                  onClick={() => handleOrderDining(item)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-[11px] transition-colors whitespace-nowrap"
                >
                  Order
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Butler & Housekeeping Quick Requests */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>Butler & Amenity Concierge</span>
          </h2>

          <p className="text-xs text-slate-400">
            Instant 1-touch service requests dispatched to our floor team.
          </p>

          <div className="space-y-2.5">
            {[
              { label: 'Fresh Egyptian Cotton Towels', desc: '4 plush bath sheets & hand towels' },
              { label: 'Hypoallergenic Pillow Refresh', desc: '2 medium-firm synthetic pillows' },
              { label: 'Turndown & Ice Bucket Service', desc: 'Evening bed prep & artisanal chocolates' },
              { label: 'Late Checkout Request (2:00 PM)', desc: 'Subject to suite availability' },
              { label: 'Wake-Up Call (07:30 AM)', desc: 'Front desk automated operator call' }
            ].map(service => (
              <button
                key={service.label}
                onClick={() => handleGuestAmenityRequest(service.label)}
                className="w-full text-left p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-colors block text-xs"
              >
                <div className="font-semibold text-slate-200">{service.label}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{service.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
