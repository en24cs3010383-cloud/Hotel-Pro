import React, { useState } from 'react';
import { Reservation, FolioItem } from '../types/hotel';
import { useHotel } from '../context/HotelContext';
import { Utensils, Sparkles, Wine, Car, Receipt, X, Plus } from 'lucide-react';

interface AddFolioChargeModalProps {
  reservation: Reservation;
  onClose: () => void;
}

export const AddFolioChargeModal: React.FC<AddFolioChargeModalProps> = ({
  reservation,
  onClose
}) => {
  const { addFolioCharge } = useHotel();
  const [category, setCategory] = useState<FolioItem['category']>('dining');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const chargeTemplates: Record<FolioItem['category'], { label: string; defaultDesc: string; defaultPrice: number }[]> = {
    dining: [
      { label: 'Artisan Breakfast Buffet (2 Guests)', defaultDesc: 'The Courtyard Bistro - Breakfast Buffet', defaultPrice: 1650 },
      { label: 'Room Service Dinner (Steak & Wine)', defaultDesc: 'In-Room Dining - Prime Ribeye & Cabernet', defaultPrice: 3200 },
      { label: 'Grand Afternoon High Tea', defaultDesc: 'Lounge High Tea Service', defaultPrice: 1850 }
    ],
    spa: [
      { label: '60-min Deep Tissue Massage', defaultDesc: 'The Spa - 60min Deep Tissue Massage', defaultPrice: 4500 },
      { label: 'Aromatherapy Facial Treatment', defaultDesc: 'The Spa - Botanical Glow Facial', defaultPrice: 3800 },
      { label: 'Couples Hydrotherapy Package', defaultDesc: 'The Spa - Hydrotherapy Suite & Body Scrub', defaultPrice: 8500 }
    ],
    minibar: [
      { label: 'Single Malt Whisky & Soda', defaultDesc: 'In-Room Minibar - Macallan 12 & Sparkling Soda', defaultPrice: 1450 },
      { label: 'Artisanal Snacks & Chocolate Box', defaultDesc: 'In-Room Minibar - Swiss Truffles & Roasted Nuts', defaultPrice: 850 },
      { label: 'Sparkling Mineral Waters (x3)', defaultDesc: 'In-Room Minibar - San Pellegrino 750ml x 3', defaultPrice: 650 }
    ],
    valet: [
      { label: 'Overnight Executive Valet Parking', defaultDesc: 'Overnight Secured Valet Parking', defaultPrice: 1200 },
      { label: 'Chauffeured Airport Transfer', defaultDesc: 'Mercedes S-Class Airport Chauffeur', defaultPrice: 4500 }
    ],
    room: [
      { label: 'Late Checkout Fee (Until 4:00 PM)', defaultDesc: 'Guaranteed Late Checkout Fee', defaultPrice: 2500 },
      { label: 'Rollaway Bed Daily Supplement', defaultDesc: 'Rollaway Premium Bed Setup', defaultPrice: 1500 }
    ],
    tax: [],
    payment: []
  };

  const handleApplyTemplate = (desc: string, price: number) => {
    setDescription(desc);
    setAmount(price.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!description || isNaN(parsedAmount) || parsedAmount <= 0) return;

    addFolioCharge(reservation.id, {
      description,
      category,
      amount: parsedAmount
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Post Folio Charge</h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Room {reservation.roomNumber} · {reservation.guestName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Category selection */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Department / Category</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'dining', label: 'Dining', icon: Utensils },
                { id: 'spa', label: 'Spa & Wellness', icon: Sparkles },
                { id: 'minibar', label: 'Minibar', icon: Wine },
                { id: 'valet', label: 'Valet / Car', icon: Car }
              ].map(cat => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setCategory(cat.id as FolioItem['category']);
                      setDescription('');
                      setAmount('');
                    }}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 shadow-xs'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preset Quick items */}
          {chargeTemplates[category]?.length > 0 && (
            <div>
              <label className="block text-[11px] text-slate-400 font-medium mb-1">
                Frequently Selected Charges
              </label>
              <div className="space-y-1.5">
                {chargeTemplates[category].map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyTemplate(tmpl.defaultDesc, tmpl.defaultPrice)}
                    className="w-full text-left flex items-center justify-between p-2 rounded-lg bg-slate-950/40 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-colors"
                  >
                    <span>{tmpl.label}</span>
                    <span className="font-mono text-amber-400 font-semibold">₹{tmpl.defaultPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Charge Description / Line Item</label>
            <input
              type="text"
              required
              placeholder="e.g., Dining Room Bill #4912"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Amount (₹ INR)</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-slate-400 font-mono text-xs">₹</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-7 pr-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 rounded-xl border border-slate-800 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md active:scale-98 flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Post to Guest Folio</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
