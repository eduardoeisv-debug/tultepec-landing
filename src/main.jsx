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
import { LanguageProvider } from './i18n/LanguageContext.jsx'

// Cargado de forma diferida: casi nadie visita /moderar, así que su código
// (y el de Moderation.css) no debe viajar en el bundle que descarga todo
// visitante normal de la landing.
const Moderation = lazy(() => import('./pages/Moderation.jsx'))

const isModerationRoute = window.location.pathname.replace(/\/$/, '') === '/moderar'

// Por defecto, el navegador restaura la posición de scroll al recargar la
// página (no solo al usar atrás/adelante), lo que hacía que refrescar
// pareciera "mandar a la mitad". Se fuerza a que cada carga empiece arriba
// -- el router de hash (useHashRoute.js, "#/grupo/opcion") igual resuelve
// la vista correcta del panel antes del primer render, y ContentPanel.jsx
// ya sube el panel a la vista por su cuenta si hace falta.
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isModerationRoute ? (
      <Suspense fallback={null}>
        <Moderation />
      </Suspense>
    ) : (
      <LanguageProvider>
        <App />
      </LanguageProvider>
    )}
  </StrictMode>,
)
