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
import { SoundProvider } from './hooks/useSound.jsx'

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

// Actualizar la página (F5, pull-to-refresh, "recargar" del navegador) debe
// mandar a Inicio aunque se estuviera en otra sección -- pero un enlace
// directo a una sección (compartido, escrito a mano, o un favorito) debe
// seguir abriendo ahí mismo, y atrás/adelante debe seguir funcionando. La
// Navigation Timing API distingue el tipo real de carga (`reload` vs
// `navigate` vs `back_forward`), así que solo se limpia el hash cuando de
// verdad fue un refresco -- replaceState en vez de solo vaciar el hash para
// no dejar un "#" suelto en la barra de direcciones ni agregar una entrada
// nueva al historial. Antes de montar React, para que useHashRoute.js lea
// el hash ya limpio en su primer render (sin parpadeo de la sección vieja).
if (!isModerationRoute) {
  const navegacion = performance.getEntriesByType('navigation')[0]
  if (navegacion?.type === 'reload' && window.location.hash && window.location.hash !== '#/') {
    window.history.replaceState(null, '', window.location.pathname + window.location.search)
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isModerationRoute ? (
      <Suspense fallback={null}>
        <Moderation />
      </Suspense>
    ) : (
      <LanguageProvider>
        <SoundProvider>
          <App />
        </SoundProvider>
      </LanguageProvider>
    )}
  </StrictMode>,
)
