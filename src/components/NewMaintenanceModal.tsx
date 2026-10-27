import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { MaintenanceTicket } from '../types/hotel';
import { Wrench, AlertTriangle, X, Plus } from 'lucide-react';

interface NewMaintenanceModalProps {
  initialRoomNumber?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export const NewMaintenanceModal: React.FC<NewMaintenanceModalProps> = ({
  initialRoomNumber,
  onClose,
  onSuccess
}) => {
  const { rooms, createMaintenanceTicket, currentUser } = useHotel();
  const [roomNumber, setRoomNumber] = useState(initialRoomNumber || rooms[0]?.number || '101');
  const [area, setArea] = useState('En-suite Bathroom');
  const [issue, setIssue] = useState('');
  const [priority, setPriority] = useState<MaintenanceTicket['priority']>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issue.trim()) return;

    createMaintenanceTicket({
      roomNumber,
      area,
      issue,
      priority,
      status: 'open',
      reportedBy: `${currentUser.name} (${currentUser.role})`
    });

    onSuccess?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Create Maintenance Work Order</h3>
              <p className="text-[11px] text-slate-400 font-mono">Facilities & Engineering Dispatch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Room / Location</label>
              <select
                value={roomNumber}
                onChange={e => setRoomNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
              >
                {rooms.map(r => (
                  <option key={r.number} value={r.number}>
                    Room {r.number} (Fl {r.floor})
                  </option>
                ))}
                <option value="Common Corridor">Floor 1 Lobby</option>
                <option value="Elevator Bank">Elevator Foyer</option>
                <option value="Fitness Center">Fitness Center</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Area / Fixture</label>
              <input
                type="text"
                required
                value={area}
                onChange={e => setArea(e.target.value)}
                placeholder="e.g. HVAC, Shower, Balcony Door"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Priority Level</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'low', label: 'Low', color: 'text-slate-300 border-slate-800' },
                { id: 'medium', label: 'Medium', color: 'text-amber-400 border-amber-500/40' },
                { id: 'high', label: 'High', color: 'text-orange-400 border-orange-500/40' },
                { id: 'urgent', label: 'Urgent', color: 'text-rose-400 border-rose-500/40' }
              ].map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPriority(p.id as any)}
                  className={`py-1.5 px-2 rounded-lg border text-center font-medium transition-all ${
                    priority === p.id
                      ? 'bg-slate-800 ring-1 ring-amber-400 font-bold ' + p.color
                      : 'bg-slate-950/60 border-slate-800 text-slate-400'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            {priority === 'urgent' && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-mono">
                <AlertTriangle className="w-3 h-3" />
                Urgent tickets will automatically flag the room as Out of Order.
              </p>
            )}
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Detailed Issue Description</label>
            <textarea
              required
              rows={3}
              value={issue}
              onChange={e => setIssue(e.target.value)}
              placeholder="Describe malfunction, leaking, noise, or electrical defect in detail..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-3 rounded-xl border border-slate-800 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Dispatch Ticket</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
