import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

type Persona = {
  id: string;
  title: string;
  username: string;
  short: string;
};

const personas: Persona[] = [
  {
    id: 'gis-officer',
    title: 'GIS Officer',
    username: 'gis.officer',
    short: 'LiDAR / GIS processing',
  },
  {
    id: 'land-authority',
    title: 'Land Authority',
    username: 'land.authority',
    short: 'Cadastral review',
  },
  {
    id: 'system-admin',
    title: 'System Admin',
    username: 'system.admin',
    short: 'Platform administration',
  },
  {
    id: 'urban-planner',
    title: 'Urban Planner',
    username: 'urban.planner',
    short: '3D GIS exploration',
  },
  {
    id: 'review-officer',
    title: 'Review Officer',
    username: 'review.officer',
    short: 'Discrepancy review',
  },
  {
    id: 'public-citizen',
    title: 'Public Citizen',
    username: 'citizen.demo',
    short: 'Property search',
  },
];

function Login() {
  const navigate = useNavigate();

  const [selectedPersona, setSelectedPersona] = useState(personas[0]);
  const [username, setUsername] = useState(personas[0].username);
  const [password, setPassword] = useState('bhulok-demo');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const authenticated =
      localStorage.getItem('bhulok_authenticated') === 'true' ||
      sessionStorage.getItem('bhulok_authenticated') === 'true';

    if (authenticated) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const selectPersona = (persona: Persona) => {
    setSelectedPersona(persona);
    setUsername(persona.username);
    setPassword('bhulok-demo');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      return;
    }

    setLoading(true);

    window.setTimeout(() => {
      const storage = remember ? localStorage : sessionStorage;

      storage.setItem('bhulok_authenticated', 'true');
      storage.setItem('bhulok_persona', selectedPersona.id);
      storage.setItem('bhulok_username', username);

      setLoading(false);

      navigate('/', { replace: true });
    }, 500);
  };

  return (
    <main className="bhulok-login-page">
      <div className="login-grid-background" />

      <div className="login-container">

        {/* =====================================================
            LEFT SIDE
        ====================================================== */}

        <section className="login-hero">

          <header className="login-brand">

            <div className="bhulok-logo">
              <div className="logo-blue" />
              <div className="logo-green" />
            </div>

            <div>
              <div className="brand-title">BhuLok</div>
              <div className="brand-subtitle">
                3D Digital Cadastre &amp; Registry
              </div>
            </div>

          </header>

          <div className="hero-content">

            <div className="hero-badge">
              <span />
              NEXT-GEN SPATIAL PARCELING
              <b>|</b>
              V2.4
            </div>

            <h1>
              From Land to
              <br />
              <span>3D Property Identity</span>
            </h1>

            <p className="hero-description">
              Visualize, manage, and verify three-dimensional property
              identities through a structured spatial workspace for
              land administration, urban planning and property mapping.
            </p>

            <div className="hero-features">

              <div className="hero-feature">
                <div className="feature-icon">⌖</div>
                <div>
                  <strong>3D Spatial Mapping</strong>
                  <span>Accurate &amp; structured</span>
                </div>
              </div>

              <div className="hero-feature">
                <div className="feature-icon">▱</div>
                <div>
                  <strong>Multi-level 3D Models</strong>
                  <span>Buildings · Floors · Units</span>
                </div>
              </div>

              <div className="hero-feature">
                <div className="feature-icon">◇</div>
                <div>
                  <strong>3D ULPIN Ready</strong>
                  <span>Structured property identity</span>
                </div>
              </div>

            </div>

          </div>

          {/* =================================================
              3D PROPERTY VISUAL
          ================================================== */}

          <div className="property-visual">

            <div className="visual-glow" />

            <div className="city-layer city-back">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>

            <div className="parcel-ground">

              <div className="road road-a" />
              <div className="road road-b" />

              <div className="parcel-line parcel-a" />
              <div className="parcel-line parcel-b" />
              <div className="parcel-line parcel-c" />

              <div className="building">

                <div className="building-roof">
                  <div className="roof-unit" />
                </div>

                <div className="building-floor floor-four">
                  <span /><span /><span /><span />
                </div>

                <div className="building-floor floor-three">
                  <span /><span /><span /><span />
                </div>

                <div className="building-floor floor-two">
                  <span /><span /><span /><span />
                </div>

                <div className="building-floor floor-one">
                  <span /><span /><span /><span />
                </div>

              </div>

              {/* 3D Building label */}

              <div className="floating-card building-card">
                <div className="floating-icon">▣</div>

                <div>
                  <strong>3D Building Model</strong>
                  <span>Floors · Units · Volume</span>
                </div>
              </div>

              {/* Parcel label */}

              <div className="floating-card parcel-card">
                <div className="floating-icon green">⌖</div>

                <div>
                  <strong>Parcel Boundary</strong>
                  <span>Structured spatial boundary</span>
                </div>
              </div>

              {/* ULPIN label */}

              <div className="floating-card ulpin-card">
                <div className="floating-icon">◇</div>

                <div>
                  <strong>ULPIN-3D-001</strong>
                  <span>Property Identity</span>
                </div>
              </div>

            </div>

          </div>

          <div className="hero-stats">

            <div>
              <strong>3D</strong>
              <span>Spatial Mapping</span>
            </div>

            <div>
              <strong>24</strong>
              <span>Spatial Units</span>
            </div>

            <div>
              <strong>01</strong>
              <span>Unified Registry</span>
            </div>

            <div>
              <strong>AI</strong>
              <span>Spatial Intelligence</span>
            </div>

          </div>

        </section>

        {/* =====================================================
            RIGHT LOGIN
        ====================================================== */}

        <section className="login-panel">

          <div className="login-panel-inner">

            <div className="login-heading">

              <div className="secure-badge">
                ✦ SECURE ACCESS
              </div>

              <h2>
                Welcome back to <span>BhuLok</span>
              </h2>

              <p>
                Sign in to access your projects, 3D spatial maps,
                and cadastral workspace based on your authorized role.
              </p>

            </div>

            <div className="role-heading">
              <strong>Select your role</strong>
              <span>
                Choose the persona that best describes your access level.
              </span>
            </div>

            <div className="persona-grid">

              {personas.map((persona) => (

                <button
                  key={persona.id}
                  type="button"
                  className={`persona ${
                    selectedPersona.id === persona.id
                      ? 'persona-active'
                      : ''
                  }`}
                  onClick={() => selectPersona(persona)}
                >

                  <div className="persona-icon">
                    {persona.id === 'gis-officer' && '⌖'}
                    {persona.id === 'land-authority' && '▥'}
                    {persona.id === 'system-admin' && '⚙'}
                    {persona.id === 'urban-planner' && '⌗'}
                    {persona.id === 'review-officer' && '▤'}
                    {persona.id === 'public-citizen' && '♙'}
                  </div>

                  <div className="persona-text">
                    <strong>{persona.title}</strong>
                    <span>{persona.short}</span>
                  </div>

                  <div className="persona-radio">
                    {selectedPersona.id === persona.id && '✓'}
                  </div>

                </button>

              ))}

            </div>

            <form onSubmit={handleSubmit} className="login-form">

              <label>
                Government Username / Email

                <div className="login-input">

                  <span>♙</span>

                  <input
                    value={username}
                    onChange={(event) =>
                      setUsername(event.target.value)
                    }
                    placeholder="Enter your username or email"
                    autoComplete="username"
                  />

                </div>
              </label>

              <label>
                Password

                <div className="login-input">

                  <span>⌑</span>

                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="show-password"
                    onClick={() =>
                      setShowPassword((value) => !value)
                    }
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>

                </div>
              </label>

              <div className="login-options">

                <label className="remember">

                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(event) =>
                      setRemember(event.target.checked)
                    }
                  />

                  <span>Remember session (24h)</span>

                </label>

                <button
                  type="button"
                  className="reset-link"
                  onClick={() => {
                    setUsername(selectedPersona.username);
                    setPassword('bhulok-demo');
                  }}
                >
                  Reset credentials
                </button>

              </div>

              <button
                type="submit"
                className="signin-button"
                disabled={loading}
              >
                <span>
                  {loading
                    ? 'Authenticating...'
                    : 'Sign in to BhuLok'}
                </span>

                <strong>→</strong>
              </button>

            </form>

            <div className="authorization-note">

              <div className="authorization-icon">
                ✓
              </div>

              <div>
                <strong>Authorized BhuLok workspace</strong>

                <span>
                  Demo authentication is enabled for project
                  evaluation and presentation.
                </span>
              </div>

            </div>

          </div>

          <footer className="login-footer">
            <span>© 2026 BhuLok</span>
            <span>3D Digital Cadastre</span>
            <span>Spatial Intelligence Platform</span>
          </footer>

        </section>

      </div>
    </main>
  );
}

export default Login;