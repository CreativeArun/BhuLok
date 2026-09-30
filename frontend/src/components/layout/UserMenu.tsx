import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PERSONAS: Record<string, string> = {
  'gis-officer': 'GIS Officer',
  'land-authority': 'Land Authority',
  'system-admin': 'System Admin',
  'urban-planner': 'Urban Planner',
  'review-officer': 'Review Officer',
  'public-citizen': 'Public Citizen',
};

const UserMenu = () => {
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);

  const personaId =
    localStorage.getItem('bhulok_persona') ||
    sessionStorage.getItem('bhulok_persona') ||
    'gis-officer';

  const username =
    localStorage.getItem('bhulok_username') ||
    sessionStorage.getItem('bhulok_username') ||
    'gis.officer';

  const role = PERSONAS[personaId] || 'BhuLok User';

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick
      );
    };
  }, []);

  const logout = () => {
    // Local storage
    localStorage.removeItem('bhulok_authenticated');
    localStorage.removeItem('bhulok_persona');
    localStorage.removeItem('bhulok_username');

    // Session storage
    sessionStorage.removeItem('bhulok_authenticated');
    sessionStorage.removeItem('bhulok_persona');
    sessionStorage.removeItem('bhulok_username');

    setOpen(false);

    navigate('/login', {
      replace: true,
    });
  };

  return (
    <div
      ref={menuRef}
      className="relative"
    >
      {/* User button */}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-space-sm pl-space-xs pr-space-md py-space-xs bg-surface-container-low hover:bg-surface-container rounded-full transition-colors cursor-pointer shadow-xs"
      >
        {/* Avatar */}

        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-xs">
          <span className="material-symbols-outlined text-[18px]">
            person
          </span>
        </div>

        {/* Name */}

        <span className="hidden md:inline-block font-label-md text-label-md text-on-surface font-medium">
          {role}
        </span>

        {/* Arrow */}

        <span className="material-symbols-outlined text-[17px] text-on-surface-variant">
          {open ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {/* Dropdown */}

      {open && (
        <div
          className="absolute right-0 top-[calc(100%+10px)] w-64 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-[0_18px_45px_rgba(20,45,90,0.16)] p-2 z-[100]"
        >

          {/* User information */}

          <div className="px-3 py-3 border-b border-outline-variant mb-1">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary">
                <span className="material-symbols-outlined">
                  person
                </span>
              </div>

              <div className="min-w-0">

                <p className="text-sm font-semibold text-on-surface truncate">
                  {role}
                </p>

                <p className="text-xs text-on-surface-variant truncate mt-0.5">
                  {username}
                </p>

              </div>

            </div>

          </div>

          {/* Profile */}

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[19px]">
              account_circle
            </span>

            <span>Profile</span>
          </button>

          {/* Settings */}

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[19px]">
              settings
            </span>

            <span>Account Settings</span>
          </button>

          <div className="h-px bg-outline-variant my-1" />

          {/* Logout */}

          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm text-error hover:bg-error-container transition-colors"
          >
            <span className="material-symbols-outlined text-[19px]">
              logout
            </span>

            <span className="font-semibold">
              Logout
            </span>
          </button>

        </div>
      )}
    </div>
  );
};

export default UserMenu;