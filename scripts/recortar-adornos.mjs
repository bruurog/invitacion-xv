// Recorta los adornos (flores, rosas, tiara, mariposas) de la invitación original
// y les difumina los bordes para que se fundan con el fondo rosa de la web.
// Uso: npm run adornos
// Resultado: src/assets/adornos/*.webp
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const ORIGEN = 'img/referencia/invitacion-original.jpg';
const DESTINO = 'src/assets/adornos';
const ESCALA = 2; // la original es chica: se amplía con buen filtro
const BORDE_SUAVE = 0.06; // fracción difuminada en los bordes no indicados

// x, y, w, h: recorte en píxeles de la original (900 × 1599)
// fade: fracción de cada borde (t, r, b, l) que se difumina
const adornos = [
  { nombre: 'rama-sup-izq', x: 0, y: 0, w: 125, h: 390, fade: { r: 0.5, b: 0.35 } },
  { nombre: 'rama-sup-der', x: 772, y: 150, w: 128, h: 390, fade: { l: 0.5, t: 0.25, b: 0.3 } },
  { nombre: 'rama-media-izq', x: 0, y: 625, w: 118, h: 430, fade: { r: 0.5, t: 0.2, b: 0.25 } },
  { nombre: 'rama-media-der', x: 782, y: 880, w: 118, h: 320, fade: { l: 0.5, t: 0.25, b: 0.25 } },
  { nombre: 'rosa-inf-izq', x: 0, y: 1290, w: 150, h: 309, fade: { r: 0.4, t: 0.3 } },
  { nombre: 'rosa-inf-der', x: 750, y: 1290, w: 150, h: 309, fade: { l: 0.4, t: 0.3 } },
  { nombre: 'corona', x: 330, y: 596, w: 210, h: 122, radial: true },
  { nombre: 'mariposa-izq', x: 0, y: 968, w: 152, h: 170, radial: true },
  { nombre: 'mariposa-der', x: 760, y: 1030, w: 140, h: 152, radial: true },
];

function mascara({ w, h, fade = {}, radial }) {
  if (radial) {
    const blur = Math.min(w, h) * 0.09;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
      <filter id="f" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${blur}"/></filter>
      <ellipse cx="${w / 2}" cy="${h / 2}" rx="${w * 0.4}" ry="${h * 0.4}" fill="#fff" filter="url(#f)"/></svg>`;
  }
  // Producto de dos gradientes (horizontal × vertical)
  const { t = BORDE_SUAVE, r = BORDE_SUAVE, b = BORDE_SUAVE, l = BORDE_SUAVE } = fade;
  const stop = (o, a) => `<stop offset="${o}" stop-color="#fff" stop-opacity="${a}"/>`;
  const stopsH = [stop(0, 0), stop(l, 1), stop(1 - r, 1), stop(1, 0)].join('');
  const stopsV = [stop(0, 0), stop(t, 1), stop(1 - b, 1), stop(1, 0)].join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <linearGradient id="h" x1="0" y1="0" x2="1" y2="0">${stopsH}</linearGradient>
      <linearGradient id="v" x1="0" y1="0" x2="0" y2="1">${stopsV}</linearGradient>
      <mask id="m"><rect width="${w}" height="${h}" fill="url(#v)"/></mask>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#h)" mask="url(#m)"/></svg>`;
}

await mkdir(DESTINO, { recursive: true });
for (const a of adornos) {
  const W = a.w * ESCALA;
  const H = a.h * ESCALA;
  const recorte = await sharp(ORIGEN)
    .extract({ left: a.x, top: a.y, width: a.w, height: a.h })
    .resize(W, H, { kernel: 'lanczos3' })
    .sharpen({ sigma: 0.8 })
    .ensureAlpha()
    .toBuffer();
  const m = await sharp(Buffer.from(mascara({ ...a, w: W, h: H }))).resize(W, H).png().toBuffer();
  await sharp(recorte)
    .composite([{ input: m, blend: 'dest-in' }])
    .webp({ quality: 82, alphaQuality: 90 })
    .toFile(`${DESTINO}/${a.nombre}.webp`);
  console.log('ok', a.nombre);
}
