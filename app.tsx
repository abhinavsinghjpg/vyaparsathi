import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './system/auth/frontend/AuthContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ProtectedRoute } from './components/ProtectedRoute';

// Feature Pages
import { LandingPage } from './features/landing/frontend/LandingPage';
import { AIAdvisorPage } from './features/ai-advisor/frontend/AIAdvisorPage';
import { BusinessFinderPage } from './features/business-finder/frontend/BusinessFinderPage';
import { MapExplorerPage } from './features/map-explorer/frontend/MapExplorerPage';
import { FranchisesPage } from './features/franchises/frontend/FranchisesPage';
import { PropertiesPage } from './features/properties/frontend/PropertiesPage';
import { AnalyticsPage } from './features/analytics/frontend/AnalyticsPage';
import { OwnerDashboardPage } from './features/owner-dashboard/frontend/OwnerDashboardPage';
import { LoansPage } from './features/loans/frontend/LoansPage';

// System Pages
import { LoginPage } from './system/auth/frontend/LoginPage';

function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  // Full-page routes (no sidebar/header wrapper on landing page)
  const isLandingPage = location.pathname === '/';

  if (isLandingPage) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground overflow-hidden">
      <div className="flex flex-1 overflow-hidden h-full">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
          <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
          <main className="flex-1 pb-16">{children}</main>
        </div>
      </div>
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/ai-advisor" element={<AIAdvisorPage />} />
            <Route path="/find-business" element={<BusinessFinderPage />} />
            <Route path="/map" element={<MapExplorerPage />} />
            <Route path="/franchises" element={<FranchisesPage />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/loans" element={<LoansPage />} />
            <Route
              path="/owner/dashboard"
              element={
                <ProtectedRoute>
                  <OwnerDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

