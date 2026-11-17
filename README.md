# Mis XV Años · Delfina

Invitación digital para los XV de Delfina. Sitio estático hecho con [Astro](https://astro.build), listo para publicar en Vercel.

## Dónde se cambia cada cosa

Casi todo está en **`src/config.ts`**:

| Qué | Dónde |
|---|---|
| Número de WhatsApp para confirmar | `confirmacion.whatsapp` (se puede escribir `+54 9 11 1234-5678`, con espacios o guiones) |
| Mensaje que se envía al confirmar | `confirmacion.mensaje` |
| Fecha límite para confirmar | `confirmacion.fechaLimite` (si queda vacío, no se muestra) |
| Fecha y hora de la fiesta | `evento.fechaISO` (formato `AAAA-MM-DDTHH:MM:00-03:00`) |
| Dirección y link de Google Maps | `evento.lugar.direccion` y `evento.lugar.mapsUrl` |
| Dress code, regalos, etc. | `extras` (cada bloque se muestra solo si está cargado) |
| Título y descripción de la vista previa | `sitio.titulo` y `sitio.descripcion` |

Después de cambiar algo, se guarda, se sube a GitHub y Vercel publica la nueva versión solo.

### Música

La canción está en `public/musica/a-thousand-years.mp3`. Para cambiarla:

1. Copiá el archivo nuevo en `public/musica/`, con un nombre sin espacios ni corchetes (por ejemplo `cancion.mp3`).
2. Poné ese nombre en `musica.archivo` en `src/config.ts`.

Si el archivo no está, la invitación se publica igual, sin botón de música.

Los navegadores de celular no dejan que el sonido arranque solo: la música empieza cuando el invitado toca el sello de "Abrir mi invitación". Donde el navegador sí lo permite, arranca apenas carga la página.

### Foto

La foto de la portada es `src/assets/delfina-recorte.png`: un PNG **sin fondo**, vertical (proporción 3:4). Para cambiarla, reemplazá ese archivo por otro con el mismo nombre y después regenerá la vista previa (ver abajo).

### Vista previa de WhatsApp

La imagen que aparece al compartir el link es `public/og/delfina-xv.jpg` (1200 × 630). Se genera con la foto y los datos de `config.ts`:

```bash
npm run og
```

Si cambiás la imagen después de haber compartido el link, subí el número de versión en `sitio.imagenOG` (`?v=1` → `?v=2`) para que WhatsApp la vuelva a descargar.

### Adornos

Las flores, rosas, mariposas y la tiara se recortan de la invitación original (`img/referencia/invitacion-original.jpg`). Para volver a generarlos: `npm run adornos`.

## Probar en la compu

```bash
npm install
npm run dev
```

Y abrí http://localhost:4321.

## Publicar en Vercel

1. En [vercel.com](https://vercel.com) → **Add New… → Project** → importá el repo `invitacion-xv`.
2. Vercel detecta Astro solo. No hace falta configurar nada más: la URL de producción se toma automáticamente para la vista previa.
3. **Dominio propio (opcional):** agregalo en *Settings → Domains* y creá la variable de entorno `SITE_URL` con la dirección completa (por ejemplo `https://xvdelfi.com.ar`). Después volvé a publicar.

## Probar la vista previa antes de mandarla

1. Abrí el [Depurador de Meta](https://developers.facebook.com/tools/debug/), pegá el link y tocá **Volver a extraer**. Tiene que mostrar el título, la descripción y la imagen.
2. Mandate el link por WhatsApp a vos mismo. **Esperá a que aparezca la tarjeta antes de tocar enviar**: si se envía antes, el mensaje sale sin vista previa.
3. En los mensajes personalizados, poné el link en el texto: WhatsApp arma la tarjeta con el primer link que encuentra.

Hay que tener en cuenta que:

- La tarjeta la arma el celular de quien envía, en ese momento. Una vez enviada, ya no cambia.
- WhatsApp guarda la vista previa en caché. Si cambiás la imagen, agregá `?v=2` al final del link para forzar una nueva.
- No se puede controlar al 100 %: según el teléfono, la imagen puede salir más chica o recortada.
