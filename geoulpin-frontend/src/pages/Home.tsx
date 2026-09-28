import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Home: React.FC = () => {
  const [heroImgErr, setHeroImgErr] = useState(false);
  const [compareImgErr, setCompareImgErr] = useState(false);

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col">
      <Navbar />

      <main className="w-full pt-20 bg-surface flex-1">
        <div className="flex flex-col w-full">
          {/* Interactive Ambient Background Glows */}
          <div className="relative w-full overflow-hidden">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[380px] bg-gradient-to-tr from-primary-fixed/40 via-surface-container-high/30 to-tertiary-fixed/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
            <div className="absolute top-96 right-10 w-96 h-96 bg-secondary-fixed/30 rounded-full blur-3xl pointer-events-none -z-10"></div>

            {/* HERO SECTION */}
            <section className="w-full px-space-lg lg:px-margin-md max-w-7xl mx-auto pt-space-lg lg:pt-space-xl pb-space-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg lg:gap-space-xl items-center">
                {/* Left Column: Friendly Narrative & CTA */}
                <div className="lg:col-span-7 flex flex-col items-start gap-space-md text-left">
                  {/* Monospaced micro-badge */}
                  <div className="inline-flex items-center gap-space-xs px-space-md py-1.5 rounded-full bg-surface-container-high text-primary shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    <span className="font-code-sm text-code-sm font-semibold tracking-tight uppercase">
                      Next-Gen Spatial Parceling
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                      | V2.4 Released
                    </span>
                  </div>
                  {/* Main Friendly Heading */}
                  <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight max-w-2xl font-extrabold leading-tight">
                    Create a 3D Digital Property
                  </h1>
                  {/* Descriptive Subtitle */}
                  <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
                    Upload your property information and generate an interactive 3D spatial map with an official Unique Land Parcel Identification Number (ULPIN). No GIS degree required.
                  </p>
                  {/* Primary & Secondary Actions */}
                  <div className="flex flex-wrap items-center gap-space-md pt-space-xs w-full sm:w-auto">
                    <Link
                      to="/create-project"
                      className="inline-flex items-center justify-center gap-space-sm px-space-lg py-3.5 rounded-xl bg-primary-container text-on-primary font-title-sm text-title-sm font-semibold hover:bg-primary transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <span className="material-symbols-outlined text-[20px]">add_location_alt</span>
                      <span>+ Create New Project</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </Link>
                    <Link
                      to="/property-report"
                      className="inline-flex items-center justify-center gap-space-xs px-space-lg py-3.5 rounded-xl bg-surface-container-lowest text-on-surface font-title-sm text-title-sm font-semibold hover:bg-surface-container-low transition-all duration-200 shadow-sm hover:shadow"
                    >
                      <span className="material-symbols-outlined text-[20px] text-on-surface-variant">folder_open</span>
                      <span>View My Projects</span>
                    </Link>
                  </div>
                  {/* Trust Badges / Social Proof Counters */}
                  <div className="grid grid-cols-3 gap-space-md pt-space-md w-full max-w-lg border-t border-surface-container-high/60 mt-space-sm">
                    <div className="flex flex-col">
                      <span className="font-headline-lg text-headline-lg text-on-surface font-bold">2 Mins</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Setup time</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-headline-lg text-headline-lg text-on-surface font-bold">100%</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">ISO Cadastral 19152</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-headline-lg text-headline-lg text-on-surface font-bold">Sub-Centimeter</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Volume accuracy</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Bespoke 3D Spatial Isometric Card */}
                <div className="lg:col-span-5 relative flex justify-center w-full">
                  {/* Glassmorphic Cadastral Floating Canvas Card */}
                  <div className="relative w-full max-w-[430px] rounded-2xl bg-surface-container-lowest p-space-md shadow-[0_16px_40px_-8px_rgba(15,23,42,0.08)] overflow-hidden border border-surface-container-high/50">
                    {/* Card Header */}
                    <div className="flex items-center justify-between pb-space-sm">
                      <div className="flex items-center gap-space-xs">
                        <span className="material-symbols-outlined text-primary text-[20px]">layers</span>
                        <span className="font-label-md text-label-md text-on-surface font-semibold">Live 3D Cadastre Mesh</span>
                      </div>
                      <span className="px-space-xs py-0.5 rounded-full bg-tertiary-container/10 text-tertiary font-code-sm text-code-sm font-semibold">
                        REGISTERED MESH
                      </span>
                    </div>
                    {/* Isometric Scene Illustration Canvas */}
                    <div className="relative w-full h-[320px] rounded-xl bg-surface-container-low overflow-hidden flex items-center justify-center">
                      {!heroImgErr ? (
                        <img
                          className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                          alt="Futuristic isometric 3D architectural rendering"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlDFYnquS5wDGXWwTRv_n5yJsB_nQcEtkfTpH6cYXOj2sbGWJd5CaDfBgKVV9p0eY3u48KmU_fdhwsRXmRnONXH_DtL2auivWZeoUhAWTTaJYNVHe0g2lAc8VkLu3DpbEYlNoIm6M-Fmr7wgJs3LzKX5Hln4prhnp1rVr4xb6_Gw-YKkNatgL8Z_npRBUUlJRsoeMLmQ0ojdSr73_RxvAlvqEiszYydwJLHLSgy8onnmIcMXIGbd8Z"
                          onError={() => setHeroImgErr(true)}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-fixed via-surface-container to-secondary-fixed flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-[64px]">view_in_ar</span>
                        </div>
                      )}
                      {/* Overlay Gradient for contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/60 via-transparent to-transparent pointer-events-none"></div>
                      {/* Floating Interactive Chip 1: Unit Identification */}
                      <div
                        className="absolute top-6 left-5 px-space-sm py-1.5 rounded-xl bg-surface-container-lowest/95 backdrop-blur-md shadow-md flex items-center gap-space-xs animate-bounce"
                        style={{ animationDuration: '3s' }}
                      >
                        <div className="w-2.5 h-2.5 rounded-full bg-tertiary-container"></div>
                        <div className="flex flex-col text-left">
                          <span className="font-label-sm text-label-sm text-on-surface font-bold leading-tight">Unit 2 • Floor 3</span>
                          <span className="font-code-sm text-[10px] text-on-surface-variant leading-none">Vol: 242.4 m³</span>
                        </div>
                      </div>
                      {/* Floating Interactive Chip 2: Unique Land Parcel Identity */}
                      <div className="absolute bottom-6 right-5 px-space-sm py-2 rounded-xl bg-surface-container-lowest/95 backdrop-blur-md shadow-lg flex items-center gap-space-sm">
                        <div className="p-1.5 rounded-lg bg-primary-fixed flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="font-label-sm text-label-sm text-on-surface font-bold leading-tight">3D ID: IN-UP-P00194</span>
                          <span className="font-code-sm text-[10px] text-tertiary font-semibold leading-none">ULPIN Certified • Tier A</span>
                        </div>
                      </div>
                      {/* Spatial Coordinate Compass Overlay */}
                      <div className="absolute bottom-6 left-5 p-2 rounded-full bg-surface-container-lowest/80 backdrop-blur-md shadow-sm">
                        <span className="material-symbols-outlined text-on-surface-variant text-[18px] rotate-45">navigation</span>
                      </div>
                    </div>
                    {/* Card Bottom Metrics Footprint */}
                    <div className="pt-space-md grid grid-cols-2 gap-space-sm">
                      <div className="flex flex-col p-2.5 rounded-xl bg-surface-container-low text-left">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Parcel Footprint</span>
                        <span className="font-code-sm text-code-sm text-on-surface font-bold">1,840.50 SQ.M</span>
                      </div>
                      <div className="flex flex-col p-2.5 rounded-xl bg-surface-container-low text-left">
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Vertical Extent</span>
                        <span className="font-code-sm text-code-sm text-on-surface font-bold">+42.0m / -8.5m</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION: HOW IT WORKS IN 4 STEPS */}
            <section className="w-full bg-surface-container-lowest py-space-xl border-y border-surface-container-high/40">
              <div className="w-full px-space-lg lg:px-margin-md max-w-7xl mx-auto flex flex-col gap-space-xl">
                {/* Header Text */}
                <div className="flex flex-col items-center text-center gap-space-xs max-w-2xl mx-auto">
                  <div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-secondary-fixed/50 text-secondary">
                    <span className="font-label-sm text-label-sm font-semibold tracking-wide uppercase">Effortless Workflow</span>
                  </div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                    How it works in 4 simple steps
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Transform paper titles and flat 2D blueprints into an authenticated, verifiable 3D spatial twin in minutes.
                  </p>
                </div>
                {/* 4 Step Cards Mosaic Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
                  {/* STEP 1: UPLOAD */}
                  <div className="group flex flex-col justify-between p-space-lg rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-md hover:-translate-y-1 text-left">
                    <div className="flex flex-col gap-space-md">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-xs">
                          <span className="material-symbols-outlined text-[26px]">cloud_upload</span>
                        </div>
                        <span className="font-code-sm text-headline-md font-bold text-outline-variant group-hover:text-primary transition-colors">01</span>
                      </div>
                      <div className="flex flex-col gap-space-xs">
                        <h3 className="font-title-sm text-title-sm text-on-surface font-bold">1. Upload Details</h3>
                        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                          Upload photos, floor plans, deed coordinates, or standard geo-referenced images of the property.
                        </p>
                      </div>
                    </div>
                    <div className="pt-space-md flex items-center gap-space-xs text-primary font-label-md text-label-md font-semibold">
                      <span>Automatic OCR Scan</span>
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    </div>
                  </div>
                  {/* STEP 2: BUILD 3D */}
                  <div className="group flex flex-col justify-between p-space-lg rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-md hover:-translate-y-1 text-left">
                    <div className="flex flex-col gap-space-md">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary group-hover:scale-110 transition-transform shadow-xs">
                          <span className="material-symbols-outlined text-[26px]">view_in_ar</span>
                        </div>
                        <span className="font-code-sm text-headline-md font-bold text-outline-variant group-hover:text-secondary transition-colors">02</span>
                      </div>
                      <div className="flex flex-col gap-space-xs">
                        <h3 className="font-title-sm text-title-sm text-on-surface font-bold">2. Build 3D</h3>
                        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                          Our system creates a mathematically sound, 3D volumetric representation of your land parcel boundaries.
                        </p>
                      </div>
                    </div>
                    <div className="pt-space-md flex items-center gap-space-xs text-secondary font-label-md text-label-md font-semibold">
                      <span>Smart Mesh Generation</span>
                      <span className="material-symbols-outlined text-[16px]">auto_fix_high</span>
                    </div>
                  </div>
                  {/* STEP 3: IDENTIFY */}
                  <div className="group flex flex-col justify-between p-space-lg rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-md hover:-translate-y-1 text-left">
                    <div className="flex flex-col gap-space-md">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary-container group-hover:scale-110 transition-transform shadow-xs">
                          <span className="material-symbols-outlined text-[26px]">pin_drop</span>
                        </div>
                        <span className="font-code-sm text-headline-md font-bold text-outline-variant group-hover:text-tertiary-container transition-colors">03</span>
                      </div>
                      <div className="flex flex-col gap-space-xs">
                        <h3 className="font-title-sm text-title-sm text-on-surface font-bold">3. Identify &amp; Tag</h3>
                        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                          Assign unique floor layers, units, and register an official 14-character 3D ULPIN registry key.
                        </p>
                      </div>
                    </div>
                    <div className="pt-space-md flex items-center gap-space-xs text-tertiary font-label-md text-label-md font-semibold">
                      <span>ULPIN Standard Hash</span>
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                    </div>
                  </div>
                  {/* STEP 4: EXPLORE */}
                  <div className="group flex flex-col justify-between p-space-lg rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-md hover:-translate-y-1 text-left">
                    <div className="flex flex-col gap-space-md">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-xl bg-primary-fixed-dim flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-xs">
                          <span className="material-symbols-outlined text-[26px]">360</span>
                        </div>
                        <span className="font-code-sm text-headline-md font-bold text-outline-variant group-hover:text-primary transition-colors">04</span>
                      </div>
                      <div className="flex flex-col gap-space-xs">
                        <h3 className="font-title-sm text-title-sm text-on-surface font-bold">4. Explore &amp; Share</h3>
                        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                          Inspect your property in high-fidelity 3D, rotate volumetric parcels, and share authenticated links.
                        </p>
                      </div>
                    </div>
                    <div className="pt-space-md flex items-center gap-space-xs text-primary font-label-md text-label-md font-semibold">
                      <span>Interactive Viewer</span>
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION: VISUAL SPOTLIGHT / COMPARISON */}
            <section className="w-full px-space-lg lg:px-margin-md max-w-7xl mx-auto py-space-xl">
              <div className="rounded-3xl bg-surface-container p-space-lg lg:p-space-xl shadow-sm flex flex-col lg:flex-row items-center gap-space-xl">
                <div className="flex-1 flex flex-col gap-space-md text-left">
                  <span className="font-code-sm text-code-sm uppercase tracking-wider text-secondary font-bold">From Flat to Spatial</span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                    Why traditional 2D land deeds fall short for vertical spaces
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Modern high-rises and multi-owner towers stack units directly on top of each other. BhuLok introduces depth and elevation parameters (Z-axis) to prevent disputes and clarify title rights.
                  </p>
                  <div className="flex flex-col gap-space-sm pt-space-xs">
                    <div className="flex items-start gap-space-sm">
                      <div className="p-1 rounded-full bg-primary text-on-primary mt-0.5">
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      </div>
                      <span className="font-body-md text-body-md text-on-surface">Subterranean parking and basement rights clearly partitioned.</span>
                    </div>
                    <div className="flex items-start gap-space-sm">
                      <div className="p-1 rounded-full bg-primary text-on-primary mt-0.5">
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      </div>
                      <span className="font-body-md text-body-md text-on-surface">Air rights and solar access envelopes preserved in 3D geometry.</span>
                    </div>
                    <div className="flex items-start gap-space-sm">
                      <div className="p-1 rounded-full bg-primary text-on-primary mt-0.5">
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      </div>
                      <span className="font-body-md text-body-md text-on-surface">One-click export to land administration databases and municipality registries.</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 w-full flex justify-center">
                  <div className="relative w-full max-w-md h-72 rounded-2xl overflow-hidden shadow-lg bg-surface-container-lowest border border-surface-container-high/60">
                    {!compareImgErr ? (
                      <img
                        className="w-full h-full object-cover"
                        alt="A clean modern graphic comparison split screen"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpq-ayfsN2MBJ0pF0v36plOntreJI1pXFSgA2vsTQrJAB0WNe9t-q2TtZYTcSWYW2oGo-BDO7WiCXIKecdZ-3FNuqvbKAw0OIKYslH9Ncp4_MlkrXC-KlYthaojxP59N0XiPRnN4L2rocKL8wLIRSF3o6qc8O0Qj1Y_4jb_5yPJ0aG3HIkOYYEe_7g2q-L6UaLRTO9J5SWWMb2MH5SfLXmJnL3HSrg2Tj52YsF4TZB2GFIYdj-MPSn"
                        onError={() => setCompareImgErr(true)}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-surface-container to-primary-fixed/30 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[54px]">compare</span>
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md shadow flex items-center justify-between">
                      <span className="font-label-md text-label-md text-on-surface font-bold">2D Cadastre vs 3D Parcel Twin</span>
                      <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-code-sm text-code-sm">Interactive Model</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION: OFFICIAL REGISTRY CALLOUT BANNER */}
            <section className="w-full px-space-lg lg:px-margin-md max-w-7xl mx-auto pb-space-xl">
              <div className="relative w-full rounded-2xl bg-gradient-to-r from-primary to-secondary p-space-lg lg:p-space-xl text-on-primary shadow-xl overflow-hidden">
                {/* Abstract background geometry */}
                <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
                <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-space-lg">
                  <div className="flex flex-col gap-space-xs text-center md:text-left">
                    <div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm self-center md:self-start">
                      <span className="material-symbols-outlined text-[16px] text-tertiary-fixed">verified</span>
                      <span className="font-label-sm text-label-sm font-semibold tracking-wide uppercase text-white">Official Cadastral Platform</span>
                    </div>
                    <h3 className="font-headline-lg text-headline-lg font-bold text-white tracking-tight">
                      Certified 3D Digital Cadastre • Instant Spatial Verification
                    </h3>
                    <p className="font-body-md text-body-md text-on-primary-container max-w-2xl">
                      Fully integrated with standard land administration systems. Experience complete 3D parcel registration in real-time.
                    </p>
                  </div>
                  <Link
                    to="/create-project"
                    className="inline-flex items-center justify-center gap-space-xs px-space-xl py-4 rounded-xl bg-surface-container-lowest text-primary font-title-sm text-title-sm font-bold shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 whitespace-nowrap"
                  >
                    <span className="material-symbols-outlined text-[20px]">add_location_alt</span>
                    <span>Register 3D Property</span>
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
