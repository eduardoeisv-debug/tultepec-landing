---
name: deploy-verify
description: Use when the user asks to deploy, publish, or ship a change to the Tultepec landing page (tultepec-landing on Vercel) — covers the full flow of testing locally with Playwright, deploying with the Vercel CLI, verifying production, and committing to git.
---

# Deploy y verificación — Tultepec landing

Este proyecto (`tultepec-landing` en Vercel) no tiene auto-deploy conectado a git:
cada cambio se despliega manualmente con el CLI de Vercel. Sigue estos pasos
en orden, sin saltarte la verificación visual — nunca reportes un cambio como
terminado solo por "no hay errores en consola".

## 1. Probar localmente antes de desplegar

1. Verifica si ya hay un servidor de Vite corriendo antes de lanzar otro
   (`npm run dev` detecta el puerto libre automáticamente, pero evita acumular
   procesos huérfanos — si vas a iniciar uno nuevo, considera matar los viejos
   primero: en Windows, `taskkill //F //IM node.exe` si se han acumulado
   muchos).
2. Arranca `npm run dev` en segundo plano y toma el puerto que reporte.
3. Usa Playwright (vía un script `.mjs` en el scratchpad) para:
   - Navegar a la página y esperar `networkidle`.
   - Tomar capturas de la sección que cambiaste, en escritorio (1280px) y
     móvil (`devices["iPhone 13"]`).
   - Si el cambio toca animaciones con scroll-reveal, haz scroll lento
     (incrementos pequeños con `waitForTimeout` entre cada uno) — un scroll
     rápido no le da tiempo al `IntersectionObserver` y puede dar falsos
     negativos.
4. Revisa las capturas con la herramienta Read antes de continuar.
5. Limpia los archivos `.png` temporales y mata el servidor de dev
   (`pkill -f "vite"`) antes de desplegar.

## 2. Desplegar

```
npx vercel --yes --prod
```

Si falla con `"Not authorized"` o un error similar, es transitorio — reintenta
el mismo comando una vez antes de investigar más a fondo.

## 3. Verificar en producción

- Primero, un chequeo rápido sin bypass: `curl -s -o /dev/null -w "%{http_code}\n" https://tultepec-landing.vercel.app/`
  debe devolver `302` (el sitio está protegido con Vercel Authentication —
  esto es lo esperado, no un error).
- Si necesitas ver contenido real (capturas, revisar que una imagen cargue,
  etc.), habilita el bypass de protección:
  ```
  npx vercel project protection enable tultepec-landing --protection-bypass --json
  ```
  Toma el secreto de la respuesta (o de `npx vercel project protection tultepec-landing --json`)
  y pásalo como header `x-vercel-protection-bypass` en tus pruebas con
  Playwright (junto con `x-vercel-set-bypass-cookie: true`).
- **Siempre deshabilita el bypass al terminar**, incluso si la sesión sigue
  activa:
  ```
  npx vercel project protection disable tultepec-landing --protection-bypass --protection-bypass-secret <secreto>
  ```

## 4. Commit a git

Solo si el usuario no ha pedido explícitamente lo contrario. Mensaje en
inglés, formato establecido en este repo (línea de resumen + cuerpo breve
explicando el *por qué*, no solo el *qué*), terminando con la línea de
atribución que pida el recordatorio del sistema. Verifica `git status`
antes de `git add` para no incluir archivos sueltos de pruebas (capturas,
scripts `.mjs` de scratchpad) que deberían quedarse fuera del repo.

## Notas del proyecto

- El bypass de protección es un secreto temporal — nunca lo dejes en el
  código ni en commits, solo úsalo en comandos de verificación puntuales.
- Las fotos de las galerías usan extensiones variadas (`.jpg`, `.jfif`,
  `.png`); ver el skill `gallery-photo` para ese flujo específico.
