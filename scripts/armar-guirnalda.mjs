// Arma la guirnalda horizontal de flores del final (rosas, flores de cerezo y ramas)
// con piezas recortadas de la invitación original.
// Uso: npm run guirnalda   → src/assets/adornos/guirnalda.webp
import sharp from 'sharp';

const ORIGEN = 'img/referencia/invitacion-original.jpg';
const DESTINO = 'src/assets/adornos/guirnalda.webp';
const ESCALA = 2; // la original es chica: se amplía con buen filtro
const W = 760; // tamaño de la guirnalda, en píxeles de la original
const H = 230;
const DIFUMINADO = 0.3; // fracción de arriba que se difumina (corta = "bien cerrada")

// Piezas: recorte de la original (x, y, w, h), giro, espejo, escala y posición (abajo a la izquierda)
// borde: fracción difuminada de cada lado de la pieza
const piezas = [
  // Ramas de cerezo acostadas (van atrás)
  { x: 0, y: 630, w: 112, h: 430, giro: 90, escala: 0.95, en: [150, H - 2], borde: 0.22 },
  { x: 0, y: 0, w: 112, h: 380, giro: -90, escala: 0.95, en: [350, H + 4], borde: 0.22 },
  { x: 788, y: 1150, w: 112, h: 240, giro: 90, escala: 1, en: [520, H - 4], borde: 0.22 },
  // Flores de cerezo
  { x: 4, y: 1488, w: 124, h: 111, escala: 0.95, en: [92, H + 2], borde: 0.2 },
  { x: 4, y: 1488, w: 124, h: 111, espejo: true, escala: 0.85, en: [W - 250, H + 4], borde: 0.2 },
  // Rosas (van adelante)
  { x: 0, y: 1325, w: 142, h: 178, espejo: true, escala: 0.82, en: [W / 2 - 58, H + 6], borde: 0.16 },
  { x: 0, y: 1325, w: 142, h: 178, escala: 1.05, en: [-14, H + 8], borde: 0.14 },
  { x: 748, y: 1385, w: 152, h: 192, escala: 0.98, en: [W - 140, H + 12], borde: 0.14 },
];

const mascaraPieza = (w, h, b) => {
  const stop = (o, a) => `<stop offset="${o}" stop-color="#fff" stop-opacity="${a}"/>`;
  const grad = [stop(0, 0), stop(b, 1), stop(1 - b, 1), stop(1, 0)].join('');
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <linearGradient id="h" x1="0" y1="0" x2="1" y2="0">${grad}</linearGradient>
      <linearGradient id="v" x1="0" y1="0" x2="0" y2="1">${grad}</linearGradient>
      <mask id="m"><rect width="${w}" height="${h}" fill="url(#v)"/></mask>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#h)" mask="url(#m)"/></svg>`);
};

const capas = [];
for (const p of piezas) {
  let img = sharp(ORIGEN).extract({ left: p.x, top: p.y, width: p.w, height: p.h });
  if (p.giro) img = img.rotate(p.giro);
  if (p.espejo) img = img.flop();
  const girada = await img.png().toBuffer();
  const meta = await sharp(girada).metadata();
  const ancho = Math.round(meta.width * p.escala * ESCALA);
  const alto = Math.round(meta.height * p.escala * ESCALA);
  const mascara = await sharp(mascaraPieza(ancho, alto, p.borde)).png().toBuffer();
  const pieza = await sharp(girada)
    .resize(ancho, alto, { kernel: 'lanczos3' })
    .sharpen({ sigma: 0.7 })
    .ensureAlpha()
    .composite([{ input: mascara, blend: 'dest-in' }])
    .png()
    .toBuffer();
  // Recorta lo que sale del lienzo
  const left = Math.round(p.en[0] * ESCALA);
  const top = Math.round(p.en[1] * ESCALA) - alto;
  const x0 = Math.max(0, left), y0 = Math.max(0, top);
  const x1 = Math.min(W * ESCALA, left + ancho), y1 = Math.min(H * ESCALA, top + alto);
  if (x1 <= x0 || y1 <= y0) continue;
  const visible = await sharp(pieza)
    .extract({ left: x0 - left, top: y0 - top, width: x1 - x0, height: y1 - y0 })
    .toBuffer();
  capas.push({ input: visible, left: x0, top: y0 });
}

const lienzo = await sharp({ create: { width: W * ESCALA, height: H * ESCALA, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
  .composite(capas)
  .png()
  .toBuffer();

// Difuminado de arriba: corto y parejo
const mascaraArriba = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W * ESCALA}" height="${H * ESCALA}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#fff" stop-opacity="0"/>
    <stop offset="${DIFUMINADO * 0.55}" stop-color="#fff" stop-opacity=".55"/>
    <stop offset="${DIFUMINADO}" stop-color="#fff" stop-opacity="1"/>
  </linearGradient></defs>
  <rect width="100%" height="100%" fill="url(#g)"/></svg>`);

await sharp(lienzo)
  .composite([{ input: await sharp(mascaraArriba).png().toBuffer(), blend: 'dest-in' }])
  .webp({ quality: 82, alphaQuality: 90 })
  .toFile(DESTINO);
console.log(`Listo: ${DESTINO} (${W * ESCALA} × ${H * ESCALA})`);
