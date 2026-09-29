import React, { useState } from 'react';
import type { MapLayerOptions } from '../../types/map';

interface MapLayersProps {
  layerOptions: MapLayerOptions;
  onChangeOptions: (updated: Partial<MapLayerOptions>) => void;
}

export const MapLayers: React.FC<MapLayersProps> = ({
  layerOptions,
  onChangeOptions,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute top-24 left-6 z-20">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3.5 py-2.5 bg-surface-container-lowest/90 backdrop-blur-md rounded-2xl shadow-lg border border-surface-container-high/60 flex items-center gap-2 text-on-surface hover:bg-surface-container transition-all"
        title="Toggle Map Layers"
      >
        <span className="material-symbols-outlined text-primary text-[20px]">layers</span>
        <span className="font-label-md text-label-md font-semibold">Layers</span>
        <span
          className={`material-symbols-outlined text-[18px] text-on-surface-variant transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          expand_more
        </span>
      </button>

      {/* Popover Panel */}
      {isOpen && (
        <div className="mt-2 w-64 p-3.5 bg-surface-container-lowest/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-surface-container-high/60 space-y-3.5 animate-in fade-in duration-150 text-left">
          <div className="flex items-center justify-between border-b border-surface-container-high/40 pb-2">
            <span className="text-label-sm font-bold text-on-surface uppercase tracking-wider">
              Layer Controls
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>

          {/* 3D Buildings Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">
                apartment
              </span>
              <div className="flex flex-col">
                <span className="text-label-md font-semibold text-on-surface">
                  3D Buildings
                </span>
                <span className="text-[11px] text-on-surface-variant">
                  Cadastral volumes
                </span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={layerOptions.showBuildings}
                onChange={(e) => onChangeOptions({ showBuildings: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-10 h-5.5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>

          {/* Footprints Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary text-[20px]">
                crop_square
              </span>
              <div className="flex flex-col">
                <span className="text-label-md font-semibold text-on-surface">
                  Parcel Footprints
                </span>
                <span className="text-[11px] text-on-surface-variant">
                  Boundary perimeters
                </span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={layerOptions.showFootprints}
                onChange={(e) => onChangeOptions({ showFootprints: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-10 h-5.5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-tertiary" />
            </label>
          </div>

          {/* Globe Info */}
          <div className="pt-2 border-t border-surface-container-high/40 text-[11px] text-on-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-primary">public</span>
            <span>Native Dark GIS Globe</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapLayers;
