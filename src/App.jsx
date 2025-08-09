import React from 'react'
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import CalendarPage from './pages/CalendarPage.jsx'
import SessionPage from './pages/SessionPage.jsx'
import TemplatesPage from './pages/TemplatesPage.jsx'
import AnalyticsPage from './pages/AnalyticsPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import { AppProvider } from './context.jsx'

export default function App() {
  return (
    <AppProvider>
      <div className="layout">
        <nav className="nav">
          <h1>Fitness Tracker</h1>
          <NavLink to="/" end>Calendar</NavLink>
          <NavLink to="/analytics">Analytics</NavLink>
          <NavLink to="/templates">Templates</NavLink>
          <NavLink to="/settings">Settings</NavLink>
        </nav>
        <main className="content">
          <Routes>
            <Route path="/" element={<CalendarPage />} />
            <Route path="/session/:id" element={<SessionPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </AppProvider>
  )
}
