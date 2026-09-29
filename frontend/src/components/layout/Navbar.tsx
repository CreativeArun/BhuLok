import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path === '/map' && (location.pathname === '/map' || location.pathname === '/3d-map')) return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinkClasses = (path: string) =>
    isActive(path)
      ? 'px-space-md py-2 rounded-full transition-all bg-surface-container-high text-primary font-title-sm font-semibold shadow-sm'
      : 'px-space-md py-2 rounded-full font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 w-full px-space-lg lg:px-margin-md flex items-center justify-between gap-space-md">
        {/* Brand Logo & Title */}
        <Link to="/" className="min-w-max">
          <Logo size="md" showSubtitle={true} />
        </Link>

        {/* Central Nav Links */}
        <nav className="hidden lg:flex items-center gap-space-xs bg-surface-container-low p-space-xs rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
          <Link className={navLinkClasses('/')} to="/">
            Home
          </Link>
          <Link className={navLinkClasses('/property-report')} to="/property-report">
            My Projects
          </Link>
          <Link className={navLinkClasses('/create-project')} to="/create-project">
            + Create Project
          </Link>
          <Link className={navLinkClasses('/map')} to="/map">
            3D Map
          </Link>
          <Link className={navLinkClasses('/help')} to="#">
            Help
          </Link>
        </nav>

        {/* User / Profile controls */}
        <div className="flex items-center gap-space-md min-w-max">
          <Link
            to="#"
            className="hidden sm:flex items-center justify-center p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            title="Help & Documentation"
          >
            <span className="material-symbols-outlined text-[20px]">help_outline</span>
          </Link>
          <div className="flex items-center gap-space-sm pl-space-xs pr-space-md py-space-xs bg-surface-container-low hover:bg-surface-container rounded-full transition-colors cursor-pointer shadow-xs">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-xs">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
            <span className="hidden md:inline-block font-label-md text-label-md text-on-surface font-medium">
              Johnny Sins
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
