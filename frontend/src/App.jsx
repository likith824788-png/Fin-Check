import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Documents from './pages/Documents/Documents';
import Analysis from './pages/Analysis/Analysis';
import FinancialFacts from './pages/FinancialFacts/FinancialFacts';
import Consistency from './pages/Consistency/Consistency';
import Findings from './pages/Findings/Findings';
import FindingDetails from './pages/FindingDetails/FindingDetails';
import Evidence from './pages/Evidence/Evidence';
import AIAuditor from './pages/AIAuditor/AIAuditor';
import Reports from './pages/Reports/Reports';
import Profile from './pages/Profile/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Authentication routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Authenticated Workspace routes with persistent sidebar & header */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="documents" element={<Documents />} />
          <Route path="upload" element={<Navigate to="/documents?upload=true" replace />} />
          <Route path="analysis" element={<Analysis />} />
          <Route path="facts" element={<FinancialFacts />} />
          <Route path="consistency" element={<Consistency />} />
          <Route path="findings" element={<Findings />} />
          <Route path="findings/:id" element={<FindingDetails />} />
          <Route path="evidence/:id" element={<Evidence />} />
          <Route path="ai-auditor" element={<AIAuditor />} />
          <Route path="reports" element={<Reports />} />
          <Route path="reports/:id" element={<Reports />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Navigate to="/profile" replace />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
