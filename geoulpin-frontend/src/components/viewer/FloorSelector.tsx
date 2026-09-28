import React from 'react';

interface FloorSelectorProps {
  activeFloor: number;
  setActiveFloor: (floor: number) => void;
}

const FloorSelector: React.FC<FloorSelectorProps> = ({ activeFloor, setActiveFloor }) => {
  return (
    <div className="absolute left-space-md lg:left-margin-md top-1/2 -translate-y-1/2 z-10 flex flex-col gap-space-xs bg-surface-container-lowest/90 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-surface-container-high/60">
      <div className="px-2 pt-1 pb-1.5 flex items-center justify-between gap-2">
        <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">Levels</span>
        <span className="material-symbols-outlined text-[16px] text-primary">unfold_more</span>
      </div>
      {[4, 3, 2, 1].map((floor) => (
        <button
          key={floor}
          onClick={() => setActiveFloor(floor)}
          className={`w-full px-3 py-2 rounded-xl font-label-md text-label-md flex items-center justify-between gap-3 transition-colors ${
            activeFloor === floor
              ? 'bg-primary text-on-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <span className={activeFloor === floor ? 'font-semibold' : ''}>
            Floor {floor} {floor === 1 ? '(Ground)' : ''} {activeFloor === floor ? '(Active)' : ''}
          </span>
          <span className={`font-code-sm text-[10px] ${activeFloor === floor ? 'text-on-primary/80' : 'opacity-60'}`}>
            {floor === 4 ? '+12m' : floor === 3 ? '+9m' : floor === 2 ? '+6m' : '±0m'}
          </span>
        </button>
      ))}
    </div>
  );
};

export default FloorSelector;
