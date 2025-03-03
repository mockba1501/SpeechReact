import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import MainMenu from './pages/MainMenu.jsx'
import AppRoutes from './routes.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRoutes>
    <MainMenu />
    </AppRoutes>
  </StrictMode>,
)
