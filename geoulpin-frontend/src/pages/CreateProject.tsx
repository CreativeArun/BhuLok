import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const CreateProject: React.FC = () => {
  const [miniImgErr, setMiniImgErr] = useState(false);

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col">
      <Navbar />

      <main className="w-full pt-20 bg-surface flex-1">
        <div className="flex flex-col w-full">
          <section className="relative w-full overflow-hidden bg-gradient-to-b from-surface via-surface-container-low/40 to-surface pb-16">
            <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[760px] h-[340px] bg-gradient-to-tr from-primary-fixed/40 via-secondary-fixed/30 to-tertiary-fixed/20 blur-3xl opacity-60 rounded-full"></div>

            <div className="relative w-full max-w-7xl mx-auto px-space-lg lg:px-margin-md pt-6 flex flex-col gap-10">
              {/* Top Wizard Progress Header */}
              <div className="w-full bg-surface-container-lowest shadow-md rounded-2xl p-6 sm:p-8 flex flex-col gap-6 border border-surface-container-high/50 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-label-sm text-label-sm text-primary tracking-wider uppercase font-semibold">Fast Setup Assistant</span>
                    <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">Create 3D Cadastral Digital Twin</h1>
                    <p className="font-body-md text-body-md text-on-surface-variant">Turn standard photos and documents into a verified vertical parcel in under 2 minutes.</p>
                  </div>
                  <div className="inline-flex items-center gap-2 self-start sm:self-auto bg-surface-container-high px-4 py-2 rounded-full">
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container animate-pulse"></span>
                    <span className="font-label-md text-label-md text-on-surface font-semibold">Step 2 of 3</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">(~90s remaining)</span>
                  </div>
                </div>

                {/* Stepper Visual */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {/* Step 1 */}
                  <div className="flex items-center gap-3.5 p-3 rounded-xl bg-surface-container-low transition-all">
                    <div className="w-10 h-10 rounded-full bg-tertiary-container text-on-tertiary flex items-center justify-center font-title-sm text-title-sm shadow-sm flex-shrink-0">
                      <span className="material-symbols-outlined text-[20px]">check</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-label-sm text-label-sm text-tertiary font-semibold uppercase tracking-wider">Step 1</span>
                      <span className="font-title-sm text-title-sm text-on-surface font-semibold truncate">Basic Info</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Completed • Validated</span>
                    </div>
                  </div>

                  {/* Step 2 (Active) */}
                  <div className="flex items-center gap-3.5 p-3 rounded-xl bg-primary-fixed/50 shadow-sm transition-all">
                    <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-title-sm text-title-sm shadow-md flex-shrink-0 ring-4 ring-primary-fixed">
                      <span className="font-code-sm text-code-sm font-bold">2</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-label-sm text-label-sm text-primary font-semibold uppercase tracking-wider">Step 2 (Active)</span>
                      <span className="font-title-sm text-title-sm text-on-surface font-bold truncate">Upload Property Assets</span>
                      <span className="font-label-sm text-label-sm text-on-primary-fixed-variant font-medium">Ready with photos only</span>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-center gap-3.5 p-3 rounded-xl bg-surface-container-low opacity-75">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-title-sm text-title-sm flex-shrink-0">
                      <span className="font-code-sm text-code-sm">3</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">Step 3</span>
                      <span className="font-title-sm text-title-sm text-on-surface font-semibold truncate">3D Parcel Synthesis</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Auto-generates ULPIN</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Combined Creation Workspace */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Step 1 Confirmation & Basic Info */}
                <div className="lg:col-span-5 flex flex-col gap-6 text-left">
                  <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-7 shadow-md flex flex-col gap-6 border border-surface-container-high/50">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="font-label-sm text-label-sm text-primary uppercase font-semibold">General Registry</span>
                        <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight font-bold">Tell us about the property</h2>
                      </div>
                      <span className="p-2 rounded-xl bg-surface-container-low text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-[24px]">apartment</span>
                      </span>
                    </div>

                    {/* Visual Context Mini Preview Card */}
                    <div className="relative w-full h-40 rounded-xl overflow-hidden shadow-sm group bg-surface-container-low">
                      {!miniImgErr ? (
                        <img
                          className="w-full h-full object-cover"
                          alt="Modern clean low-angle architectural photography"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjdx2JuPvDSKsRIS6m9SLIFRhsgTzvKtoAciBXADf2_u3YTw8oiq3SLNNFOhK6O1UM9g2jZS8YDyJeaSGGw1ezwtyHpiJzjQipQhISSqa58cRLX-DWPDOPWSu5UnNr1vHN657ACIFCPGqMqFU9OmtswW-Hzi_MF7EOcLEILQzHqs4-nnSPuX9fnAaocBGaIJ8tTCycb8nmHyH3ybqacxKEamvvnw20JQzPT9NEqY4-fWrPSv5qaZdY"
                          onError={() => setMiniImgErr(true)}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-primary-fixed/30 to-surface-container flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-[42px]">apartment</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent flex items-end p-4">
                        <div className="flex items-center gap-2 text-surface-container-lowest">
                          <span className="material-symbols-outlined text-[18px]">verified_user</span>
                          <span className="font-label-sm text-label-sm font-medium">Auto-mapped to Registry Sub-district Sector 14</span>
                        </div>
                      </div>
                    </div>

                    {/* Input Fields with Friendly Placeholders */}
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between" htmlFor="propertyName">
                          <span>Property Name</span>
                          <span className="font-label-sm text-label-sm text-tertiary font-semibold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">check_circle</span> Auto-saved
                          </span>
                        </label>
                        <div className="relative">
                          <input className="w-full h-12 bg-surface-container-low text-on-surface font-body-md text-body-md px-4 rounded-xl focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:shadow-md transition-all" id="propertyName" type="text" defaultValue="Green Valley Heights" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1" htmlFor="locationCity">
                          <span>Location / City</span>
                          <span className="text-error font-body-md">*</span>
                        </label>
                        <div className="relative">
                          <input className="w-full h-12 bg-surface-container-low text-on-surface font-body-md text-body-md px-4 rounded-xl focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:shadow-md transition-all" id="locationCity" type="text" defaultValue="Delhi NCR (Sector 14)" />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-primary pointer-events-none">
                            <span className="material-symbols-outlined text-[20px]">pin_drop</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between" htmlFor="propDescription">
                          <span>Description</span>
                          <span className="font-label-sm text-label-sm text-on-surface-variant font-normal">Optional</span>
                        </label>
                        <textarea className="w-full p-4 bg-surface-container-low text-on-surface font-body-md text-body-md rounded-xl focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:shadow-md transition-all resize-none leading-relaxed" id="propDescription" rows={3} defaultValue="Residential apartment tower with 4 floors and 24 units." />
                      </div>
                    </div>

                    {/* Micro Cadastral Pill Info */}
                    <div className="p-3.5 rounded-xl bg-surface-container flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-[22px]">tag</span>
                      <div className="flex flex-col">
                        <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Assigned Official 3D ULPIN ID</span>
                        <span className="font-code-sm text-code-sm font-semibold text-on-surface">ULPIN-DEL-7890-3D-P4</span>
                      </div>
                    </div>
                  </div>

                  {/* Helpful Info / Trust Card */}
                  <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex items-start gap-4 border border-surface-container-high/50">
                    <div className="p-2.5 rounded-xl bg-primary-fixed text-on-primary-fixed flex-shrink-0">
                      <span className="material-symbols-outlined text-[22px]">format_image_left</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="font-title-sm text-title-sm text-on-surface font-semibold">Zero Surveying Gear Needed</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">Our smart vertical alignment engine derives official volumetric parcel coordinates automatically using ordinary smartphone captures.</p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Step 2 Upload Data */}
                <div className="lg:col-span-7 flex flex-col gap-6 text-left">
                  <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-7 shadow-md flex flex-col gap-6 border border-surface-container-high/50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-bold">Step 2 • Asset Verification</span>
                          <span className="font-label-sm text-label-sm text-tertiary font-semibold flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-tertiary"></span> Active Verification
                          </span>
                        </div>
                        <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight font-bold">Add property information</h2>
                      </div>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Upload whatever information you have. You don't need to provide everything.
                    </p>

                    {/* Friendly High-Confidence Helper Badge */}
                    <div className="p-4 rounded-xl bg-tertiary-fixed/30 text-on-tertiary-fixed flex items-center gap-3">
                      <span className="text-xl">💡</span>
                      <p className="font-body-md text-body-md text-on-surface font-medium">
                        <strong className="font-semibold text-tertiary">You can continue with photos alone!</strong> Other spatial assets simply add higher level-of-detail to the exterior bounds.
                      </p>
                    </div>

                    {/* Upload Cards List */}
                    <div className="flex flex-col gap-3.5">
                      {/* 1. Property Photos */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low hover:bg-surface-container/70 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start sm:items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center flex-shrink-0 shadow-sm">
                            <span className="material-symbols-outlined text-[26px]">photo_camera</span>
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <h4 className="font-title-sm text-title-sm text-on-surface font-semibold">1. Property Photos</h4>
                              <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-semibold">Required</span>
                            </div>
                            <span className="font-body-md text-body-md text-on-surface-variant">Upload photos of the building from street or roof angles.</span>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-tertiary font-bold bg-surface-container-lowest px-2.5 py-1 rounded-md shadow-xs">
                                <span className="material-symbols-outlined text-[16px] text-tertiary">check_circle</span> 4 photos added ✓
                              </span>
                              <span className="font-label-sm text-label-sm text-on-surface-variant">Front, East Facade, Entrance, Roof</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center sm:self-center">
                          <button className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-surface-container text-primary font-label-md text-label-md font-semibold hover:bg-surface-container-high transition-colors shadow-xs flex items-center justify-center gap-1.5" type="button">
                            <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>
                            <span>+ Manage Photos</span>
                          </button>
                        </div>
                      </div>

                      {/* 2. Floor Plans (Optional) */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low hover:bg-surface-container/70 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start sm:items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-[26px]">floor</span>
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <h4 className="font-title-sm text-title-sm text-on-surface font-semibold">2. Floor Plans</h4>
                              <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">Optional</span>
                            </div>
                            <span className="font-body-md text-body-md text-on-surface-variant">Upload floor plans if available. (PDF, JPG, PNG)</span>
                          </div>
                        </div>
                        <div className="flex items-center sm:self-center">
                          <button className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface font-label-md text-label-md font-medium hover:bg-surface-container transition-colors shadow-xs flex items-center justify-center gap-1.5" type="button">
                            <span className="material-symbols-outlined text-[18px] text-primary">add</span>
                            <span>+ Upload Floor Plans</span>
                          </button>
                        </div>
                      </div>

                      {/* 3. Property Map (Optional) */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low hover:bg-surface-container/70 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start sm:items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-[26px]">map</span>
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <h4 className="font-title-sm text-title-sm text-on-surface font-semibold">3. Property Map</h4>
                              <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">Optional</span>
                            </div>
                            <span className="font-body-md text-body-md text-on-surface-variant">Upload an existing property map or boundary paper if available.</span>
                          </div>
                        </div>
                        <div className="flex items-center sm:self-center">
                          <button className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface font-label-md text-label-md font-medium hover:bg-surface-container transition-colors shadow-xs flex items-center justify-center gap-1.5" type="button">
                            <span className="material-symbols-outlined text-[18px] text-primary">add</span>
                            <span>+ Upload Map</span>
                          </button>
                        </div>
                      </div>

                      {/* 4. 3D / LiDAR Data (Optional) */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low hover:bg-surface-container/70 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start sm:items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-[26px]">view_in_ar</span>
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <h4 className="font-title-sm text-title-sm text-on-surface font-semibold">4. 3D / LiDAR Data</h4>
                              <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">Optional</span>
                            </div>
                            <span className="font-body-md text-body-md text-on-surface-variant">Optional advanced spatial mesh, iPhone LiDAR scan, or drone export.</span>
                          </div>
                        </div>
                        <div className="flex items-center sm:self-center">
                          <button className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface font-label-md text-label-md font-medium hover:bg-surface-container transition-colors shadow-xs flex items-center justify-center gap-1.5" type="button">
                            <span className="material-symbols-outlined text-[18px] text-primary">add</span>
                            <span>+ Upload 3D Data</span>
                          </button>
                        </div>
                      </div>

                      {/* 5. Location Data (Optional) */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low hover:bg-surface-container/70 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start sm:items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-[26px]">my_location</span>
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <h4 className="font-title-sm text-title-sm text-on-surface font-semibold">5. Location Data</h4>
                              <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">Optional</span>
                            </div>
                            <span className="font-body-md text-body-md text-on-surface-variant">Optional GPS pin coordinates or dropped smartphone landmark mark.</span>
                          </div>
                        </div>
                        <div className="flex items-center sm:self-center">
                          <button className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface font-label-md text-label-md font-medium hover:bg-surface-container transition-colors shadow-xs flex items-center justify-center gap-1.5" type="button">
                            <span className="material-symbols-outlined text-[18px] text-primary">add</span>
                            <span>+ Upload Location Data</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Upload Readiness Summary */}
                    <div className="mt-2 p-4 rounded-xl bg-surface-container flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-tertiary-container text-on-tertiary flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px]">verified</span>
                        </div>
                        <span className="font-label-md text-label-md text-on-surface font-semibold">Asset Readiness Score: 85% (Excellent)</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-tertiary font-bold">Ready to Generate</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Footer Floating Bar */}
              <div className="sticky bottom-6 z-40 w-full bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-surface-container-high/50">
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                  <Link
                    to="/"
                    className="px-5 py-3 rounded-xl bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md font-semibold flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    <span>Back</span>
                  </Link>
                  <span className="sm:hidden font-label-sm text-label-sm text-on-surface-variant">Est: ~30 sec</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Vertical extrusion ready</span>
                    <span className="font-label-sm text-label-sm text-tertiary font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">timer</span> Estimated time: ~30 seconds
                    </span>
                  </div>
                  <Link
                    to="/property-report"
                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-title-sm text-title-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 transform active:scale-95"
                  >
                    <span>Generate 3D Property</span>
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </Link>
                </div>
              </div>

            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateProject;
