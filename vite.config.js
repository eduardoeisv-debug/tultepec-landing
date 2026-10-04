import { existsSync } from 'node:fs'
import { join } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// En dev, Vite responde 200 (sirviendo index.html) para cualquier ruta que
// no reconoce -- incluyendo fotos de /public/images o videos de
// /public/videos que no existen. Los álbumes prueban varias extensiones
// por cada archivo, así que sin este middleware cada intento fallido fuerza
// a Vite a armar la app completa en vez de fallar rápido (y, para videos,
// hace que el badge de "ya hay contenido" aparezca aunque no haya nada). En
// producción Vercel ya responde 404 real.
function realNotFoundForMedia() {
  return {
    name: 'real-404-for-media',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith('/images/') || req.url?.startsWith('/videos/')) {
          const filePath = join(server.config.publicDir, req.url.split('?')[0])
          if (!existsSync(filePath)) {
            res.statusCode = 404
            res.end()
            return
          }
        }
        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), realNotFoundForMedia()],
})
