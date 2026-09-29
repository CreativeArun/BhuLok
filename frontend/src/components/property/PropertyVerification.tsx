import React from 'react';

const PropertyVerification: React.FC = () => {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-md flex flex-col gap-space-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-tertiary text-[22px]">verified_user</span>
          <h3 className="font-headline-md text-headline-md text-on-surface">Property Verification</h3>
        </div>
        <span className="px-space-sm py-1 rounded-full bg-tertiary-container/15 text-tertiary font-label-md text-label-md font-semibold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
          All 4 Checks Passed ✓
        </span>
      </div>

      <div className="flex flex-col gap-space-sm">
        <div className="flex items-start gap-space-sm p-space-sm rounded-lg bg-surface-container-low">
          <span className="material-symbols-outlined text-tertiary text-[20px] mt-0.5">check_circle</span>
          <div className="flex flex-col">
            <span className="font-title-sm text-body-md font-semibold text-on-surface">Geometry valid &amp; closed volume</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Watertight 3D polyhedron with zero manifold self-intersections.</span>
          </div>
        </div>
        <div className="flex items-start gap-space-sm p-space-sm rounded-lg bg-surface-container-low">
          <span className="material-symbols-outlined text-tertiary text-[20px] mt-0.5">check_circle</span>
          <div className="flex flex-col">
            <span className="font-title-sm text-body-md font-semibold text-on-surface">Property completely inside building</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">100% spatial containment inside the parent cadastral building footprint.</span>
          </div>
        </div>
        <div className="flex items-start gap-space-sm p-space-sm rounded-lg bg-surface-container-low">
          <span className="material-symbols-outlined text-tertiary text-[20px] mt-0.5">check_circle</span>
          <div className="flex flex-col">
            <span className="font-title-sm text-body-md font-semibold text-on-surface">Property aligned to Floor 3</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Vertical z-range strictly bounded between 6.00m and 9.00m elevations.</span>
          </div>
        </div>
        <div className="flex items-start gap-space-sm p-space-sm rounded-lg bg-surface-container-low">
          <span className="material-symbols-outlined text-tertiary text-[20px] mt-0.5">check_circle</span>
          <div className="flex flex-col">
            <span className="font-title-sm text-body-md font-semibold text-on-surface">No overlap with neighbouring units</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Zero volume collision with Units 001, 003, and common vertical stair core.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyVerification;
