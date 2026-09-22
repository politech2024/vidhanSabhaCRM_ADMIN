import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import { useAuth } from './hooks/useAuth';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { DistrictsPage } from './pages/DistrictsPage';
import { AssembliesPage } from './pages/AssembliesPage';
import { BlocksPage } from './pages/BlocksPage';
import { ZonesPage } from './pages/ZonesPage';
import { MandalsPage } from './pages/MandalsPage';
import { PanchayatsPage } from './pages/PanchayatsPage';
import { BoothsPage } from './pages/BoothsPage';

function Header() {
  const { user, logout } = useAuth();
  if (!user) return null;
  return (
    <header className="flex items-center justify-between border-b border-brand-border bg-brand-surface px-6 py-3">
      <span className="text-sm font-medium text-brand-text">Vidhan Sabha CRM — Admin</span>
      <div className="flex items-center gap-3 text-sm text-brand-text-secondary">
        <span>{user.email}</span>
        <button onClick={logout} className="rounded-md px-2 py-1 font-medium text-brand-blue hover:bg-brand-bg">
          Sign out
        </button>
      </div>
    </header>
  );
}

function App() {
  return (
    <AuthProvider>
      <Header />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/districts" replace />} />
          <Route path="/districts" element={<DistrictsPage />} />
          <Route path="/districts/:districtId/assemblies" element={<AssembliesPage />} />
          <Route path="/assemblies/:assemblyNumber/blocks" element={<BlocksPage />} />
          <Route path="/blocks/:blockId/zones" element={<ZonesPage />} />
          <Route path="/zones/:zoneId/mandals" element={<MandalsPage />} />
          <Route path="/mandals/:mandalId/panchayats" element={<PanchayatsPage />} />
          <Route path="/panchayats/:panchayatId/booths" element={<BoothsPage />} />
          <Route path="*" element={<Navigate to="/districts" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
