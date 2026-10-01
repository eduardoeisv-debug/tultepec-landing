import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/fraunces/400.css'
import '@fontsource/fraunces/500.css'
import '@fontsource/fraunces/500-italic.css'
import '@fontsource/fraunces/600.css'
import '@fontsource/fraunces/700.css'
import '@fontsource/work-sans/400.css'
import '@fontsource/work-sans/500.css'
import '@fontsource/work-sans/600.css'
import '@fontsource/work-sans/700.css'
import './index.css'
import App from './App.jsx'

// Cargado de forma diferida: casi nadie visita /moderar, así que su código
// (y el de Moderation.css) no debe viajar en el bundle que descarga todo
// visitante normal de la landing.
const Moderation = lazy(() => import('./pages/Moderation.jsx'))

const isModerationRoute = window.location.pathname.replace(/\/$/, '') === '/moderar'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isModerationRoute ? (
      <Suspense fallback={null}>
        <Moderation />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>,
)
