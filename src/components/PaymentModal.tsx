import React, { useState } from 'react';
import { Reservation } from '../types/hotel';
import { useHotel } from '../context/HotelContext';
import { CreditCard, IndianRupee, Building, CheckCircle2, X, Lock } from 'lucide-react';

interface PaymentModalProps {
  reservation: Reservation;
  onClose: () => void;
  onSuccess?: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  reservation,
  onClose,
  onSuccess
}) => {
  const { recordFolioPayment } = useHotel();

  const charges = reservation.folio.filter(item => item.amount > 0);
  const payments = reservation.folio.filter(item => item.amount < 0);
  const totalCharges = charges.reduce((sum, item) => sum + item.amount, 0);
  const totalPayments = payments.reduce((sum, item) => sum + Math.abs(item.amount), 0);
  const balanceDue = +(totalCharges - totalPayments).toFixed(2);

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'corporate'>('card');
  const [payAmount, setPayAmount] = useState<string>(
    balanceDue > 0 ? balanceDue.toFixed(2) : '0.00'
  );
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4092');
  const [cardHolder, setCardHolder] = useState(reservation.guestName);
  const [expiry, setExpiry] = useState('11/28');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(payAmount);
    if (isNaN(amountVal) || amountVal <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      let ref = 'CASH-COUNTER';
      if (paymentMethod === 'card') {
        ref = `CARD-${cardNumber.slice(-4) || 'VISA'}`;
      } else if (paymentMethod === 'corporate') {
        ref = `CORP-DIRECT-BILL-${reservation.confirmationCode.slice(-4)}`;
      }

      recordFolioPayment(reservation.id, amountVal, ref);
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1400);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Settle Folio Payment (INR)</h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Folio #{reservation.id} · Room {reservation.roomNumber}
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

        <form onSubmit={handleProcessPayment} className="p-6 space-y-4">
          {/* Outstanding Balance Banner */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                Outstanding Balance Due
              </span>
              <div className="text-xl font-bold font-mono text-amber-400 tabular-nums">
                {balanceDue > 0 ? `₹${balanceDue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹0.00'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPayAmount(balanceDue > 0 ? balanceDue.toFixed(2) : '0.00')}
              className="text-[11px] font-medium text-amber-400 hover:text-amber-300 px-2 py-1 rounded bg-amber-500/10 transition-colors"
            >
              Pay Full Balance
            </button>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Settlement Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'card', label: 'Credit Card', icon: CreditCard },
                { id: 'cash', label: 'Cash / Front', icon: IndianRupee },
                { id: 'corporate', label: 'Direct Bill', icon: Building }
              ].map(method => {
                const Icon = method.icon;
                const isSelected = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 shadow-xs'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{method.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card Simulation details */}
          {paymentMethod === 'card' && (
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-mono tracking-wider mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                  />
                  <Lock className="w-3.5 h-3.5 text-emerald-400 absolute right-3 top-2.5" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-mono tracking-wider mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={e => setCardHolder(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-mono tracking-wider mb-1">
                    Expires (MM/YY)
                  </label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={e => setExpiry(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Amount to pay */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Payment Amount (₹ INR)</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-slate-400 font-mono text-xs">₹</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={payAmount}
                onChange={e => setPayAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-7 pr-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500 font-bold"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 py-2 px-4 rounded-xl border border-slate-800 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing || isSuccess}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 text-xs font-bold transition-all shadow-md active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>Payment Settled!</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authorize & Settle</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
