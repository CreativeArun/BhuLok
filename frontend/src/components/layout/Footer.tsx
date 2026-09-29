import React from 'react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-surface-container-lowest shadow-[0_-1px_6px_rgba(0,0,0,0.02)] py-space-lg border-t border-surface-container-high/40">
      <div className="w-full px-space-lg lg:px-margin-md flex flex-col sm:flex-row items-center justify-between gap-space-md">
        <Logo size="sm" showSubtitle={true} />
        <div className="flex items-center gap-space-lg font-label-sm text-label-sm text-on-surface-variant">
          <span>© 2025 BhuLok. All rights reserved.</span>
          <a className="hover:text-on-surface transition-colors" href="#">Privacy</a>
          <a className="hover:text-on-surface transition-colors" href="#">Terms</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
