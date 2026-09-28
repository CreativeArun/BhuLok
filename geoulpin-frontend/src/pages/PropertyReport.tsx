import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import PropertyVerification from '../components/property/PropertyVerification';

const PropertyReport: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [renderImgErr, setRenderImgErr] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('IN-XX-P001-B001-F003-U002');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col">
      <Navbar />

      <main className="w-full pt-20 bg-surface flex-1">
        <div className="flex flex-col w-full">
          {/* Celebration Top Hero Section */}
          <section className="relative w-full px-space-lg lg:px-margin-md pt-space-lg pb-space-xl overflow-hidden">
            {/* Ambient Diffused Glows */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-96 h-96 bg-tertiary-fixed/30 rounded-full blur-3xl pointer-events-none -z-10"></div>
            <div className="absolute top-20 right-1/4 w-80 h-80 bg-primary-fixed/40 rounded-full blur-3xl pointer-events-none -z-10"></div>

            <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
              {/* Emerald Success Badge */}
              <div className="inline-flex items-center gap-space-xs px-space-md py-1.5 rounded-full bg-tertiary-container/15 text-tertiary mb-space-md">
                <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                <span className="font-label-md text-label-md tracking-wider uppercase font-semibold">Cadastral Synthesis Verified</span>
              </div>

              {/* Icon & Headline */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-tertiary flex items-center justify-center shadow-lg shadow-tertiary/20 mb-space-md text-on-tertiary">
                  <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
                <h1 className="font-display-sm lg:font-display-lg text-display-sm lg:text-display-lg text-on-surface tracking-tight max-w-3xl font-extrabold leading-tight">
                  Your 3D property is ready!
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-space-sm leading-relaxed">
                  We successfully converted your photos, boundary points, and spatial survey into an official, legally registered 3D digital property model.
                </p>
              </div>

              {/* Quick Meta Strip */}
              <div className="flex flex-wrap items-center justify-center gap-space-sm mt-space-lg">
                <span className="inline-flex items-center gap-1.5 px-space-md py-1 rounded-full bg-surface-container-low text-on-surface-variant font-code-sm text-code-sm shadow-sm">
                  <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                  Project ID: #PRJ-8842-DL
                </span>
                <span className="inline-flex items-center gap-1.5 px-space-md py-1 rounded-full bg-surface-container-low text-on-surface-variant font-code-sm text-code-sm shadow-sm">
                  <span className="material-symbols-outlined text-tertiary text-[18px]">schedule</span>
                  Generated: Just now (0.42s)
                </span>
                <span className="inline-flex items-center gap-1.5 px-space-md py-1 rounded-full bg-surface-container-low text-on-surface-variant font-code-sm text-code-sm shadow-sm">
                  <span className="material-symbols-outlined text-secondary text-[18px]">public</span>
                  CRS: EPSG 7755 (WGS84 UTM)
                </span>
              </div>
            </div>
          </section>

          {/* Two-Column Master Grid */}
          <section className="w-full px-space-lg lg:px-margin-md pb-space-xl">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-lg">

              {/* LEFT COLUMN: 3D Property Preview & Identity Card (7 Cols) */}
              <div className="lg:col-span-7 flex flex-col gap-space-lg text-left">

                {/* Primary 3D Spatial Render Stage */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-md sm:p-6 shadow-md flex flex-col gap-space-md relative overflow-hidden border border-surface-container-high/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-primary text-[22px]">view_in_ar</span>
                      <h2 className="font-headline-md text-headline-md text-on-surface font-bold">3D Cadastral Volumetric Model</h2>
                    </div>
                    <span className="px-space-sm py-1 rounded-full bg-tertiary/10 text-tertiary font-label-sm text-label-sm font-semibold">
                      Level of Detail (LoD 2.2)
                    </span>
                  </div>

                  {/* Isometric Model Preview with UI Layer Overlay */}
                  <div className="relative w-full h-80 rounded-xl overflow-hidden bg-surface-container flex items-center justify-center">
                    {!renderImgErr ? (
                      <img
                        className="w-full h-full object-cover"
                        alt="Photorealistic 3D architectural digital twin model"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNXwF8AUToJrHtBgLbPV8XAhnFUket9awLk5lGFeHj9Q9vuhFueftQCMJ72_ee1XjobPChgjmgdlzl7kte665CQsS7r3XMYbgUhh5RmTpLKJcdbe5avr4yPRt1JvWCwFRIA4FsqPyI0Sd-0BqqdvJAzTVicszlVxHCorrCGDoOMcQTkSw6oz4bhltNoMMFtXi6aV8j0QjfJfumnxgZOy6s7Pa2K5IIKJMHj3GpNk-cR15etu2gilVy"
                        onError={() => setRenderImgErr(true)}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-primary-fixed/40 via-surface-container to-secondary-fixed/40 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[64px]">view_in_ar</span>
                      </div>
                    )}
                    {/* Live Model Controls Floating Overlay */}
                    <div className="absolute top-3 right-3 flex flex-col gap-1.5 bg-surface-container-lowest/90 backdrop-blur-md p-1 rounded-xl shadow-sm border border-surface-container-high/40">
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors" title="Rotate 3D View">
                        <span className="material-symbols-outlined text-[18px]">3d_rotation</span>
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors" title="Explode Floor Stack">
                        <span className="material-symbols-outlined text-[18px]">layers</span>
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors" title="Reset Orientation">
                        <span className="material-symbols-outlined text-[18px]">filter_center_focus</span>
                      </button>
                    </div>
                    {/* Unit Tag Floating in 3D Space */}
                    <div className="absolute bottom-4 left-4 bg-surface-container-lowest/95 backdrop-blur-md px-space-md py-space-xs rounded-xl shadow-md flex items-center gap-space-sm border border-surface-container-high/50">
                      <div className="w-3 h-3 rounded-full bg-primary animate-ping"></div>
                      <div className="flex flex-col">
                        <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Active Target Focus</span>
                        <span className="font-title-sm text-title-sm text-primary font-bold">Floor 03 • Unit 002</span>
                      </div>
                    </div>
                  </div>

                  {/* Official 3D ULPIN Identity Card */}
                  <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-space-xs text-on-surface-variant">
                        <span className="material-symbols-outlined text-[20px] text-primary">badge</span>
                        <span className="font-label-md text-label-md font-semibold text-on-surface">Official 3D Property Identity (3D ULPIN)</span>
                      </div>
                      <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-medium">Survey Certified</span>
                    </div>

                    {/* Code Display & Direct Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm bg-surface-container-lowest p-space-sm rounded-xl shadow-sm border border-surface-container-high/50">
                      <div className="flex items-center gap-space-sm min-w-0 pl-1">
                        <span className="font-code-sm text-code-sm text-primary font-bold tracking-tight truncate select-all">
                          IN-XX-P001-B001-F003-U002
                        </span>
                      </div>
                      <div className="flex items-center gap-space-xs shrink-0">
                        <button
                          className="flex items-center gap-1 px-space-sm py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-label-sm font-label-sm transition-colors font-medium"
                          onClick={handleCopy}
                        >
                          <span className="material-symbols-outlined text-[16px]">content_copy</span>
                          <span>{copied ? 'Copied!' : 'Copy ID'}</span>
                        </button>
                        <button
                          className="flex items-center gap-1 px-space-sm py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-label-sm font-label-sm transition-colors font-medium"
                          onClick={() => window.print()}
                        >
                          <span className="material-symbols-outlined text-[16px]">print</span>
                          <span>Print Card</span>
                        </button>
                      </div>
                    </div>

                    {/* Spatial Hierarchy Diagram */}
                    <div className="mt-space-xs pt-space-xs flex flex-col gap-1">
                      <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Cadastral Spatial Hierarchy</span>
                      <div className="flex flex-wrap items-center gap-1.5 text-on-surface font-label-md text-label-md">
                        <span className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface flex items-center gap-1 font-medium">
                          <span className="material-symbols-outlined text-[16px] text-tertiary">terrain</span>
                          Parcel (P001)
                        </span>
                        <span className="material-symbols-outlined text-outline text-[16px]">chevron_right</span>
                        <span className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface flex items-center gap-1 font-medium">
                          <span className="material-symbols-outlined text-[16px] text-secondary">apartment</span>
                          Building Alpha
                        </span>
                        <span className="material-symbols-outlined text-outline text-[16px]">chevron_right</span>
                        <span className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface flex items-center gap-1 font-medium">
                          <span className="material-symbols-outlined text-[16px] text-primary">layers</span>
                          Floor 03
                        </span>
                        <span className="material-symbols-outlined text-outline text-[16px]">chevron_right</span>
                        <span className="px-2.5 py-1 rounded-lg bg-primary-container text-on-primary font-bold flex items-center gap-1 shadow-sm">
                          <span className="material-symbols-outlined text-[16px]">meeting_room</span>
                          Unit 002
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Primary Actions */}
                  <div className="flex flex-col sm:flex-row items-center gap-space-md pt-space-xs">
                    <Link
                      to="/3d-map"
                      className="w-full sm:flex-1 py-3.5 px-space-md bg-primary-container hover:bg-primary text-on-primary rounded-xl font-title-sm text-title-sm font-semibold flex items-center justify-center gap-space-xs shadow-md hover:shadow-lg transition-all active:scale-[0.99]"
                    >
                      <span className="material-symbols-outlined text-[20px]">public</span>
                      <span>Open in 3D Map</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </Link>
                    <button className="w-full sm:flex-1 py-3.5 px-space-md bg-surface-container-high hover:bg-surface-container text-primary rounded-xl font-title-sm text-title-sm font-semibold flex items-center justify-center gap-space-xs transition-colors shadow-xs" type="button">
                      <span className="material-symbols-outlined text-[20px]">description</span>
                      <span>Download Property Report (PDF)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Property Summary & Verification Dossier (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col gap-space-lg text-left">

                {/* 4 KPI Statistic Grid */}
                <div className="grid grid-cols-2 gap-space-md">
                  {/* KPI 1 */}
                  <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col justify-between border border-surface-container-high/50">
                    <div className="flex items-center justify-between text-on-surface-variant">
                      <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">Land Area</span>
                      <span className="material-symbols-outlined text-primary text-[20px]">square_foot</span>
                    </div>
                    <div className="mt-space-md">
                      <span className="font-display-sm text-display-sm text-on-surface leading-tight font-bold">1,240</span>
                      <span className="font-label-md text-label-md text-on-surface-variant ml-1 font-medium">m²</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-tertiary mt-1 flex items-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-[14px]">check</span> Cadastral verified
                    </span>
                  </div>
                  {/* KPI 2 */}
                  <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col justify-between border border-surface-container-high/50">
                    <div className="flex items-center justify-between text-on-surface-variant">
                      <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">Building</span>
                      <span className="material-symbols-outlined text-secondary text-[20px]">height</span>
                    </div>
                    <div className="mt-space-md">
                      <span className="font-headline-lg text-headline-lg text-on-surface leading-tight font-bold">4 Floors</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant mt-1 font-medium">
                      12.0m total height
                    </span>
                  </div>
                  {/* KPI 3 */}
                  <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col justify-between border border-surface-container-high/50">
                    <div className="flex items-center justify-between text-on-surface-variant">
                      <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">Total Units</span>
                      <span className="material-symbols-outlined text-primary text-[20px]">domain</span>
                    </div>
                    <div className="mt-space-md">
                      <span className="font-display-sm text-display-sm text-on-surface leading-tight font-bold">24</span>
                      <span className="font-label-md text-label-md text-on-surface-variant ml-1 font-medium">Units</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant mt-1 font-medium">
                      6 per level tier
                    </span>
                  </div>
                  {/* KPI 4 */}
                  <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col justify-between border border-surface-container-high/50">
                    <div className="flex items-center justify-between text-on-surface-variant">
                      <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">3D Properties</span>
                      <span className="material-symbols-outlined text-tertiary text-[20px]">token</span>
                    </div>
                    <div className="mt-space-md">
                      <span className="font-display-sm text-display-sm text-tertiary leading-tight font-bold">24</span>
                      <span className="font-label-md text-label-md text-on-surface-variant ml-1 font-medium">IDs</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-tertiary mt-1 flex items-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-[14px]">task_alt</span> 100% Registered
                    </span>
                  </div>
                </div>

                {/* Property Verification Card */}
                <PropertyVerification />

                {/* Selected Unit Detailed Overview */}
                <div className="bg-surface-container-low rounded-2xl p-space-md flex flex-col gap-space-sm border border-surface-container-high/40">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">Verified Unit Spatial Telemetry</span>
                    <span className="font-code-sm text-code-sm font-semibold text-primary">#U002</span>
                  </div>

                  <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-xs border border-surface-container-high/50">
                    <div className="flex items-center justify-between">
                      <span className="font-headline-md text-headline-md text-on-surface font-bold">Unit 2 • Floor 3</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">Residential</span>
                    </div>

                    <div className="grid grid-cols-2 gap-space-sm mt-space-xs pt-space-xs">
                      <div className="flex flex-col">
                        <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Surface Footprint</span>
                        <span className="font-title-sm text-title-sm font-bold text-on-surface">82.4 m²</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Spatial Volume</span>
                        <span className="font-title-sm text-title-sm font-bold text-primary">247.2 m³</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Ceiling Height</span>
                        <span className="font-title-sm text-title-sm font-bold text-on-surface">3.00 m</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Boundary Points</span>
                        <span className="font-title-sm text-title-sm font-bold text-on-surface">8 Vertices</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Bottom Continuity & Management Banner */}
          <section className="w-full px-space-lg lg:px-margin-md pb-space-xl">
            <div className="max-w-7xl mx-auto bg-surface-container-high rounded-2xl p-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md shadow-sm border border-surface-container-highest">
              <div className="flex items-center gap-space-md text-left">
                <div className="w-12 h-12 rounded-2xl bg-surface-container-lowest flex items-center justify-center shrink-0 shadow-sm text-primary">
                  <span className="material-symbols-outlined text-[24px]">folder_special</span>
                </div>
                <div className="flex flex-col">
                  <h4 className="font-title-sm text-title-sm font-bold text-on-surface">Need to add more floors or edit details?</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                    You can modify floor layouts, rename units, and manage spatial registry files anytime inside My Projects.
                  </p>
                </div>
              </div>
              <Link
                to="/create-project"
                className="w-full md:w-auto px-space-lg py-3 rounded-xl bg-surface-container-lowest hover:bg-surface text-on-surface font-title-sm text-title-sm font-semibold flex items-center justify-center gap-space-xs shadow-sm transition-colors whitespace-nowrap"
              >
                <span>Edit Project Assets</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyReport;
