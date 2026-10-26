/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PortfolioProvider } from './context/PortfolioContext';
import { PublicPortfolioPage } from './pages/PublicPortfolioPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { APP_CONFIG } from './config/appConfig';

export default function App() {
  // Support optional subdomain routing (e.g. admin.mydomain.com)
  const isSubdomain =
    typeof window !== 'undefined' &&
    APP_CONFIG.isSubdomainDeployment &&
    window.location.hostname === APP_CONFIG.adminSubdomainHostname;

  return (
    <AuthProvider>
      <PortfolioProvider>
        <BrowserRouter>
          <Routes>
            {isSubdomain ? (
              <>
                <Route path="/" element={<AdminDashboardPage />} />
                <Route path="/login" element={<AdminLoginPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            ) : (
              <>
                {/* Public Portfolio Route Tree */}
                <Route path="/" element={<PublicPortfolioPage />} />

                {/* Dedicated Protected Admin Route Tree */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/admin/*" element={<AdminDashboardPage />} />

                {/* Catch-all Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </PortfolioProvider>
    </AuthProvider>
  );
}
