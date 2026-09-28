import React from 'react';

interface UploadCardProps {
  icon: string;
  iconBgClass: string;
  title: string;
  badgeText: string;
  badgeClass: string;
  description: string;
  buttonIcon: string;
  buttonText: string;
  buttonClass: string;
  children?: React.ReactNode;
}

const UploadCard: React.FC<UploadCardProps> = ({
  icon,
  iconBgClass,
  title,
  badgeText,
  badgeClass,
  description,
  buttonIcon,
  buttonText,
  buttonClass,
  children
}) => {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low hover:bg-surface-container/70 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start sm:items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${iconBgClass}`}>
          <span className="material-symbols-outlined text-[26px]">{icon}</span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h4 className="font-title-sm text-title-sm text-on-surface font-semibold">{title}</h4>
            <span className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${badgeClass}`}>
              {badgeText}
            </span>
          </div>
          <span className="font-body-md text-body-md text-on-surface-variant">{description}</span>
          {children}
        </div>
      </div>
      <div className="flex items-center sm:self-center">
        <button className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-label-md text-label-md transition-colors shadow-xs flex items-center justify-center gap-1.5 ${buttonClass}`} type="button">
          <span className="material-symbols-outlined text-[18px]">{buttonIcon}</span>
          <span>{buttonText}</span>
        </button>
      </div>
    </div>
  );
};

export default UploadCard;
