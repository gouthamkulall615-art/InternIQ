import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource/geist-mono/300.css'
import './index.css'
import App from './App.jsx'
import MaintenancePage from './pages/MaintenancePage.jsx'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'

const isMaintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === 'true';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isMaintenanceMode ? (
      <MaintenancePage />
    ) : (
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    )}
  </StrictMode>,
)

