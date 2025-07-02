// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import LoginAdmin from './pages/LoginAdmin';
import Admin from './pages/Admin';
import PendaftaranPasien from './pages/PendaftaranPasien';
import PrivateRoute from './components/PrivateRoute'; // Impor PrivateRoute

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/loginadmin" element={<LoginAdmin />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        />
        <Route path="/pendaftaranpasien" element={<PendaftaranPasien />} />
      </Routes>
    </Router>
  );
}

export default App;