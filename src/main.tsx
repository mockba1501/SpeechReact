import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import AppRoutes from './routes'

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Failed to find the root element");

createRoot(rootElement).render(
  <StrictMode>
   {/* <AppRoutes>
      <App /> */}
    <AppRoutes/>
  </StrictMode>,
)
