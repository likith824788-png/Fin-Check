import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import Header from '../header/Header';

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    /*
     * Root shell is fully transparent so the finance background image
     * (coins, charts, graphs) shows clearly through all panels.
     */
    <div className="min-h-screen flex font-sans" style={{ background: 'transparent' }}>
      {/* Sidebar — glassmorphism via .sidebar-glass */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main — offset by sidebar width */}
      <div className="lg:pl-64 flex flex-col flex-1 min-h-screen" style={{ background: 'transparent' }}>
        {/* Header — glassmorphism via .header-glass */}
        <Header onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

        {/* Page content — transparent, cards handle their own glass */}
        <main
          className="flex-1 p-4 lg:p-7 max-w-7xl w-full mx-auto"
          style={{ background: 'transparent' }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
