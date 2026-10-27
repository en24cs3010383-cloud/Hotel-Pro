/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HotelProvider, useHotel } from './context/HotelContext';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { RoomMatrixView } from './components/RoomMatrixView';
import { ReservationsView } from './components/ReservationsView';
import { FrontDeskView } from './components/FrontDeskView';
import { FolioBillingView } from './components/FolioBillingView';
import { HousekeepingView } from './components/HousekeepingView';
import { GuestCrmView } from './components/GuestCrmView';
import { GuestKioskView } from './components/GuestKioskView';

import { KeycardModal } from './components/KeycardModal';
import { InvoiceModal } from './components/InvoiceModal';
import { AddFolioChargeModal } from './components/AddFolioChargeModal';
import { PaymentModal } from './components/PaymentModal';
import { NewReservationModal } from './components/NewReservationModal';
import { RoomDetailsModal } from './components/RoomDetailsModal';
import { HousekeepingChecklistModal } from './components/HousekeepingChecklistModal';
import { NewMaintenanceModal } from './components/NewMaintenanceModal';
import { SystemArchitectureModal } from './components/SystemArchitectureModal';

import { Room, Reservation, HousekeepingTask } from './types/hotel';

function HotelAppContent() {
  const { reservations, checkOutGuest, rooms } = useHotel();
  const [currentTab, setCurrentTab] = useState('dashboard');

  // Modals state
  const [showArchitectureModal, setShowArchitectureModal] = useState(false);
  const [showNewReservation, setShowNewReservation] = useState(false);
  const [keycardRes, setKeycardRes] = useState<Reservation | null>(null);
  const [invoiceRes, setInvoiceRes] = useState<Reservation | null>(null);
  const [addChargeRes, setAddChargeRes] = useState<Reservation | null>(null);
  const [paymentRes, setPaymentRes] = useState<Reservation | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [checklistTask, setChecklistTask] = useState<HousekeepingTask | null>(null);
  const [maintenanceRoom, setMaintenanceRoom] = useState<string | undefined>(undefined);
  const [showNewMaintenance, setShowNewMaintenance] = useState(false);
  const [targetFolioResId, setTargetFolioResId] = useState<string | undefined>(undefined);

  const handleOpenFolio = (resId: string) => {
    setTargetFolioResId(resId);
    setCurrentTab('billing');
  };

  const handleCheckIn = (resId: string) => {
    const res = reservations.find(r => r.id === resId);
    if (res) {
      setKeycardRes(res);
    }
  };

  const handleCheckOut = (resId: string) => {
    const res = reservations.find(r => r.id === resId);
    if (!res) return;

    // Check if balance due
    const charges = res.folio.filter(f => f.amount > 0).reduce((s, c) => s + c.amount, 0);
    const payments = res.folio.filter(f => f.amount < 0).reduce((s, c) => s + Math.abs(c.amount), 0);
    const balance = +(charges - payments).toFixed(2);

    if (balance > 0.05) {
      // Prompt payment first
      setPaymentRes(res);
    } else {
      checkOutGuest(resId);
    }
  };

  const handleRequestCleaning = (roomNumber: string) => {
    setCurrentTab('housekeeping');
  };

  const handleRequestMaintenance = (roomNumber: string) => {
    setMaintenanceRoom(roomNumber);
    setShowNewMaintenance(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-amber-400 selection:text-slate-950">
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenNewReservation={() => setShowNewReservation(true)}
        onOpenArchitectureModal={() => setShowArchitectureModal(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'dashboard' && (
          <DashboardView
            onNavigateTab={setCurrentTab}
            onOpenNewReservation={() => setShowNewReservation(true)}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
          />
        )}

        {currentTab === 'rooms' && (
          <RoomMatrixView
            onSelectRoom={setSelectedRoom}
            onRequestCleaning={handleRequestCleaning}
            onRequestMaintenance={handleRequestMaintenance}
          />
        )}

        {currentTab === 'reservations' && (
          <ReservationsView
            onOpenNewReservation={() => setShowNewReservation(true)}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            onOpenFolio={handleOpenFolio}
          />
        )}

        {currentTab === 'front-desk' && (
          <FrontDeskView
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            onOpenFolio={handleOpenFolio}
          />
        )}

        {currentTab === 'billing' && (
          <FolioBillingView
            selectedReservationId={targetFolioResId}
            onOpenAddCharge={resId => {
              const res = reservations.find(r => r.id === resId);
              if (res) setAddChargeRes(res);
            }}
            onOpenPayment={resId => {
              const res = reservations.find(r => r.id === resId);
              if (res) setPaymentRes(res);
            }}
            onOpenInvoice={resId => {
              const res = reservations.find(r => r.id === resId);
              if (res) setInvoiceRes(res);
            }}
          />
        )}

        {currentTab === 'housekeeping' && (
          <HousekeepingView
            onOpenChecklist={setChecklistTask}
            onOpenNewTicket={() => {
              setMaintenanceRoom(undefined);
              setShowNewMaintenance(true);
            }}
          />
        )}

        {currentTab === 'crm' && <GuestCrmView />}

        {currentTab === 'kiosk' && (
          <GuestKioskView onOpenFolio={handleOpenFolio} />
        )}
      </main>

      {/* Global Modals */}
      {showNewReservation && (
        <NewReservationModal
          onClose={() => setShowNewReservation(false)}
          onSuccess={() => {
            setShowNewReservation(false);
            setCurrentTab('reservations');
          }}
        />
      )}

      {keycardRes && (
        <KeycardModal
          reservation={keycardRes}
          onClose={() => setKeycardRes(null)}
          onSuccess={() => {
            setKeycardRes(null);
          }}
        />
      )}

      {invoiceRes && (
        <InvoiceModal
          reservation={invoiceRes}
          onClose={() => setInvoiceRes(null)}
        />
      )}

      {addChargeRes && (
        <AddFolioChargeModal
          reservation={addChargeRes}
          onClose={() => setAddChargeRes(null)}
        />
      )}

      {paymentRes && (
        <PaymentModal
          reservation={paymentRes}
          onClose={() => setPaymentRes(null)}
          onSuccess={() => {
            // If checking out and now paid, finish checkout
            if (currentTab === 'front-desk') {
              checkOutGuest(paymentRes.id);
            }
          }}
        />
      )}

      {selectedRoom && (
        <RoomDetailsModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
          onOpenFolio={handleOpenFolio}
          onRequestCleaning={handleRequestCleaning}
          onRequestMaintenance={handleRequestMaintenance}
        />
      )}

      {checklistTask && (
        <HousekeepingChecklistModal
          task={checklistTask}
          onClose={() => setChecklistTask(null)}
        />
      )}

      {showNewMaintenance && (
        <NewMaintenanceModal
          initialRoomNumber={maintenanceRoom}
          onClose={() => setShowNewMaintenance(false)}
        />
      )}

      {showArchitectureModal && (
        <SystemArchitectureModal
          onClose={() => setShowArchitectureModal(false)}
          onNavigateToTab={tab => {
            setCurrentTab(tab);
            setShowArchitectureModal(false);
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <HotelProvider>
      <HotelAppContent />
    </HotelProvider>
  );
}
