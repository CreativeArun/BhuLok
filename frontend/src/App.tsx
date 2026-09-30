import { Navigate, Route, Routes, BrowserRouter } from 'react-router-dom';

import Login from './pages/Login';
import Home from './pages/Home';
import CreateProject from './pages/CreateProject';
import Property3D from './pages/Property3D';
import PropertyReport from './pages/PropertyReport';
import Map3D from './pages/Map3D';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const authenticated =
    localStorage.getItem('bhulok_authenticated') === 'true' ||
    sessionStorage.getItem('bhulok_authenticated') === 'true';

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public authentication */}
        <Route path="/login" element={<Login />} />

        {/* Protected BhuLok workspace */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-project"
          element={
            <ProtectedRoute>
              <CreateProject />
            </ProtectedRoute>
          }
        />

        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <Map3D />
            </ProtectedRoute>
          }
        />

        <Route
          path="/3d-map"
          element={
            <ProtectedRoute>
              <Map3D />
            </ProtectedRoute>
          }
        />

        <Route
          path="/property-report"
          element={
            <ProtectedRoute>
              <PropertyReport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:projectId/report"
          element={
            <ProtectedRoute>
              <PropertyReport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:projectId/3d"
          element={
            <ProtectedRoute>
              <Property3D />
            </ProtectedRoute>
          }
        />

        {/* Unknown route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;