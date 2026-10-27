import React, { useState } from 'react';
import { HousekeepingTask } from '../types/hotel';
import { useHotel } from '../context/HotelContext';
import { Sparkles, CheckSquare, Square, CheckCircle2, X, User } from 'lucide-react';

interface HousekeepingChecklistModalProps {
  task: HousekeepingTask;
  onClose: () => void;
  onSuccess?: () => void;
}

export const HousekeepingChecklistModal: React.FC<HousekeepingChecklistModalProps> = ({
  task,
  onClose,
  onSuccess
}) => {
  const { updateHousekeepingTask } = useHotel();
  const [checklist, setChecklist] = useState(task.checklist);
  const [notes, setNotes] = useState(task.notes || '');

  const toggleItem = (itemId: string) => {
    setChecklist(prev =>
      prev.map(item => (item.id === itemId ? { ...item, checked: !item.checked } : item))
    );
  };

  const allCompleted = checklist.length > 0 && checklist.every(item => item.checked);

  const handleSaveProgress = () => {
    updateHousekeepingTask(task.id, 'in_progress', checklist, notes);
    onClose();
  };

  const handleMarkInspected = () => {
    const fullyChecked = checklist.map(c => ({ ...c, checked: true }));
    updateHousekeepingTask(task.id, 'completed', fullyChecked, notes);
    onSuccess?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Housekeeping & Inspection Checklist</h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Room {task.roomNumber} · Task #{task.id}
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

        <div className="p-6 space-y-4 text-xs">
          {/* Metadata banner */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-300">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>Assigned: {task.assignedTo}</span>
            </div>
            <div className="capitalize text-amber-400 font-medium">Priority: {task.priority}</div>
          </div>

          {/* Checklist Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-300 font-medium">Standard Turnover Inspection Steps</label>
              <span className="text-[11px] font-mono text-slate-400">
                {checklist.filter(c => c.checked).length} / {checklist.length} Complete
              </span>
            </div>

            <div className="space-y-2">
              {checklist.map(item => (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                    item.checked
                      ? 'bg-teal-500/10 border-teal-500/30 text-teal-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {item.checked ? (
                    <CheckSquare className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  )}
                  <span className={`text-xs ${item.checked ? 'line-through text-teal-300/80' : ''}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-400 mb-1">Attendant Remarks</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Master bathroom sealed, complimentary fruit bowl set."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleSaveProgress}
              className="flex-1 py-2 px-3 rounded-xl border border-slate-800 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Save In-Progress
            </button>
            <button
              type="button"
              onClick={handleMarkInspected}
              className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Ready / Inspected</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
