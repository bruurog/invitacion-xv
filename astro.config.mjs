// @ts-check
import { defineConfig } from 'astro/config';

// URL pública del sitio: la usan la vista previa de WhatsApp (og:url, og:image)
// y el link canónico. Orden de prioridad:
//   1. SITE_URL (variable de entorno, ej. un dominio propio)
//   2. VERCEL_PROJECT_PRODUCTION_URL (Vercel la define sola al compilar)
//   3. localhost (solo para desarrollo)
const site =
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:4321');

if (site.startsWith('http://localhost') && process.env.VERCEL) {
  console.warn('[invitacion] Falta la URL de producción: la vista previa de WhatsApp no va a funcionar.');
}

export default defineConfig({
  site,
  trailingSlash: 'ignore',
  build: { inlineStylesheets: 'always' },
  devToolbar: { enabled: false },
});
