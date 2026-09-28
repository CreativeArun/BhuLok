import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import FloorSelector from '../components/viewer/FloorSelector';
import UndergroundLayer from '../components/viewer/UndergroundLayer';
import LayerControls from '../components/viewer/LayerControls';

const Property3D: React.FC = () => {
  const [showUnderground, setShowUnderground] = useState(true);
  const [activeFloor, setActiveFloor] = useState(3);
  const [activeMode, setActiveMode] = useState('prop');
  const [showTechDetails, setShowTechDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('IN-DL-P001-B001-F003-U002');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col">
      <Navbar />

      <main className="w-full pt-20 bg-surface flex-1 flex flex-col">
        <div className="flex flex-col w-full flex-1">
          <div className="relative w-full min-h-[calc(100vh-5rem)] flex-1 flex flex-col bg-surface overflow-hidden">
            {/* Top Floating Status & Mode Bar */}
            <div className="z-20 w-full px-space-md lg:px-margin-md pt-space-md pb-space-sm flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
              {/* Title & Live Status */}
              <div className="flex items-center flex-wrap gap-space-sm">
                <div className="flex items-center gap-space-xs bg-surface-container-lowest px-space-md py-2.5 rounded-full shadow-md border border-surface-container-high/50">
                  <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    apartment
                  </span>
                  <span className="font-headline-md text-title-sm text-on-surface tracking-tight font-bold">Green Valley Heights</span>
                  <span className="text-on-surface-variant font-body-md text-label-sm">• Sector 62, Delhi NCR</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-tertiary-container/15 text-tertiary font-label-sm text-label-sm shadow-sm font-semibold">
                  <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                  <span>✓ 3D Model Ready</span>
                </div>
              </div>
              {/* Mode Selector Capsules */}
              <div className="flex items-center gap-1.5 p-1 bg-surface-container-lowest/90 backdrop-blur-md rounded-full shadow-md self-start lg:self-auto border border-surface-container-high/50">
                <button
                  className={`px-4 py-2 rounded-full font-label-md text-label-md flex items-center gap-1.5 transition-all duration-200 ${
                    activeMode === 'prop' ? 'bg-primary text-on-primary shadow-sm font-semibold' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                  onClick={() => setActiveMode('prop')}
                >
                  <span className="material-symbols-outlined text-[18px]">home</span>
                  <span>Property Mode</span>
                </button>
                <button
                  className={`px-4 py-2 rounded-full font-label-md text-label-md flex items-center gap-1.5 transition-all duration-200 ${
                    activeMode === 'floors' ? 'bg-primary text-on-primary shadow-sm font-semibold' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                  onClick={() => setActiveMode('floors')}
                >
                  <span className="material-symbols-outlined text-[18px]">layers</span>
                  <span>Floors Mode</span>
                </button>
                <button
                  className={`px-4 py-2 rounded-full font-label-md text-label-md flex items-center gap-1.5 transition-all duration-200 ${
                    activeMode === 'underground' ? 'bg-primary text-on-primary shadow-sm font-semibold' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                  onClick={() => setActiveMode('underground')}
                >
                  <span className="material-symbols-outlined text-[18px]">subway</span>
                  <span>Underground Mode</span>
                </button>
              </div>
            </div>

            {/* Main Spatial Interactive Viewport */}
            <div className="relative flex-1 w-full min-h-[720px] lg:min-h-0 flex overflow-hidden">
              {/* 3D Spatial Interactive Canvas */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-surface via-surface-container-low to-surface-container select-none overflow-hidden cursor-grab active:cursor-grabbing">
                {/* Ambient Atmospheric Grid */}
                <svg className="absolute inset-0 w-full h-full opacity-35 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern height="34.64" id="iso-grid" patternTransform="scale(1.2)" patternUnits="userSpaceOnUse" width="60">
                      <path d="M 60 0 L 0 17.32 L 60 34.64 Z M 0 17.32 L 60 17.32" fill="none" stroke="#2563eb" strokeOpacity="0.12" strokeWidth="0.8"></path>
                    </pattern>
                  </defs>
                  <rect fill="url(#iso-grid)" height="100%" width="100%"></rect>
                </svg>

                {/* Center Isometric 3D World (Vector Digital Cadastre) */}
                <div className="absolute inset-0 flex items-center justify-center -translate-y-6 lg:translate-x-[-140px] pointer-events-none">
                  <div className="relative w-[680px] h-[580px] pointer-events-auto">
                    <svg className="w-full h-full overflow-visible drop-shadow-2xl" viewBox="0 0 700 620">
                      <defs>
                        <linearGradient id="groundGrad" x1="0" x2="1" y1="0" y2="1">
                          <stop offset="0%" stopColor="#4edea3" stopOpacity="0.35"></stop>
                          <stop offset="100%" stopColor="#2563eb" stopOpacity="0.15"></stop>
                        </linearGradient>
                        <linearGradient id="parcelBase" x1="0%" x2="100%" y1="0%" y2="100%">
                          <stop offset="0%" stopColor="#eaedff"></stop>
                          <stop offset="100%" stopColor="#d8e2ff"></stop>
                        </linearGradient>
                        <linearGradient id="wallLeft" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#ffffff"></stop>
                          <stop offset="100%" stopColor="#e2e7ff"></stop>
                        </linearGradient>
                        <linearGradient id="wallRight" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#dbe1ff"></stop>
                          <stop offset="100%" stopColor="#b4c5ff"></stop>
                        </linearGradient>
                        <linearGradient id="activeUnitTop" x1="0%" x2="100%" y1="0%" y2="100%">
                          <stop offset="0%" stopColor="#60a5fa"></stop>
                          <stop offset="100%" stopColor="#2563eb"></stop>
                        </linearGradient>
                        <linearGradient id="activeUnitSide" x1="0%" x2="0%" y1="0%" y2="100%">
                          <stop offset="0%" stopColor="#1d4ed8"></stop>
                          <stop offset="100%" stopColor="#003ea8"></stop>
                        </linearGradient>
                        <filter height="140%" id="softGlow" width="140%" x="-20%" y="-20%">
                          <feGaussianBlur result="blur" stdDeviation="8"></feGaussianBlur>
                          <feComposite in="SourceGraphic" in2="blur" operator="over"></feComposite>
                        </filter>
                      </defs>

                      {/* Underground Subterranean Infrastructure Layer */}
                      <g className="transition-opacity duration-500" style={{ opacity: showUnderground ? 1 : 0.05 }} id="underground-layer">
                        <polygon fill="#283044" fillOpacity="0.22" points="350,560 560,440 560,500 350,620 140,500 140,440"></polygon>
                        <path className="drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]" d="M 210,480 Q 320,530 490,470" fill="none" stroke="#38bdf8" strokeDasharray="8 4" strokeWidth="4.5"></path>
                        <circle cx="210" cy="480" fill="#38bdf8" r="5"></circle>
                        <circle cx="490" cy="470" fill="#38bdf8" r="5"></circle>
                        <text fill="#0284c7" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="600" textAnchor="middle" x="350" y="525">Potable Water Main • -3.8m</text>
                        <path className="drop-shadow-[0_0_6px_rgba(245,158,11,0.7)]" d="M 160,455 Q 350,470 540,430" fill="none" stroke="#f59e0b" strokeDasharray="6 3" strokeWidth="3"></path>
                        <text fill="#b45309" fontFamily="Plus Jakarta Sans" fontSize="10" fontWeight="600" x="440" y="440">Power Feed • -2.1m</text>
                      </g>

                      {/* Cadastral Surface Parcel Lot */}
                      <g id="cadastral-lot">
                        <polygon fill="url(#parcelBase)" points="350,330 630,470 350,610 70,470" stroke="#c3c6d7" strokeWidth="2"></polygon>
                        <polygon fill="url(#groundGrad)" points="350,350 590,470 350,590 110,470"></polygon>
                        <polygon className="animate-pulse" fill="none" points="350,345 615,470 350,595 85,470" stroke="#10b981" strokeDasharray="10 5" strokeWidth="2"></polygon>
                        <polygon fill="#94a3b8" fillOpacity="0.35" points="70,470 350,610 330,620 50,480"></polygon>
                        <g transform="translate(110, 465)">
                          <circle cx="0" cy="0" fill="#006242" r="4"></circle>
                          <circle cx="0" cy="0" fill="#4edea3" fillOpacity="0.4" r="8"></circle>
                        </g>
                        <g transform="translate(590, 465)">
                          <circle cx="0" cy="0" fill="#006242" r="4"></circle>
                          <circle cx="0" cy="0" fill="#4edea3" fillOpacity="0.4" r="8"></circle>
                        </g>
                      </g>

                      {/* FLOOR 1 */}
                      <g className="floor-group cursor-pointer transition-transform duration-300 hover:-translate-y-1" onClick={() => setActiveFloor(1)}>
                        <polygon fill="url(#wallLeft)" points="230,370 350,430 350,380 230,320" stroke="#cbd5e1" strokeWidth="1"></polygon>
                        <polygon fill="url(#wallRight)" points="350,430 470,370 470,320 350,380" stroke="#cbd5e1" strokeWidth="1"></polygon>
                        <polygon fill="#ffffff" points="350,380 470,320 350,260 230,320" stroke="#cbd5e1" strokeWidth="1"></polygon>
                        <polygon fill="#2563eb" fillOpacity="0.35" points="320,415 350,430 350,395 320,380"></polygon>
                        <line stroke="#0284c7" strokeLinecap="round" strokeWidth="3" x1="260" x2="300" y1="345" y2="365"></line>
                        <line stroke="#0284c7" strokeLinecap="round" strokeWidth="3" x1="400" x2="440" y1="365" y2="345"></line>
                        <text fill="#434655" fontFamily="Plus Jakarta Sans" fontSize="10" fontWeight="700" textAnchor="middle" x="350" y="415">LEVEL 01</text>
                      </g>

                      {/* FLOOR 2 */}
                      <g className="floor-group cursor-pointer transition-transform duration-300 hover:-translate-y-1" onClick={() => setActiveFloor(2)}>
                        <polygon fill="url(#wallLeft)" points="230,315 350,375 350,325 230,265" stroke="#cbd5e1" strokeWidth="1"></polygon>
                        <polygon fill="url(#wallRight)" points="350,375 470,315 470,265 350,325" stroke="#cbd5e1" strokeWidth="1"></polygon>
                        <polygon fill="#ffffff" points="350,325 470,265 350,205 230,265" stroke="#cbd5e1" strokeWidth="1"></polygon>
                        <line stroke="#38bdf8" strokeLinecap="round" strokeWidth="3" x1="260" x2="320" y1="290" y2="320"></line>
                        <line stroke="#38bdf8" strokeLinecap="round" strokeWidth="3" x1="380" x2="440" y1="320" y2="290"></line>
                        <text fill="#434655" fontFamily="Plus Jakarta Sans" fontSize="10" fontWeight="700" textAnchor="middle" x="350" y="360">LEVEL 02</text>
                      </g>

                      {/* FLOOR 3 */}
                      <g className="floor-group cursor-pointer transition-transform duration-300 hover:-translate-y-1" onClick={() => setActiveFloor(3)}>
                        <polygon fill="#f8fafc" points="350,270 470,210 350,150 230,210" stroke="#93c5fd" strokeWidth="1.5"></polygon>
                        <polygon fill="#e2e8f0" fillOpacity="0.8" points="230,260 290,290 290,240 230,210"></polygon>
                        <polygon fill="#cbd5e1" fillOpacity="0.8" points="290,290 350,260 350,210 290,240"></polygon>
                        <polygon fill="#2563eb" fillOpacity="0.2" filter="url(#softGlow)" points="350,320 475,257 475,195 350,255"></polygon>
                        <polygon fill="url(#activeUnitSide)" points="290,290 350,320 350,260 290,230" stroke="#60a5fa" strokeWidth="1.5"></polygon>
                        <polygon fill="url(#activeUnitSide)" points="350,320 470,260 470,200 350,260" stroke="#60a5fa" strokeWidth="1.5"></polygon>
                        <polygon fill="url(#activeUnitTop)" points="350,260 470,200 410,170 290,230" stroke="#93c5fd" strokeWidth="1.5"></polygon>
                        <line stroke="#67e8f9" strokeLinecap="round" strokeWidth="2.5" x1="350" x2="470" y1="320" y2="260"></line>
                        <line stroke="#67e8f9" strokeLinecap="round" strokeWidth="2.5" x1="350" x2="350" y1="260" y2="320"></line>
                        <line stroke="#67e8f9" strokeLinecap="round" strokeWidth="2.5" x1="350" x2="470" y1="260" y2="200"></line>
                        <circle cx="350" cy="320" fill="#ffffff" r="4.5" stroke="#2563eb" strokeWidth="2"></circle>
                        <circle cx="470" cy="260" fill="#ffffff" r="4.5" stroke="#2563eb" strokeWidth="2"></circle>
                        <circle cx="350" cy="260" fill="#ffffff" r="4.5" stroke="#2563eb" strokeWidth="2"></circle>
                        <text fill="#ffffff" fontFamily="Plus Jakarta Sans" fontSize="12" fontWeight="800" textAnchor="middle" x="410" y="245">UNIT 02</text>
                      </g>

                      {/* FLOOR 4 */}
                      <g className="floor-group cursor-pointer transition-transform duration-300 hover:-translate-y-1" onClick={() => setActiveFloor(4)}>
                        <polygon fill="url(#wallLeft)" points="230,205 350,265 350,215 230,155" stroke="#cbd5e1" strokeWidth="1"></polygon>
                        <polygon fill="url(#wallRight)" points="350,265 470,205 470,155 350,215" stroke="#cbd5e1" strokeWidth="1"></polygon>
                        <polygon fill="#f1f5f9" points="350,215 470,155 350,95 230,155" stroke="#cbd5e1" strokeWidth="1.5"></polygon>
                        <polygon fill="#0284c7" fillOpacity="0.4" points="320,165 380,195 380,185 320,155"></polygon>
                        <text fill="#434655" fontFamily="Plus Jakarta Sans" fontSize="10" fontWeight="700" textAnchor="middle" x="350" y="250">LEVEL 04 (ROOF)</text>
                      </g>

                      <g id="spatial-dimensions" opacity="0.6" stroke="#2563eb" strokeDasharray="3 3" strokeWidth="1">
                        <line x1="495" x2="495" y1="200" y2="260"></line>
                        <line x1="490" x2="500" y1="200" y2="200"></line>
                        <line x1="490" x2="500" y1="260" y2="260"></line>
                        <text fill="#2563eb" fontFamily="JetBrains Mono" fontSize="10" fontWeight="700" x="510" y="235">Δh: 3.0m</text>
                      </g>
                    </svg>

                    {/* Friendly Floating Tooltip Pin for Selected Unit */}
                    {activeFloor === 3 && (
                      <div className="absolute top-[170px] left-[380px] -translate-x-1/2 -translate-y-full flex flex-col items-center pointer-events-auto transition-transform duration-300 hover:scale-105">
                        <div className="bg-surface-container-lowest/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border-2 border-primary/20 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span>
                          <div className="flex flex-col text-left">
                            <div className="flex items-center gap-1.5">
                              <span className="font-headline-md text-label-md text-on-surface font-bold">Unit 2 (Selected)</span>
                              <span className="px-1.5 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-code-sm text-[10px] font-bold">L3</span>
                            </div>
                            <span className="font-body-md text-label-sm text-primary font-semibold">82.4 m² • Verified Boundary</span>
                          </div>
                        </div>
                        <div className="w-3 h-3 bg-surface-container-lowest rotate-45 -mt-1.5 shadow-md"></div>
                        <div className="w-1.5 h-6 bg-primary/40 rounded-full mt-0.5"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Left Floating Vertical Layer / Floor Selector */}
                <FloorSelector activeFloor={activeFloor} setActiveFloor={setActiveFloor} />

                {/* Bottom Left: Subterranean Infrastructure Toggle Card */}
                <UndergroundLayer showUnderground={showUnderground} setShowUnderground={setShowUnderground} />

                {/* Bottom Center Floating Minimal Map Controls */}
                <LayerControls />
              </div>

              {/* Right Floating Panel: "Property Details" */}
              <div className="relative z-20 w-full lg:w-[440px] xl:w-[480px] p-space-md lg:p-space-lg lg:ml-auto h-auto max-h-[calc(100vh-6rem)] overflow-y-auto flex flex-col pointer-events-auto text-left">
                <div className="bg-surface-container-lowest rounded-3xl shadow-2xl p-space-lg flex flex-col gap-space-md border border-surface-container-high/50">
                  {/* Panel Header */}
                  <div className="flex items-start justify-between gap-space-sm pb-space-xs border-b border-surface-container">
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Selected Parcel Unit</span>
                      <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-0.5 font-bold">Property Details</h2>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm shadow-sm font-semibold">
                      <span className="material-symbols-outlined text-[16px] text-tertiary">verified</span>
                      <span>Verified 3D Unit</span>
                    </div>
                  </div>

                  {/* ULPIN / 3D Property ID Capsule with Copy Action */}
                  <div className="p-space-md rounded-2xl bg-surface-container-low flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">Unified 3D Property Identifier (ULPIN-3D)</span>
                      <span className={`font-label-sm text-[11px] text-primary transition-opacity font-bold ${copied ? 'opacity-100' : 'opacity-0'}`}>Copied!</span>
                    </div>
                    <div className="flex items-center justify-between gap-space-sm bg-surface-container-lowest px-space-md py-2.5 rounded-xl shadow-sm border border-surface-container-high/50">
                      <code className="font-code-sm text-code-sm text-primary font-bold tracking-tight truncate">
                        IN-DL-P001-B001-F003-U002
                      </code>
                      <button
                        onClick={handleCopy}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors flex items-center justify-center"
                        title="Copy 3D Property ID"
                      >
                        <span className="material-symbols-outlined text-[18px]">content_copy</span>
                      </button>
                    </div>
                  </div>

                  {/* Visual Spatial Hierarchy Breadcrumb Trail */}
                  <div className="flex items-center gap-1.5 py-1 px-1 overflow-x-auto text-on-surface-variant">
                    <div className="flex items-center gap-1 text-on-surface-variant text-label-sm font-label-sm font-medium">
                      <span className="material-symbols-outlined text-[15px]">terrain</span>
                      <span>Plot #402</span>
                    </div>
                    <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
                    <div className="flex items-center gap-1 text-on-surface-variant text-label-sm font-label-sm font-medium">
                      <span className="material-symbols-outlined text-[15px]">domain</span>
                      <span>Tower A</span>
                    </div>
                    <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
                    <div className="flex items-center gap-1 text-on-surface-variant text-label-sm font-label-sm font-medium">
                      <span className="material-symbols-outlined text-[15px]">stacks</span>
                      <span>Floor 3</span>
                    </div>
                    <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
                    <div className="flex items-center gap-1 text-primary font-title-sm font-semibold bg-primary-fixed/50 px-2.5 py-0.5 rounded-full">
                      <span className="material-symbols-outlined text-[15px]">door_front</span>
                      <span>Unit 02</span>
                    </div>
                  </div>

                  {/* Key Quantitative Cadastral Metrics Grid */}
                  <div className="grid grid-cols-2 gap-space-sm">
                    <div className="bg-surface-container-low p-space-md rounded-2xl flex flex-col justify-between">
                      <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm font-semibold">
                        <span className="material-symbols-outlined text-[16px] text-primary">square_foot</span>
                        <span>Floor Area</span>
                      </div>
                      <div className="mt-2">
                        <span className="font-headline-md text-headline-md text-on-surface font-bold">82.4 m²</span>
                        <span className="font-body-md text-label-sm text-on-surface-variant block mt-0.5">(886.9 sq ft)</span>
                      </div>
                    </div>
                    <div className="bg-surface-container-low p-space-md rounded-2xl flex flex-col justify-between">
                      <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm font-semibold">
                        <span className="material-symbols-outlined text-[16px] text-secondary">height</span>
                        <span>Clear Ceiling</span>
                      </div>
                      <div className="mt-2">
                        <span className="font-headline-md text-headline-md text-on-surface font-bold">3.00 m</span>
                        <span className="font-body-md text-label-sm text-on-surface-variant block mt-0.5">Vertical Extent</span>
                      </div>
                    </div>
                    <div className="bg-surface-container-low p-space-md rounded-2xl flex flex-col justify-between">
                      <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm font-semibold">
                        <span className="material-symbols-outlined text-[16px] text-tertiary">view_in_ar</span>
                        <span>3D Spatial Volume</span>
                      </div>
                      <div className="mt-2">
                        <span className="font-headline-md text-headline-md text-on-surface font-bold text-primary">247.2 m³</span>
                        <span className="font-body-md text-label-sm text-on-surface-variant block mt-0.5">Airspace Cuboid</span>
                      </div>
                    </div>
                    <div className="bg-surface-container-low p-space-md rounded-2xl flex flex-col justify-between">
                      <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm font-semibold">
                        <span className="material-symbols-outlined text-[16px] text-primary">holiday_village</span>
                        <span>Cadastral Use</span>
                      </div>
                      <div className="mt-2">
                        <span className="font-headline-md text-title-sm text-on-surface leading-tight font-bold">Residential</span>
                        <span className="font-body-md text-label-sm text-on-surface-variant block mt-0.5">2-Bedroom Flat</span>
                      </div>
                    </div>
                  </div>

                  {/* Friendly Property Verification Checklist */}
                  <div className="bg-surface-container-low/70 p-space-md rounded-2xl flex flex-col gap-space-xs">
                    <span className="font-label-md text-label-md text-on-surface flex items-center gap-1.5 font-semibold">
                      <span className="material-symbols-outlined text-[18px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
                      <span>Cadastral Integrity Check</span>
                    </span>
                    <div className="mt-1 space-y-1.5">
                      <div className="flex items-center gap-2 font-body-md text-label-md text-on-surface">
                        <span className="material-symbols-outlined text-tertiary text-[18px]">check_circle</span>
                        <span>Property geometry verified &amp; closed</span>
                      </div>
                      <div className="flex items-center gap-2 font-body-md text-label-md text-on-surface">
                        <span className="material-symbols-outlined text-tertiary text-[18px]">check_circle</span>
                        <span>Inside building envelope bounds</span>
                      </div>
                      <div className="flex items-center gap-2 font-body-md text-label-md text-on-surface">
                        <span className="material-symbols-outlined text-tertiary text-[18px]">check_circle</span>
                        <span>Accurate floor level assignment (+9.0m)</span>
                      </div>
                      <div className="flex items-center gap-2 font-body-md text-label-md text-on-surface">
                        <span className="material-symbols-outlined text-tertiary text-[18px]">check_circle</span>
                        <span>No spatial overlap with adjoining units</span>
                      </div>
                    </div>
                  </div>

                  {/* Collapsible Surveyor Technical Details */}
                  <div className="w-full">
                    <button
                      onClick={() => setShowTechDetails(!showTechDetails)}
                      className="w-full flex items-center justify-between text-left font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors py-1"
                    >
                      <span className="flex items-center gap-1 font-medium">
                        <span className="material-symbols-outlined text-[16px]">tune</span>
                        <span>Technical details (for surveyors)</span>
                      </span>
                      <span className="material-symbols-outlined text-[16px] transition-transform duration-200" style={{ transform: showTechDetails ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        expand_more
                      </span>
                    </button>
                    {showTechDetails && (
                      <div className="mt-2 p-space-sm bg-surface-container rounded-xl font-code-sm text-[11px] text-on-surface-variant space-y-1">
                        <div className="flex justify-between">
                          <span>CRS / Datum:</span>
                          <span className="text-on-surface font-semibold">EPSG:7760 (India WGS84)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Z-Ref Plane:</span>
                          <span className="text-on-surface font-semibold">Mean Sea Level (MSL +214.2m)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Poly Vertices:</span>
                          <span className="text-on-surface font-semibold">6 Coplanar Nodes</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Hash:</span>
                          <span className="text-on-surface truncate max-w-[140px] font-semibold">0x9a8f...4e12c</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-space-sm pt-space-xs">
                    <button className="flex-1 py-3.5 px-space-md bg-primary hover:bg-secondary text-on-primary font-label-md text-label-md rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 font-semibold">
                      <span className="material-symbols-outlined text-[20px]">verified_user</span>
                      <span>Download 3D Certificate</span>
                    </button>
                    <button className="py-3.5 px-space-md bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-95 font-medium">
                      <span className="material-symbols-outlined text-[20px]">share</span>
                      <span className="hidden sm:inline">Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Property3D;
