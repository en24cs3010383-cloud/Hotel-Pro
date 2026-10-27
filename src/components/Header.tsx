import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { UserRole } from '../types/hotel';
import {
  Hotel,
  Plus,
  ShieldCheck,
  UserCheck,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Key,
  BadgeCheck,
  Video
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenNewReservation: () => void;
  onOpenArchitectureModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  onOpenNewReservation,
  onOpenArchitectureModal
}) => {
  const { currentUser, switchRole, resetDemoData, currentDate, currentTime } = useHotel();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'rooms', label: 'Rooms & Matrix' },
    { id: 'reservations', label: 'Reservations' },
    { id: 'front-desk', label: 'Front Desk' },
    { id: 'billing', label: 'Folios & Billing' },
    { id: 'housekeeping', label: 'Housekeeping' },
    { id: 'crm', label: 'Guest CRM' },
    { id: 'kiosk', label: 'Guest Kiosk' }
  ];

  const roleLabels: Record<UserRole, { label: string; badge: string }> = {
    admin: { label: 'General Manager (Admin)', badge: 'Full Access' },
    front_desk: { label: 'Elena Vance (Front Desk)', badge: 'Reception' },
    housekeeping: { label: 'Rosa Mendez (Housekeeping Lead)', badge: 'Operations' },
    revenue_manager: { label: 'Sarah Lin (Revenue Director)', badge: 'Finance' },
    guest: { label: 'Jonathan Hayes (Guest View)', badge: 'In-Room 301' }
  };

  const handleRoleSelect = (role: UserRole) => {
    switchRole(role);
    setShowRoleMenu(false);
    if (role === 'guest') {
      setCurrentTab('kiosk');
    } else if (role === 'housekeeping') {
      setCurrentTab('housekeeping');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-md">
              <Hotel className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors whitespace-nowrap">
                HotelPro
              </span>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                <span>Grand Luxury PMS</span>
                <span aria-hidden="true">·</span>
                <span className="text-amber-400 font-bold">₹ INR</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-300 font-medium">{currentDate}</span>
              </div>
            </div>
          </button>
        </div>

        {/* Zone 2: Single-line navigation links */}
        <nav className="hidden xl:flex items-center gap-1 overflow-x-auto py-1">
          {navItems.map(item => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-amber-400 shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action + role credentials dropdown */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Role / JWT Profile Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 transition-colors"
              title="Switch simulated JWT user role"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <div className="text-left hidden sm:block">
                <p className="text-[11px] font-medium leading-none text-slate-200 truncate max-w-[120px]">
                  {currentUser.name}
                </p>
                <p className="text-[9px] text-amber-400/90 font-mono leading-none mt-0.5">
                  {roleLabels[currentUser.role]?.badge}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-750 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-800 text-xs text-slate-400">
                  <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <ShieldCheck className="w-3 h-3" /> JWT Authenticated
                    </span>
                    <span>HS256 Token</span>
                  </div>
                  <p className="mt-1 font-mono text-[9px] text-slate-400 truncate">
                    Bearer {currentUser.token.slice(0, 26)}...
                  </p>
                </div>

                <div className="py-1">
                  <div className="px-3 py-1 text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                    Select User Role
                  </div>
                  {(['admin', 'front_desk', 'housekeeping', 'revenue_manager', 'guest'] as UserRole[]).map(
                    role => (
                      <button
                        key={role}
                        onClick={() => handleRoleSelect(role)}
                        className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between transition-colors ${
                          currentUser.role === role
                            ? 'bg-amber-500/10 text-amber-300 font-medium'
                            : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                        }`}
                      >
                        <div>
                          <div className="font-medium">{roleLabels[role].label}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Role: {role}
                          </div>
                        </div>
                        {currentUser.role === role && (
                          <BadgeCheck className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                      </button>
                    )
                  )}
                </div>

                <div className="pt-2 border-t border-slate-800 mt-1 flex items-center justify-between px-2">
                  <button
                    onClick={() => {
                      resetDemoData();
                      setShowRoleMenu(false);
                    }}
                    className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-rose-400 px-2 py-1 rounded transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset Seed Data
                  </button>
                  <span className="text-[10px] text-slate-400 font-mono">{currentTime}</span>
                </div>
              </div>
            )}
          </div>

          {/* Architecture, ER & Demo Walkthrough Button */}
          <button
            onClick={onOpenArchitectureModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs"
            title="System Architecture, ER Schema, MVC & Interactive Demo Walkthrough"
          >
            <Video className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Docs & Demo</span>
          </button>

          {/* Primary Action Button: New Reservation */}
          <button
            onClick={onOpenNewReservation}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-sm transition-all active:scale-95 whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New Booking</span>
          </button>
        </div>
      </div>

      {/* Sub-bar for mobile/tablet horizontal scroll navigation */}
      <div className="xl:hidden border-t border-slate-850 px-4 py-2 overflow-x-auto flex gap-1.5 scrollbar-none">
        {navItems.map(item => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'bg-slate-800 text-amber-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
