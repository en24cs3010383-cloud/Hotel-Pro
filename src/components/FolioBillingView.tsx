import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { Reservation, FolioItem } from '../types/hotel';
import {
  Receipt,
  Plus,
  CreditCard,
  Printer,
  Utensils,
  Sparkles,
  Wine,
  Car,
  Bed,
  CheckCircle2,
  IndianRupee,
  ChevronDown
} from 'lucide-react';

interface FolioBillingViewProps {
  selectedReservationId?: string;
  onOpenAddCharge: (resId: string) => void;
  onOpenPayment: (resId: string) => void;
  onOpenInvoice: (resId: string) => void;
}

export const FolioBillingView: React.FC<FolioBillingViewProps> = ({
  selectedReservationId,
  onOpenAddCharge,
  onOpenPayment,
  onOpenInvoice
}) => {
  const { reservations, roomTypes } = useHotel();

  // Active reservations that have folios
  const activeReservations = reservations.filter(
    r => r.status === 'checked_in' || r.status === 'confirmed' || r.status === 'checked_out'
  );

  const [currentResId, setCurrentResId] = useState<string>(
    selectedReservationId || activeReservations[0]?.id || ''
  );

  const currentRes =
    reservations.find(r => r.id === currentResId) || activeReservations[0];

  const charges = currentRes ? currentRes.folio.filter(item => item.amount > 0) : [];
  const payments = currentRes ? currentRes.folio.filter(item => item.amount < 0) : [];
  const totalCharges = charges.reduce((sum, item) => sum + item.amount, 0);
  const totalPayments = payments.reduce((sum, item) => sum + Math.abs(item.amount), 0);
  const balanceDue = +(totalCharges - totalPayments).toFixed(2);

  const getCategoryIcon = (category: FolioItem['category']) => {
    switch (category) {
      case 'dining':
        return <Utensils className="w-3.5 h-3.5 text-amber-400" />;
      case 'spa':
        return <Sparkles className="w-3.5 h-3.5 text-teal-400" />;
      case 'minibar':
        return <Wine className="w-3.5 h-3.5 text-purple-400" />;
      case 'valet':
        return <Car className="w-3.5 h-3.5 text-sky-400" />;
      case 'room':
        return <Bed className="w-3.5 h-3.5 text-blue-400" />;
      case 'payment':
        return <CreditCard className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Receipt className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Reservation Selector */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Receipt className="w-5 h-5 text-amber-400" />
              <span>Guest Folio & Financial Billing Ledger</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Live departmental postings, incidental charge audits, pre-authorizations & payment settlements
            </p>
          </div>

          {/* Quick Select Reservation */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Active Folio:</span>
            <select
              value={currentRes?.id || ''}
              onChange={e => setCurrentResId(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-medium"
            >
              {activeReservations.map(r => (
                <option key={r.id} value={r.id}>
                  Room {r.roomNumber} · {r.guestName} (#{r.confirmationCode})
                </option>
              ))}
            </select>
          </div>
        </div>

        {currentRes && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white">{currentRes.guestName}</span>
                <span className="text-xs font-mono text-amber-400">Room {currentRes.roomNumber}</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {currentRes.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Confirmation #{currentRes.confirmationCode} · {currentRes.checkInDate} to {currentRes.checkOutDate} ({currentRes.nights} Nights)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAddCharge(currentRes.id)}
                className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Post Charge</span>
              </button>

              <button
                onClick={() => onOpenPayment(currentRes.id)}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Settle Payment</span>
              </button>

              <button
                onClick={() => onOpenInvoice(currentRes.id)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {currentRes && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Folio Table (2 Cols) */}
          <div className="lg:col-span-2 border border-slate-800 rounded-2xl bg-slate-900 overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">Itemized Transactions & Vouchers</h2>
              <span className="text-xs font-mono text-slate-400">
                {currentRes.folio.length} Total Postings
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4 font-medium">Timestamp</th>
                    <th className="py-2.5 px-4 font-medium">Type</th>
                    <th className="py-2.5 px-4 font-medium">Description</th>
                    <th className="py-2.5 px-4 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {currentRes.folio.map(item => (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-2.5 px-4 font-mono text-slate-400 whitespace-nowrap">
                        {item.date} {item.time}
                      </td>
                      <td className="py-2.5 px-4 capitalize font-mono text-slate-300">
                        <div className="flex items-center gap-1.5">
                          {getCategoryIcon(item.category)}
                          <span>{item.category}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-slate-200 font-medium">
                        {item.description}
                        {item.reference && (
                          <span className="block text-[10px] text-slate-500 font-mono">
                            Ref: {item.reference}
                          </span>
                        )}
                      </td>
                      <td
                        className={`py-2.5 px-4 text-right font-mono font-medium tabular-nums ${
                          item.amount < 0 ? 'text-emerald-400' : 'text-slate-100'
                        }`}
                      >
                        {item.amount < 0
                          ? `-₹${Math.abs(item.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                          : `₹${item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Folio Balance Summary Box (1 Col) */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 h-fit">
            <h2 className="text-sm font-bold text-white">Billing Summary & Reconciliation</h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Total Charges Posted:</span>
                <span className="font-mono tabular-nums font-semibold text-white">
                  ₹{totalCharges.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Total Payments / Deposits:</span>
                <span className="font-mono tabular-nums font-semibold text-emerald-400">
                  -₹{totalPayments.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                <span className="text-sm font-bold text-white">Current Balance Due:</span>
                <span
                  className={`text-xl font-bold font-mono tabular-nums ${
                    balanceDue <= 0.01 ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {balanceDue <= 0.01 ? '₹0.00' : `₹${balanceDue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                </span>
              </div>
            </div>

            {balanceDue <= 0.01 ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Account is balanced with zero outstanding balance.</span>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs space-y-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 shrink-0 text-amber-400" />
                  <span className="font-semibold">Balance Due Upon Departure</span>
                </div>
                <button
                  onClick={() => onOpenPayment(currentRes.id)}
                  className="w-full py-1.5 px-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors"
                >
                  Pay Outstanding ₹{balanceDue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </button>
              </div>
            )}

            <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                Departmental Charge Split
              </span>
              {[
                { label: 'Room & Taxes', cat: ['room', 'tax'] },
                { label: 'Dining & Room Service', cat: ['dining'] },
                { label: 'Spa & Wellness', cat: ['spa'] },
                { label: 'Minibar & Refreshments', cat: ['minibar'] }
              ].map(group => {
                const groupSum = currentRes.folio
                  .filter(f => group.cat.includes(f.category) && f.amount > 0)
                  .reduce((s, c) => s + c.amount, 0);

                if (groupSum === 0) return null;

                return (
                  <div key={group.label} className="flex justify-between text-slate-400">
                    <span>{group.label}</span>
                    <span className="font-mono tabular-nums text-slate-200">
                      ₹{groupSum.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
