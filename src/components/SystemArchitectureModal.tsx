import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Layers,
  Database,
  Users,
  GitBranch,
  Video,
  CheckCircle2,
  Server,
  Monitor,
  Shield,
  FileText,
  Bed,
  CreditCard,
  Sparkles,
  Key,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface SystemArchitectureModalProps {
  onClose: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export const SystemArchitectureModal: React.FC<SystemArchitectureModalProps> = ({
  onClose,
  onNavigateToTab
}) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'er_diagram' | 'mvc' | 'roles_flows' | 'demo_video'>('demo_video');

  // Video Demo Simulation State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const demoSteps = [
    {
      title: '01. Executive Overview & Pacing Dashboard',
      time: '0:00 - 0:15',
      tabId: 'dashboard',
      description: 'Real-time calculation of RevPAR, ADR, and daily occupancy rate with automated arrivals and departures queues.',
      actionHighlight: 'Monitors 24 rooms across 4 floors, tracks daily realized revenue in INR (₹), and surfaces immediate operational priorities.',
      keyMetrics: 'Occupancy: 42% · ADR: ₹16,500 · Today Revenue: ₹1,45,000'
    },
    {
      title: '02. Room Matrix & Real-Time Availability Grid',
      time: '0:15 - 0:35',
      tabId: 'rooms',
      description: 'Interactive floor-by-floor room grid supporting Floors 1 to 4 with status states and 1-click condition updates.',
      actionHighlight: 'Filter by floor or status (Available, Inspected, Occupied, Reserved, Dirty, Out of Order). Click any room to open deep room inspection.',
      keyMetrics: '4 Luxury Floors · 4 Room Categories · Live Status Badges'
    },
    {
      title: '03. Direct Booking Engine & Stay Timeline',
      time: '0:35 - 0:55',
      tabId: 'reservations',
      description: 'Integrated booking wizard calculating stay nights, room tariffs, and 18% Hospitality GST & luxury cess.',
      actionHighlight: 'Generates cryptographic reservation codes (HP-XXXXXX) with instant calendar allocation across the 7-day Gantt timeline.',
      keyMetrics: 'Automated GST Calculation · Double-booking Prevention'
    },
    {
      title: '04. Front Desk Check-In & RFID Keycard Encoder',
      time: '0:55 - 1:15',
      tabId: 'front-desk',
      description: 'Express check-in queue with government ID verification and virtual NFC/RFID keycard encoding simulation.',
      actionHighlight: 'Reassigns suites on arrival, encodes virtual keycard (KC-XXX), updates room state to Occupied, and activates guest privileges.',
      keyMetrics: 'NFC Pass Emulation · 1-Click Express Check-In'
    },
    {
      title: '05. Guest Folios, Departmental Postings & Payments',
      time: '1:15 - 1:35',
      tabId: 'billing',
      description: 'Financial ledger tracking room night charges, dining, spa treatments, minibar, and valet parking.',
      actionHighlight: 'Live reconciliation calculates balance due. Settle via Credit Card, Cash, or Direct Bill, and generate printable luxury GST invoices.',
      keyMetrics: 'Live Reconciliation · Printable GSTIN Statement'
    },
    {
      title: '06. Housekeeping Checklist & Engineering Work Orders',
      time: '1:35 - 1:50',
      tabId: 'housekeeping',
      description: 'Attendant turnover dispatch with interactive sanitary checklists and engineering repair ticketing.',
      actionHighlight: 'Checklist validation marks rooms Inspected / Ready. Urgent repair tickets automatically flag rooms Out of Order.',
      keyMetrics: '5-Point Turnover Checklist · Priority Ticket Routing'
    },
    {
      title: '07. In-Room Guest Tablet & Digital Room Key Pass',
      time: '1:50 - 2:05',
      tabId: 'kiosk',
      description: 'In-room guest self-service tablet with tap-to-unlock NFC simulation, express dining ordering, and butler calls.',
      actionHighlight: 'Orders charge directly to the live room folio; amenity requests dispatch instantly to housekeeping attendants.',
      keyMetrics: 'Smart Door Unlock Animation · Real-Time Folio Audit'
    }
  ];

  // Auto-play timer for demo walkthrough
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setCurrentStepIndex(curr => (curr + 1) % demoSteps.length);
            return 0;
          }
          return prev + 5;
        });
      }, 350);
    }
    return () => clearInterval(interval);
  }, [isPlaying, demoSteps.length]);

  const currentStep = demoSteps[currentStepIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl my-6 flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                HotelPro — Technical Architecture & System Documentation
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                System Specification · ER Schema · MVC Architecture · Live Walkthrough
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

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 border-b border-slate-800 bg-slate-950/40 overflow-x-auto text-xs py-2 scrollbar-none">
          {[
            { id: 'demo_video', label: 'Interactive Demo Video Walkthrough', icon: Video },
            { id: 'architecture', label: 'Technical Architecture', icon: Layers },
            { id: 'er_diagram', label: 'Entity-Relationship (ER) Diagram', icon: Database },
            { id: 'mvc', label: 'MVC Pattern Design', icon: GitBranch },
            { id: 'roles_flows', label: 'Roles & User Flows', icon: Users }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-300">
          {/* TAB 1: INTERACTIVE DEMO VIDEO PLAYER */}
          {activeTab === 'demo_video' && (
            <div className="space-y-6">
              {/* Simulated HD Video Player Viewport */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
                {/* Simulated Screen Stage */}
                <div className="relative h-64 sm:h-80 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/20 p-6 flex flex-col justify-between">
                  {/* Top Video Status Overlay */}
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                      <span className="text-white font-bold uppercase tracking-wider">
                        HotelPro Live Demonstration
                      </span>
                      <span className="text-slate-500">·</span>
                      <span className="text-amber-400 font-semibold">{currentStep.time}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-slate-800/80 text-[10px] text-slate-300 border border-slate-700">
                      1080p 60fps · Simulated Interactive Player
                    </span>
                  </div>

                  {/* Center Visual Mockup of the Active Step */}
                  <div className="text-center space-y-2 max-w-lg mx-auto py-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[11px]">
                      <span>Chapter {currentStepIndex + 1} of {demoSteps.length}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {currentStep.title}
                    </h3>
                    <p className="text-xs text-slate-300">
                      {currentStep.description}
                    </p>
                    <div className="pt-2">
                      <span className="inline-block px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 font-mono">
                        {currentStep.keyMetrics}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Player Controls */}
                  <div className="space-y-2 pt-2">
                    {/* Scrub bar */}
                    <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-amber-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${((currentStepIndex + progress / 100) / demoSteps.length) * 100}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="w-8 h-8 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center font-bold shadow-md transition-transform active:scale-95"
                          title={isPlaying ? 'Pause Demo' : 'Play Demo'}
                        >
                          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                        </button>
                        <button
                          onClick={() => {
                            setCurrentStepIndex(0);
                            setProgress(0);
                          }}
                          className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                          title="Restart Demo"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[11px] font-mono text-slate-400">
                          {isPlaying ? 'Playing Walkthrough...' : 'Paused'}
                        </span>
                      </div>

                      {onNavigateToTab && (
                        <button
                          onClick={() => {
                            onNavigateToTab(currentStep.tabId);
                            onClose();
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold transition-colors"
                        >
                          <span>Open Live Feature Tab</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step Sequence Playlist */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400 font-bold">
                  Walkthrough Sequence & Feature Demonstrations (Click any chapter to jump)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {demoSteps.map((step, idx) => {
                    const isCurrent = currentStepIndex === idx;
                    return (
                      <div
                        key={step.title}
                        onClick={() => {
                          setCurrentStepIndex(idx);
                          setProgress(0);
                        }}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                          isCurrent
                            ? 'bg-amber-500/10 border-amber-500/50 text-white ring-1 ring-amber-400/30'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                          <span className={isCurrent ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                            Step 0{idx + 1}
                          </span>
                          <span>{step.time}</span>
                        </div>
                        <h5 className="font-bold text-xs text-slate-200 leading-snug">{step.title}</h5>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{step.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TECHNICAL ARCHITECTURE */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>High-Level 4-Tier Enterprise Architecture</span>
                </h3>
                <p className="text-slate-400">
                  HotelPro is architected as an event-driven, reactive Single Page Application (SPA) powered by React 19, TypeScript, and a unified state-engine with strict schema enforcement, optimistic cache updates, and resilient offline/local persistence.
                </p>
              </div>

              {/* Architectural Layers Diagram */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-bold">Tier 1: Presentation</div>
                  <h4 className="font-bold text-white text-xs">Client & UI Layer</h4>
                  <ul className="space-y-1 text-slate-400 text-[11px]">
                    <li>· React 19 Functional Hooks</li>
                    <li>· Tailwind CSS v4 Styling</li>
                    <li>· Lucide Iconography</li>
                    <li>· Motion Animation Curves</li>
                    <li>· 1440px Desktop Baseline</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-sky-500/30 space-y-2">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-sky-400 font-bold">Tier 2: Business Logic</div>
                  <h4 className="font-bold text-white text-xs">Controller Operations</h4>
                  <ul className="space-y-1 text-slate-400 text-[11px]">
                    <li>· Reservation Engine</li>
                    <li>· Occupancy & Tariff Calculator</li>
                    <li>· 18% GST & Cess Engine</li>
                    <li>· Keycard RFID Simulator</li>
                    <li>· Housekeeping Dispatch</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-teal-500/30 space-y-2">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-teal-400 font-bold">Tier 3: Security & State</div>
                  <h4 className="font-bold text-white text-xs">Auth & Reactive Store</h4>
                  <ul className="space-y-1 text-slate-400 text-[11px]">
                    <li>· JWT Bearer Simulation</li>
                    <li>· Role-Based RBAC Guards</li>
                    <li>· React HotelContext</li>
                    <li>· Optimistic Updates</li>
                    <li>· Departure Balance Lock</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-bold">Tier 4: Storage</div>
                  <h4 className="font-bold text-white text-xs">Data & Persistence</h4>
                  <ul className="space-y-1 text-slate-400 text-[11px]">
                    <li>· Browser LocalStorage</li>
                    <li>· Versioned Storage Keys</li>
                    <li>· Initial Seed Fixtures</li>
                    <li>· Relational Integrity</li>
                    <li>· INR Numeral Standard</li>
                  </ul>
                </div>
              </div>

              {/* Security & Standards */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-bold text-white text-xs flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Security & Compliance Highlights</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-slate-400">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <strong className="text-white block mb-0.5">JWT Token Verification</strong>
                    HS256 signature verification with decoded role claims and session expiration timestamps.
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <strong className="text-white block mb-0.5">Departure Financial Guard</strong>
                    Prevents room checkout before all outstanding folio balances are settled to zero.
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <strong className="text-white block mb-0.5">Indian GST Compliance</strong>
                    Automatic 18% GST calculation across room tariffs and banquet dining with GSTIN identification.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ER DIAGRAM */}
          {activeTab === 'er_diagram' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-teal-400" />
                  <span>Relational Entity-Relationship (ER) Schema</span>
                </h3>
                <p className="text-slate-400">
                  The domain model enforces 1:N and N:1 relations between Room Categories, physical Rooms, Guest Profiles, Reservations, itemized Folio Vouchers, and Operational Work Orders.
                </p>
              </div>

              {/* Text / Visual Relational Cardinality Map */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs overflow-x-auto space-y-4">
                <div className="text-amber-400 font-bold text-center border-b border-slate-800 pb-2">
                  HOTELPRO DATABASE SCHEMA & CARDINALITY MAP
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Entity 1: ROOM_TYPES */}
                  <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/80">
                    <div className="text-amber-300 font-bold border-b border-slate-800 pb-1">
                      ROOM_TYPES (Entity)
                    </div>
                    <div className="text-[11px] text-slate-400 space-y-0.5 mt-1">
                      <div><span className="text-emerald-400">PK</span> id: STRING</div>
                      <div>name: STRING</div>
                      <div>basePrice: NUMBER (INR ₹)</div>
                      <div>maxOccupancy: NUMBER</div>
                      <div>bedType: STRING</div>
                      <div>sizeSqFt: NUMBER</div>
                      <div>amenities: ARRAY&lt;STRING&gt;</div>
                    </div>
                  </div>

                  {/* Entity 2: ROOMS */}
                  <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/80">
                    <div className="text-amber-300 font-bold border-b border-slate-800 pb-1">
                      ROOMS (Entity)
                    </div>
                    <div className="text-[11px] text-slate-400 space-y-0.5 mt-1">
                      <div><span className="text-emerald-400">PK</span> id: STRING</div>
                      <div>number: STRING (e.g. "101")</div>
                      <div>floor: NUMBER (1..4)</div>
                      <div><span className="text-sky-400">FK</span> typeId ──&gt; ROOM_TYPES.id</div>
                      <div>status: ENUM (available, occupied, dirty...)</div>
                      <div>assignedStaff: STRING</div>
                      <div>notes: STRING</div>
                    </div>
                  </div>

                  {/* Entity 3: GUESTS */}
                  <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/80">
                    <div className="text-amber-300 font-bold border-b border-slate-800 pb-1">
                      GUESTS (CRM Entity)
                    </div>
                    <div className="text-[11px] text-slate-400 space-y-0.5 mt-1">
                      <div><span className="text-emerald-400">PK</span> id: STRING (GST-XXX)</div>
                      <div>name: STRING</div>
                      <div>email: STRING (UNIQUE)</div>
                      <div>phone: STRING</div>
                      <div>idPassportNumber: STRING</div>
                      <div>vipLevel: ENUM (Standard, Silver, Gold, VIP)</div>
                      <div>totalStays: NUMBER</div>
                      <div>lifetimeSpend: NUMBER (INR ₹)</div>
                    </div>
                  </div>

                  {/* Entity 4: RESERVATIONS */}
                  <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/80">
                    <div className="text-amber-300 font-bold border-b border-slate-800 pb-1">
                      RESERVATIONS (Transaction Entity)
                    </div>
                    <div className="text-[11px] text-slate-400 space-y-0.5 mt-1">
                      <div><span className="text-emerald-400">PK</span> id: STRING (RES-XXXX)</div>
                      <div>confirmationCode: STRING (HP-XXXXXX)</div>
                      <div><span className="text-sky-400">FK</span> guestId ──&gt; GUESTS.id</div>
                      <div><span className="text-sky-400">FK</span> roomNumber ──&gt; ROOMS.number</div>
                      <div>checkInDate / checkOutDate: DATE</div>
                      <div>status: ENUM (confirmed, checked_in...)</div>
                      <div>ratePerNight / totalAmount: NUMBER</div>
                      <div>keyCardCode: STRING</div>
                    </div>
                  </div>

                  {/* Entity 5: FOLIO_ITEMS */}
                  <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/80">
                    <div className="text-amber-300 font-bold border-b border-slate-800 pb-1">
                      FOLIO_ITEMS (Financial Ledger)
                    </div>
                    <div className="text-[11px] text-slate-400 space-y-0.5 mt-1">
                      <div><span className="text-emerald-400">PK</span> id: STRING</div>
                      <div><span className="text-sky-400">FK</span> reservationId ──&gt; RESERVATIONS.id</div>
                      <div>date / time: TIMESTAMP</div>
                      <div>category: ENUM (room, dining, spa, minibar...)</div>
                      <div>amount: NUMBER (+ Charge, - Payment)</div>
                      <div>reference: STRING</div>
                    </div>
                  </div>

                  {/* Entity 6: HOUSEKEEPING & MAINTENANCE */}
                  <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/80">
                    <div className="text-amber-300 font-bold border-b border-slate-800 pb-1">
                      TASKS & TICKETS (Operations)
                    </div>
                    <div className="text-[11px] text-slate-400 space-y-0.5 mt-1">
                      <div><span className="text-emerald-400">PK</span> id: STRING (HK-XXX / MNT-XXX)</div>
                      <div><span className="text-sky-400">FK</span> roomNumber ──&gt; ROOMS.number</div>
                      <div>priority: ENUM (low, medium, high, urgent)</div>
                      <div>status: ENUM (pending, in_progress, resolved)</div>
                      <div>assignedTo: STRING</div>
                      <div>checklist: JSON Array</div>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-2 text-[11px] text-slate-400">
                  Cardinalities: ROOM_TYPES (1) ───&lt; (N) ROOMS (1) ───&lt; (N) RESERVATIONS (1) ───&lt; (N) FOLIO_ITEMS
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MVC PATTERN DESIGN */}
          {activeTab === 'mvc' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-sky-400" />
                  <span>Model-View-Controller (MVC) Implementation</span>
                </h3>
                <p className="text-slate-400">
                  Separation of concerns is cleanly maintained across domain data schemas (Model), state transitions and business rules (Controller), and user-facing interactive components (View).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* MODEL */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <Database className="w-4 h-4" />
                    <span>M — Model</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Encapsulates the domain schemas, entity types, seed fixtures, and validation contracts.
                  </p>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-850 font-mono text-[10px] text-slate-300 space-y-1">
                    <div>· /src/types/hotel.ts</div>
                    <div>· /src/data/mockHotelData.ts</div>
                    <div>· /src/utils/currency.ts</div>
                    <div className="text-slate-500 pt-1">// Strict TypeScript interfaces for Room, Reservation, FolioItem, Guest, User</div>
                  </div>
                </div>

                {/* VIEW */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-sky-400 font-bold">
                    <Monitor className="w-4 h-4" />
                    <span>V — View</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Renders reactive user interfaces, listens for DOM events, and adheres to the frontend design constitution.
                  </p>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-850 font-mono text-[10px] text-slate-300 space-y-1">
                    <div>· DashboardView.tsx</div>
                    <div>· RoomMatrixView.tsx</div>
                    <div>· ReservationsView.tsx</div>
                    <div>· FrontDeskView.tsx</div>
                    <div>· FolioBillingView.tsx</div>
                    <div>· HousekeepingView.tsx</div>
                    <div>· GuestKioskView.tsx</div>
                  </div>
                </div>

                {/* CONTROLLER */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <Server className="w-4 h-4" />
                    <span>C — Controller</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Coordinates mutations, validates state transitions, enforces financial constraints, and syncs to storage.
                  </p>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-850 font-mono text-[10px] text-slate-300 space-y-1">
                    <div>· /src/context/HotelContext.tsx</div>
                    <div className="text-amber-400">· createReservation()</div>
                    <div className="text-amber-400">· checkInGuest()</div>
                    <div className="text-amber-400">· checkOutGuest()</div>
                    <div className="text-amber-400">· addFolioCharge()</div>
                    <div className="text-amber-400">· recordFolioPayment()</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ROLES & USER FLOWS */}
          {activeTab === 'roles_flows' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>Roles, Responsibilities & Operational User Flows</span>
                </h3>
                <p className="text-slate-400">
                  Granular role permissions align each department's access while sharing the same real-time operational database.
                </p>
              </div>

              {/* Roles Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    role: 'General Manager (Admin)',
                    desc: 'Full administrative rights across room tariffs, employee dispatch, financial ledgers, and property analytics.',
                    scope: 'All Modules'
                  },
                  {
                    role: 'Front Desk Agent (Reception)',
                    desc: 'Manages daily arrivals/departures, encodes RFID keycards, reassigns suites, and collects balances on departure.',
                    scope: 'Front Desk, Bookings, Folios'
                  },
                  {
                    role: 'Housekeeping Lead',
                    desc: 'Oversees turnover queues, executes step-by-step sanitation checklists, and marks rooms inspected for arrival.',
                    scope: 'Room Matrix, Turnovers'
                  },
                  {
                    role: 'Revenue Director',
                    desc: 'Monitors RevPAR, ADR, occupancy pace, and daily yield in INR (₹) to optimize pricing strategies.',
                    scope: 'Dashboard, Financial Reports'
                  },
                  {
                    role: 'In-Room Guest',
                    desc: 'Uses in-room tablet to unlock room door via NFC pass, orders room service dining, and requests amenities.',
                    scope: 'Guest Kiosk / Tablet'
                  }
                ].map(r => (
                  <div key={r.role} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="text-[10px] font-mono uppercase text-amber-400 font-bold">{r.scope}</div>
                    <h4 className="font-bold text-white text-xs">{r.role}</h4>
                    <p className="text-[11px] text-slate-400">{r.desc}</p>
                  </div>
                ))}
              </div>

              {/* Step-by-Step User Flow Swimlanes */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <h4 className="font-bold text-white text-xs uppercase font-mono tracking-wider text-amber-400">
                  Key Operational User Flow: Guest Lifecycle (Booking to Departure)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-mono text-[10px] text-amber-400 font-bold">1. Booking</span>
                    <h5 className="font-bold text-white text-xs">Reservation</h5>
                    <p className="text-[11px] text-slate-400">Select suite, calculate 18% GST, generate confirmation #HP-XXXXXX.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-mono text-[10px] text-teal-400 font-bold">2. Arrival</span>
                    <h5 className="font-bold text-white text-xs">Express Check-In</h5>
                    <p className="text-[11px] text-slate-400">Verify ID, encode RFID smart key, assign room, mark suite Occupied.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-mono text-[10px] text-sky-400 font-bold">3. Stay</span>
                    <h5 className="font-bold text-white text-xs">In-Room Dining</h5>
                    <p className="text-[11px] text-slate-400">Guest orders via tablet, charges post in real-time to active room folio.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-mono text-[10px] text-emerald-400 font-bold">4. Checkout</span>
                    <h5 className="font-bold text-white text-xs">Folio Settlement</h5>
                    <p className="text-[11px] text-slate-400">Audit folio ledger, settle balance with card/cash, print official GST invoice.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-mono text-[10px] text-rose-400 font-bold">5. Turnover</span>
                    <h5 className="font-bold text-white text-xs">Sanitary Clean</h5>
                    <p className="text-[11px] text-slate-400">Room marked Dirty, attendant executes checklist, marks suite Inspected.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
