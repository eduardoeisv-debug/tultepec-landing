import { existsSync } from 'node:fs'
import { join } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// En dev, Vite responde 200 (sirviendo index.html) para cualquier ruta que
// no reconoce -- incluyendo fotos de /public/images que no existen. El
// álbum de fotos prueba varias extensiones por cada foto, así que sin este
// middleware cada intento fallido fuerza a Vite a armar la app completa en
// vez de fallar rápido, haciendo que las galerías tarden mucho en cargar
// solo en local (en producción Vercel ya responde 404 real).
function realNotFoundForImages() {
  return {
    name: 'real-404-for-images',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith('/images/')) {
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
  plugins: [react(), realNotFoundForImages()],
})
