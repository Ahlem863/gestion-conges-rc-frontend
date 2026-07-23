import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DeclarerRC from './pages/DeclarerRC';
import ValidationRC from './pages/ValidationRC';
import ValidationRCH from './pages/ValidationRCH';
import CongesInfo from './pages/CongesInfo';
import EspaceRH from './pages/EspaceRH';
import Employes from './pages/Employes';
import Recuperation from './pages/Recuperation';
import Statistiques from './pages/Statistiques';
import Rapports from './pages/Rapports';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/declarer" element={<ProtectedRoute><DeclarerRC /></ProtectedRoute>} />
          <Route path="/validation" element={<ProtectedRoute><ValidationRC /></ProtectedRoute>} />
          <Route path="/rh" element={<ProtectedRoute><EspaceRH /></ProtectedRoute>} />
          <Route path="/rh/employes" element={<ProtectedRoute><Employes /></ProtectedRoute>} />
          <Route path="/rh/validation-rc" element={<ProtectedRoute><ValidationRCH /></ProtectedRoute>} />
          <Route path="/rh/conges-info" element={<ProtectedRoute><CongesInfo /></ProtectedRoute>} />
          <Route path="/rh/recuperation" element={<ProtectedRoute><Recuperation /></ProtectedRoute>} />
          <Route path="/rh/statistiques" element={<ProtectedRoute><Statistiques /></ProtectedRoute>} />
          <Route path="/rh/rapports" element={<ProtectedRoute><Rapports /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;