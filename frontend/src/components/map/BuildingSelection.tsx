import React from 'react';
import type { SelectedBuilding } from '../../types/map';

interface BuildingSelectionProps {
  selectedBuilding: SelectedBuilding | null;
  onClear: () => void;
  onFocus: () => void;
}

export const BuildingSelection: React.FC<BuildingSelectionProps> = ({
  selectedBuilding,
  onClear,
  onFocus,
}) => {
  if (!selectedBuilding) return null;

  return (
    <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 hidden md:flex items-center gap-2.5 px-4 py-2 bg-surface-container-lowest/95 backdrop-blur-md rounded-full shadow-lg border border-primary/30 text-on-surface animate-in fade-in slide-in-from-top-2 duration-200">
      <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shrink-0" />
      <span className="font-label-md text-label-md font-bold text-primary">
        Building {selectedBuilding.buildingNumber}
      </span>
      <span className="text-on-surface-variant text-label-sm">•</span>
      <span className="font-mono text-label-sm text-on-surface truncate max-w-[180px]">
        {selectedBuilding.ulpin}
      </span>
      <div className="w-[1px] h-4 bg-surface-container-high mx-1" />
      <button
        onClick={onFocus}
        className="text-label-sm font-semibold text-primary hover:underline flex items-center gap-0.5"
      >
        <span className="material-symbols-outlined text-[16px]">center_focus_strong</span>
        <span>Fly to</span>
      </button>
      <button
        onClick={onClear}
        className="w-5 h-5 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container ml-1"
        title="Deselect"
      >
        <span className="material-symbols-outlined text-[14px]">close</span>
      </button>
    </div>
  );
};

export default BuildingSelection;
