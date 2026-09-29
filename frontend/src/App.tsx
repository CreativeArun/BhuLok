import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateProject from './pages/CreateProject';
import Property3D from './pages/Property3D';
import PropertyReport from './pages/PropertyReport';
import Map3D from './pages/Map3D';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/map" element={<Map3D />} />
        <Route path="/3d-map" element={<Map3D />} />
        <Route path="/property-report" element={<PropertyReport />} />
        <Route path="/projects/:projectId/report" element={<PropertyReport />} />
        <Route path="/projects/:projectId/3d" element={<Property3D />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
