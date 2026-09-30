import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SelectedBuilding } from '../../types/map';
import type { UnitGeometry } from '../../types/job';

interface PropertyDrawerProps {
  selectedBuilding: SelectedBuilding | null;
  onClose: () => void;
  onZoomToBuilding: () => void;
  onSelectUnit?: (unit: UnitGeometry | null) => void;
}

export const PropertyDrawer: React.FC<PropertyDrawerProps> = ({
  selectedBuilding,
  onClose,
  onZoomToBuilding,
  onSelectUnit,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'units' | 'cadastre'>('overview');
  const [copiedUlpin, setCopiedUlpin] = useState<string | null>(null);

  if (!selectedBuilding) return null;

  const {
    buildingNumber,
    projectName,
    projectId,
    ulpin,
    floorCount,
    unitCount,
    area,
    height,
    registryStatus,
    units,
    selectedUnit,
    location,
  } = selectedBuilding;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUlpin(text);
    setTimeout(() => setCopiedUlpin(null), 2000);
  };

  const handleViewProperty = () => {
    navigate(`/property-report?project=${projectId}&building=${buildingNumber}`);
  };

  return (
    <div className="absolute top-20 right-4 bottom-6 z-30 w-96 max-w-[calc(100vw-2rem)] flex flex-col bg-surface-container-lowest/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-surface-container-high/60 overflow-hidden animate-in fade-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-surface-container-high/50 flex items-start justify-between gap-3 bg-surface-container-low/50">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">apartment</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-headline-sm text-title-sm text-on-surface font-bold truncate">
                Building {buildingNumber}
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  registryStatus === 'SYNCHRONIZED'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {registryStatus}
              </span>
            </div>
            <span className="font-body-sm text-label-sm text-on-surface-variant truncate">
              {projectName}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          title="Close drawer"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      {/* Primary Actions Bar */}
      <div className="p-3 bg-surface-container-low/30 border-b border-surface-container-high/40 flex items-center gap-2">
        <button
          onClick={onZoomToBuilding}
          className="flex-1 px-3 py-2 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 shadow-sm hover:bg-primary/90 transition-all active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-[18px]">center_focus_strong</span>
          <span>Zoom to Building</span>
        </button>
        <button
          onClick={handleViewProperty}
          className="flex-1 px-3 py-2 rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 hover:bg-surface-container-highest transition-all active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-[18px]">open_in_new</span>
          <span>View Property</span>
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center border-b border-surface-container-high/40 px-3 bg-surface-container-lowest text-label-md">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-2.5 px-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">info</span>
          <span>Overview</span>
        </button>
        <button
          onClick={() => setActiveTab('units')}
          className={`py-2.5 px-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'units'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">domain</span>
          <span>Units ({units.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('cadastre')}
          className={`py-2.5 px-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'cadastre'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">badge</span>
          <span>ULPIN</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {activeTab === 'overview' && (
          <div className="space-y-4 text-left">
            {/* Primary ULPIN Card */}
            <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container-high/50 flex items-center justify-between">
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                  Primary Cadastral ULPIN
                </span>
                <span className="font-mono text-body-sm font-bold text-on-surface truncate">
                  {ulpin}
                </span>
              </div>
              <button
                onClick={() => handleCopy(ulpin)}
                className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                title="Copy ULPIN"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {copiedUlpin === ulpin ? 'check' : 'content_copy'}
                </span>
              </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-surface-container-low/70 border border-surface-container-high/40">
                <span className="text-[11px] text-on-surface-variant font-medium block">
                  Total Floors
                </span>
                <span className="font-headline-sm text-title-md font-bold text-on-surface">
                  {floorCount} Levels
                </span>
              </div>
              <div className="p-3 rounded-xl bg-surface-container-low/70 border border-surface-container-high/40">
                <span className="text-[11px] text-on-surface-variant font-medium block">
                  Vertical Units
                </span>
                <span className="font-headline-sm text-title-md font-bold text-on-surface">
                  {unitCount} Parcels
                </span>
              </div>
              <div className="p-3 rounded-xl bg-surface-container-low/70 border border-surface-container-high/40">
                <span className="text-[11px] text-on-surface-variant font-medium block">
                  Footprint Area
                </span>
                <span className="font-headline-sm text-title-md font-bold text-on-surface">
                  {area} m²
                </span>
              </div>
              <div className="p-3 rounded-xl bg-surface-container-low/70 border border-surface-container-high/40">
                <span className="text-[11px] text-on-surface-variant font-medium block">
                  Structure Height
                </span>
                <span className="font-headline-sm text-title-md font-bold text-on-surface">
                  {height.toFixed(1)} m
                </span>
              </div>
            </div>

            {/* Geographic Coordinates */}
            <div className="p-3 rounded-xl bg-surface-container-low/60 border border-surface-container-high/40 space-y-1">
              <div className="flex items-center gap-1.5 text-on-surface-variant text-[11px] font-semibold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[14px]">pin_drop</span>
                <span>Anchor Geolocation</span>
              </div>
              <p className="font-mono text-label-sm text-on-surface">
                {location.latitude.toFixed(6)}° N, {location.longitude.toFixed(6)}° E
              </p>
            </div>

            {/* Selected Unit Mini Banner (if a unit was clicked) */}
            {selectedUnit && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                    Selected Unit
                  </span>
                  <span className="text-[11px] font-semibold text-amber-700">
                    Floor {selectedUnit.floorNumber} • Unit {selectedUnit.unitNumber}
                  </span>
                </div>
                <div className="font-mono text-[12px] text-amber-900 font-semibold truncate">
                  {selectedUnit.ulpin}
                </div>
                <div className="text-[11px] text-amber-800 flex items-center justify-between pt-1">
                  <span>Area: {selectedUnit.area} m²</span>
                  <span>
                    Elev: {selectedUnit.baseZ.toFixed(1)}m – {selectedUnit.topZ.toFixed(1)}m
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'units' && (
          <div className="space-y-2 text-left">
            <p className="text-[11px] text-on-surface-variant font-medium px-1">
              Click a unit below to focus on its 3D volumetric slice:
            </p>
            <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
              {units.map((unit) => {
                const isSelected = selectedUnit?.unitNumber === unit.unitNumber;
                return (
                  <div
                    key={`${unit.floorNumber}-${unit.unitNumber}`}
                    onClick={() => onSelectUnit && onSelectUnit(isSelected ? null : unit)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-50 border-amber-400 shadow-xs'
                        : 'bg-surface-container-low/60 hover:bg-surface-container border-surface-container-high/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                          isSelected
                            ? 'bg-amber-500 text-white'
                            : 'bg-primary/10 text-primary'
                        }`}
                      >
                        F{unit.floorNumber}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-label-md font-semibold text-on-surface truncate">
                          Unit {unit.unitNumber}
                        </span>
                        <span className="font-mono text-[10px] text-on-surface-variant truncate">
                          {unit.ulpin}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-label-sm font-bold text-on-surface block">
                        {unit.area} m²
                      </span>
                      <span className="text-[10px] text-on-surface-variant">
                        Δz {unit.floorHeight.toFixed(1)}m
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'cadastre' && (
          <div className="space-y-3 text-left">
            <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container-high/50 space-y-2">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                Registry Verification
              </span>
              <div className="space-y-1 text-label-sm text-on-surface">
                <div className="flex justify-between py-1 border-b border-surface-container-high/40">
                  <span className="text-on-surface-variant">Registry Standard:</span>
                  <span className="font-semibold">3D Cadastral Framework</span>
                </div>
                <div className="flex justify-between py-1 border-b border-surface-container-high/40">
                  <span className="text-on-surface-variant">Subdivision Type:</span>
                  <span className="font-semibold">Strata Title Parcels</span>
                </div>
                <div className="flex justify-between py-1 border-b border-surface-container-high/40">
                  <span className="text-on-surface-variant">Geometry Validation:</span>
                  <span className="text-emerald-600 font-bold">Closed 3D Mesh</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-on-surface-variant">Elevation Datum:</span>
                  <span className="font-mono text-xs">WGS84 Ellipsoidal</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container-high/50 space-y-1">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                Blockchain Hash
              </span>
              <p className="font-mono text-[10px] text-on-surface-variant break-all">
                0x7a89f3b1e2c908d4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDrawer;
