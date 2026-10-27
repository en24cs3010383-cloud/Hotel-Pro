import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { Guest } from '../types/hotel';
import {
  Users,
  Search,
  Crown,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  FileText,
  IndianRupee,
  Bed,
  Edit3,
  CheckCircle2,
  X
} from 'lucide-react';

export const GuestCrmView: React.FC = () => {
  const { guests, updateGuestProfile, reservations } = useHotel();
  const [search, setSearch] = useState('');
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  const filteredGuests = guests.filter(g => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      g.name.toLowerCase().includes(q) ||
      g.email.toLowerCase().includes(q) ||
      g.phone.toLowerCase().includes(q) ||
      g.idPassportNumber.toLowerCase().includes(q)
    );
  });

  const getVipBadge = (level: Guest['vipLevel']) => {
    switch (level) {
      case 'Black Diamond VIP':
        return 'text-amber-300 bg-amber-500/20 border-amber-500/40';
      case 'Gold':
        return 'text-yellow-400 bg-yellow-500/15 border-yellow-500/30';
      case 'Silver':
        return 'text-slate-300 bg-slate-700 border-slate-600';
      default:
        return 'text-slate-400 bg-slate-800 border-slate-750';
    }
  };

  const handleSaveGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGuest) return;
    updateGuestProfile(editingGuest);
    setEditingGuest(null);
  };

  return (
    <div className="space-y-6">
      {/* CRM Header */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              <span>Guest Relationship Management (CRM)</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Guest profiles, VIP recognition tiers, stay history, preferences & special handling
            </p>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            <span>{guests.length} Registered Guest Profiles</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by guest name, email, phone number, or passport/ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Guest Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGuests.map(guest => {
          const guestRes = reservations.filter(r => r.guestId === guest.id);

          return (
            <div
              key={guest.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span
                      className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border inline-flex items-center gap-1 ${getVipBadge(
                        guest.vipLevel
                      )}`}
                    >
                      <Crown className="w-3 h-3" />
                      <span>{guest.vipLevel}</span>
                    </span>
                    <h2 className="text-base font-bold text-white mt-1.5">{guest.name}</h2>
                    <p className="text-[11px] text-slate-400 font-mono">{guest.idPassportNumber}</p>
                  </div>

                  <button
                    onClick={() => setEditingGuest(guest)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Edit profile & preferences"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{guest.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300 font-mono text-[11px]">
                    <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{guest.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{guest.address}</span>
                  </div>

                  {/* Preferences tags */}
                  {guest.preferences.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">
                        Preferences:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {guest.preferences.map((pref, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-amber-300/90 border border-slate-800"
                          >
                            {pref}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {guest.notes && (
                    <p className="p-2 rounded-lg bg-slate-950/70 border border-slate-850 text-slate-400 text-[11px] italic mt-2">
                      "{guest.notes}"
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Lifetime Stays</span>
                  <span className="text-base font-bold font-mono text-white tabular-nums">
                    {guest.totalStays}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Lifetime Spend</span>
                  <span className="text-base font-bold font-mono text-amber-400 tabular-nums">
                    ₹{guest.lifetimeSpend.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Guest Profile Modal */}
      {editingGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-white">Edit Guest CRM Profile</h3>
              <button
                onClick={() => setEditingGuest(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGuest} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingGuest.name}
                  onChange={e => setEditingGuest({ ...editingGuest, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">VIP Recognition Tier</label>
                <select
                  value={editingGuest.vipLevel}
                  onChange={e => setEditingGuest({ ...editingGuest, vipLevel: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500 font-medium"
                >
                  <option value="Standard">Standard Guest</option>
                  <option value="Silver">Silver Tier</option>
                  <option value="Gold">Gold Elite</option>
                  <option value="Black Diamond VIP">Black Diamond VIP</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Passport / National ID</label>
                <input
                  type="text"
                  value={editingGuest.idPassportNumber}
                  onChange={e => setEditingGuest({ ...editingGuest, idPassportNumber: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  value={editingGuest.email}
                  onChange={e => setEditingGuest({ ...editingGuest, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">VIP Notes & Preferences</label>
                <textarea
                  rows={2}
                  value={editingGuest.notes || ''}
                  onChange={e => setEditingGuest({ ...editingGuest, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingGuest(null)}
                  className="flex-1 py-2 px-3 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
