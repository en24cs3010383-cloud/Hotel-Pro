import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { HousekeepingTask, MaintenanceTicket } from '../types/hotel';
import {
  Sparkles,
  Wrench,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  User,
  Filter,
  CheckSquare,
  ShieldCheck
} from 'lucide-react';

interface HousekeepingViewProps {
  onOpenChecklist: (task: HousekeepingTask) => void;
  onOpenNewTicket: () => void;
}

export const HousekeepingView: React.FC<HousekeepingViewProps> = ({
  onOpenChecklist,
  onOpenNewTicket
}) => {
  const {
    housekeepingTasks,
    maintenanceTickets,
    updateMaintenanceTicket,
    rooms,
    updateRoomStatus
  } = useHotel();

  const [activeTab, setActiveTab] = useState<'housekeeping' | 'maintenance'>('housekeeping');
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');

  const filteredTasks = housekeepingTasks.filter(t => {
    if (taskFilter !== 'all' && t.status !== taskFilter) return false;
    return true;
  });

  const dirtyRooms = rooms.filter(r => r.status === 'dirty' || r.status === 'cleaning');
  const inspectedRooms = rooms.filter(r => r.status === 'inspected');

  return (
    <div className="space-y-6">
      {/* Header and Mode Switcher */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-400" />
              <span>Housekeeping & Facilities Maintenance Hub</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Turnover queues, sanitary checklists, attendant dispatch & engineering work orders
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('housekeeping')}
                className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                  activeTab === 'housekeeping'
                    ? 'bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>Housekeeping ({dirtyRooms.length} Turnovers)</span>
              </button>
              <button
                onClick={() => setActiveTab('maintenance')}
                className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                  activeTab === 'maintenance'
                    ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Wrench className="w-3.5 h-3.5 text-rose-400" />
                <span>Engineering ({maintenanceTickets.filter(t => t.status !== 'resolved').length})</span>
              </button>
            </div>

            {activeTab === 'maintenance' && (
              <button
                onClick={onOpenNewTicket}
                className="px-3.5 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Work Order</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Operations Metric Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Dirty Rooms</div>
              <div className="text-lg font-bold font-mono text-orange-400 tabular-nums">
                {dirtyRooms.length}
              </div>
            </div>
            <Clock className="w-4 h-4 text-orange-400" />
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Inspected & Ready</div>
              <div className="text-lg font-bold font-mono text-teal-400 tabular-nums">
                {inspectedRooms.length}
              </div>
            </div>
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Active Attendants</div>
              <div className="text-lg font-bold font-mono text-slate-200 tabular-nums">4 On Duty</div>
            </div>
            <User className="w-4 h-4 text-amber-400" />
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Open Repairs</div>
              <div className="text-lg font-bold font-mono text-rose-400 tabular-nums">
                {maintenanceTickets.filter(m => m.status !== 'resolved').length}
              </div>
            </div>
            <Wrench className="w-4 h-4 text-rose-400" />
          </div>
        </div>
      </div>

      {/* Housekeeping Tasks Tab */}
      {activeTab === 'housekeeping' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Daily Turnover & Room Cleaning Tasks</h2>
            <div className="flex items-center gap-1 text-xs">
              {(['all', 'pending', 'in_progress', 'completed'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => setTaskFilter(filter)}
                  className={`px-2.5 py-1 rounded-md font-medium capitalize transition-colors ${
                    taskFilter === filter
                      ? 'bg-slate-800 text-teal-300 border border-teal-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {filter.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map(task => {
              const completedSteps = task.checklist.filter(c => c.checked).length;
              const totalSteps = task.checklist.length;
              const progressPct = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

              return (
                <div
                  key={task.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-teal-400 uppercase font-semibold">
                          #{task.id} · Priority: {task.priority}
                        </span>
                        <h3 className="text-lg font-bold text-white">Room {task.roomNumber}</h3>
                      </div>
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                          task.status === 'completed'
                            ? 'bg-teal-500/20 text-teal-300'
                            : task.status === 'in_progress'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-orange-500/20 text-orange-300'
                        }`}
                      >
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="mt-3 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Attendant:</span>
                        <span className="font-semibold">{task.assignedTo}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
                        <span>Reported Time:</span>
                        <span>{task.reportedAt}</span>
                      </div>

                      {task.notes && (
                        <p className="p-2 rounded-lg bg-slate-950/60 border border-slate-850 text-slate-400 text-[11px]">
                          {task.notes}
                        </p>
                      )}

                      {/* Progress bar */}
                      <div className="pt-2 space-y-1">
                        <div className="flex justify-between text-[10px] font-mono text-slate-400">
                          <span>Inspection Checklist</span>
                          <span>
                            {completedSteps} / {totalSteps} items ({progressPct}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-teal-400 h-full rounded-full transition-all duration-300"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                    <button
                      onClick={() => onOpenChecklist(task)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>Execute Turnover Checklist</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Facilities Maintenance Tab */}
      {activeTab === 'maintenance' && (
        <div className="border border-slate-800 rounded-2xl bg-slate-900 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Engineering & Facilities Work Orders</h2>
            <span className="text-xs font-mono text-slate-400">
              {maintenanceTickets.length} Work Orders Tracked
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-medium">Ticket Code</th>
                  <th className="py-3 px-4 font-medium">Location & Area</th>
                  <th className="py-3 px-4 font-medium">Issue Description</th>
                  <th className="py-3 px-4 font-medium">Priority</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">Reported</th>
                  <th className="py-3 px-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {maintenanceTickets.map(ticket => (
                  <tr key={ticket.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-rose-400 whitespace-nowrap">
                      {ticket.ticketCode}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-white">Room {ticket.roomNumber}</div>
                      <div className="text-[11px] text-slate-400">{ticket.area}</div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="text-slate-200 font-medium">{ticket.issue}</div>
                      {ticket.resolutionNotes && (
                        <div className="text-[11px] text-teal-400/90 mt-0.5 font-mono">
                          Notes: {ticket.resolutionNotes}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`font-mono text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${
                          ticket.priority === 'urgent'
                            ? 'bg-rose-500/20 text-rose-400'
                            : ticket.priority === 'high'
                            ? 'bg-orange-500/20 text-orange-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`font-mono text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${
                          ticket.status === 'resolved'
                            ? 'bg-teal-500/20 text-teal-300'
                            : ticket.status === 'in_progress'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                      <div>{ticket.reportedAt}</div>
                      <div className="text-[10px] text-slate-500">{ticket.reportedBy}</div>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {ticket.status !== 'resolved' ? (
                        <button
                          onClick={() =>
                            updateMaintenanceTicket(
                              ticket.id,
                              'resolved',
                              'Inspected & fully repaired by on-duty engineering technician.'
                            )
                          }
                          className="px-2.5 py-1 rounded bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-[11px] transition-colors"
                        >
                          Resolve & Clear Room
                        </button>
                      ) : (
                        <span className="text-[11px] text-teal-400 font-mono flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Resolved</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
