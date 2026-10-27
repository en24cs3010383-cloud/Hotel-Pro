import React from 'react';
import { Reservation } from '../types/hotel';
import { useHotel } from '../context/HotelContext';
import { Printer, Download, X, Hotel, CheckCircle, ShieldCheck } from 'lucide-react';

interface InvoiceModalProps {
  reservation: Reservation;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ reservation, onClose }) => {
  const { roomTypes, currentDate } = useHotel();
  const roomType = roomTypes.find(rt => rt.id === reservation.roomTypeId);

  const charges = reservation.folio.filter(item => item.amount > 0);
  const payments = reservation.folio.filter(item => item.amount < 0);
  const totalCharges = charges.reduce((sum, item) => sum + item.amount, 0);
  const totalPayments = payments.reduce((sum, item) => sum + Math.abs(item.amount), 0);
  const balanceDue = +(totalCharges - totalPayments).toFixed(2);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-8">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono text-amber-400 font-semibold tracking-wider">
              Official Guest Folio Statement
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-400 font-mono">Invoice #{reservation.confirmationCode}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Folio Document */}
        <div className="p-8 bg-slate-900 text-slate-100 print:bg-white print:text-black print:p-0 space-y-6">
          {/* Letterhead */}
          <div className="flex items-start justify-between border-b border-slate-800 print:border-neutral-300 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  <Hotel className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-white print:text-black">
                    HotelPro Grand & Spa
                  </h1>
                  <p className="text-[11px] text-slate-400 print:text-neutral-600">
                    500 Grand Boulevard · Luxury Hospitality Group · GSTIN: 27AAAAA0000A1Z5
                  </p>
                </div>
              </div>
            </div>

            <div className="text-right font-mono text-xs text-slate-300 print:text-neutral-700 space-y-1">
              <div><span className="text-slate-500">Folio Number:</span> {reservation.id}</div>
              <div><span className="text-slate-500">Date Issued:</span> {currentDate}</div>
              <div><span className="text-slate-500">Room:</span> {reservation.roomNumber} ({roomType?.name || 'Suite'})</div>
            </div>
          </div>

          {/* Guest & Stay Metadata */}
          <div className="grid grid-cols-2 gap-6 p-4 rounded-xl bg-slate-950/60 print:bg-neutral-50 border border-slate-800 print:border-neutral-200 text-xs">
            <div>
              <p className="text-[10px] uppercase font-mono tracking-wider text-amber-400 print:text-amber-700 font-semibold mb-1">
                Guest Information
              </p>
              <p className="font-bold text-sm text-white print:text-black">{reservation.guestName}</p>
              <p className="text-slate-300 print:text-neutral-700">{reservation.guestEmail}</p>
              <p className="text-slate-400 print:text-neutral-500 font-mono">{reservation.guestPhone}</p>
            </div>
            <div className="space-y-1 text-slate-300 print:text-neutral-700">
              <p className="text-[10px] uppercase font-mono tracking-wider text-amber-400 print:text-amber-700 font-semibold mb-1">
                Stay Details
              </p>
              <div className="flex justify-between">
                <span className="text-slate-400">Arrival Date:</span>
                <span className="font-mono font-medium">{reservation.checkInDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Departure Date:</span>
                <span className="font-mono font-medium">{reservation.checkOutDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Nights / Guests:</span>
                <span className="font-mono">{reservation.nights} Night(s) · {reservation.adults} Adult(s)</span>
              </div>
            </div>
          </div>

          {/* Itemized Folio Table */}
          <div className="border border-slate-800 print:border-neutral-300 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 print:bg-neutral-100 text-slate-400 print:text-neutral-600 font-mono text-[11px] border-b border-slate-800 print:border-neutral-300">
                <tr>
                  <th className="py-2.5 px-4 font-medium">Date & Time</th>
                  <th className="py-2.5 px-4 font-medium">Category</th>
                  <th className="py-2.5 px-4 font-medium">Description</th>
                  <th className="py-2.5 px-4 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 print:divide-neutral-200">
                {reservation.folio.map(item => (
                  <tr key={item.id} className="hover:bg-slate-800/20 print:hover:bg-transparent">
                    <td className="py-2.5 px-4 font-mono text-slate-400 print:text-neutral-600 whitespace-nowrap">
                      {item.date} {item.time}
                    </td>
                    <td className="py-2.5 px-4 capitalize font-mono text-[11px] text-slate-300 print:text-neutral-700">
                      {item.category}
                    </td>
                    <td className="py-2.5 px-4 text-slate-200 print:text-neutral-900 font-medium">
                      {item.description}
                      {item.reference && (
                        <span className="block text-[10px] text-slate-500 font-mono">Ref: {item.reference}</span>
                      )}
                    </td>
                    <td
                      className={`py-2.5 px-4 text-right font-mono font-medium tabular-nums ${
                        item.amount < 0
                          ? 'text-emerald-400 print:text-emerald-700'
                          : 'text-slate-200 print:text-black'
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

          {/* Folio Summary Totals */}
          <div className="flex justify-end pt-2">
            <div className="w-72 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400 print:text-neutral-600">
                <span>Total Charges:</span>
                <span className="font-mono tabular-nums text-slate-200 print:text-black font-semibold">
                  ₹{totalCharges.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-slate-400 print:text-neutral-600">
                <span>Total Payments / Deposits:</span>
                <span className="font-mono tabular-nums text-emerald-400 print:text-emerald-700 font-semibold">
                  -₹{totalPayments.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800 print:border-neutral-300 text-sm font-bold">
                <span className="text-white print:text-black">Balance Due:</span>
                <span
                  className={`font-mono tabular-nums ${
                    balanceDue <= 0.01
                      ? 'text-emerald-400 print:text-emerald-700'
                      : 'text-amber-400 print:text-amber-700'
                  }`}
                >
                  {balanceDue <= 0.01 ? '₹0.00' : `₹${balanceDue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                </span>
              </div>
              {balanceDue <= 0.01 ? (
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 print:text-emerald-700 font-mono mt-1 justify-end">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Folio Fully Settled & Reconciled</span>
                </div>
              ) : (
                <div className="text-[11px] text-amber-400 print:text-amber-700 font-mono mt-1 text-right">
                  Outstanding balance payable upon checkout
                </div>
              )}
            </div>
          </div>

          {/* Legal disclaimer */}
          <div className="pt-6 border-t border-slate-800 print:border-neutral-300 text-[10px] text-slate-500 print:text-neutral-500 font-mono space-y-1">
            <p>I agree that my liability for this bill is not waived and agree to be held personally liable in the event that the indicated person, company or association fails to pay for any part or the full amount of these charges.</p>
            <div className="flex justify-between pt-4">
              <span>Guest Signature: _________________________________</span>
              <span>Front Desk Agent: Elena Vance (ID #4012)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
