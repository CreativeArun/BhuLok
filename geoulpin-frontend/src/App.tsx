import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateProject from './pages/CreateProject';
import Property3D from './pages/Property3D';
import PropertyReport from './pages/PropertyReport';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/3d-map" element={<Property3D />} />
        <Route path="/property-report" element={<PropertyReport />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
