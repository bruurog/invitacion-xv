// Genera la imagen de vista previa para WhatsApp/Facebook (1200 × 630)
// y los íconos (favicon PNG y apple-touch-icon).
// Uso: npm run og   → public/og/delfina-xv.jpg, public/favicon-32.png, public/apple-touch-icon.png
//
// Se arma con Satori (HTML/CSS → SVG) y se pasa a JPG liviano (< 300 KB),
// porque WhatsApp suele descartar imágenes pesadas.
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { evento } from '../src/config.ts'; // Node 24 lee TypeScript simple sin compilar

const W = 1200;
const H = 630;

const NOMBRE = evento.quinceanera;
const SUBTITULO = evento.titulo;
const HORA = evento.hora;

const fecha = new Date(evento.fechaISO);
const f = (o) => new Intl.DateTimeFormat('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', ...o }).format(fecha);
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const LINEA_FECHA = `${cap(f({ weekday: 'long' }))} ${f({ day: 'numeric' })} de ${f({ month: 'long' })} · ${HORA}`;

const fuente = (ruta) => readFile(new URL(`../node_modules/${ruta}`, import.meta.url));
const fuentes = [
  { name: 'Great Vibes', data: await fuente('@fontsource/great-vibes/files/great-vibes-latin-400-normal.woff'), weight: 400 },
  { name: 'Cinzel', data: await fuente('@fontsource/cinzel/files/cinzel-latin-600-normal.woff'), weight: 600 },
  { name: 'Cormorant', data: await fuente('@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff'), weight: 600 },
  { name: 'Cormorant', data: await fuente('@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-italic.woff'), weight: 500, style: 'italic' },
];

const dataUri = (buf, tipo) => `data:${tipo};base64,${buf.toString('base64')}`;
const png = async (ruta, ancho) => dataUri(await sharp(ruta).resize({ width: ancho }).png().toBuffer(), 'image/png');

// Foto con fundido abajo y a los costados, ya horneado
const ALTO_FOTO = 640;
const ANCHO_FOTO = Math.round((1086 / 1448) * ALTO_FOTO);
const mascaraFoto = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${ANCHO_FOTO}" height="${ALTO_FOTO}">
  <defs>
    <linearGradient id="v" x1="0" y1="0" x2="0" y2="1"><stop offset=".55" stop-color="#fff"/><stop offset=".97" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <linearGradient id="h" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".06" stop-color="#fff"/><stop offset=".8" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <mask id="m"><rect width="100%" height="100%" fill="url(#v)"/></mask>
  </defs>
  <rect width="100%" height="100%" fill="url(#h)" mask="url(#m)"/></svg>`);
const fotoBuf = await sharp('src/assets/delfina-recorte.png')
  .resize(ANCHO_FOTO, ALTO_FOTO)
  .composite([{ input: await sharp(mascaraFoto).png().toBuffer(), blend: 'dest-in' }])
  .png()
  .toBuffer();
const foto = dataUri(fotoBuf, 'image/png');

const A = 'src/assets/adornos';
const img = {
  corona: await png(`${A}/corona.webp`, 380),
  ramaIzq: await png(`${A}/rama-sup-izq.webp`, 250),
  ramaDer: await png(`${A}/rama-sup-der.webp`, 256),
  rosaIzq: await png(`${A}/rosa-inf-izq.webp`, 300),
  rosaDer: await png(`${A}/rosa-inf-der.webp`, 300),
  mariposa: await png(`${A}/mariposa-der.webp`, 280),
};

const separador = dataUri(
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 24" width="420" height="34">
  <defs>
    <linearGradient id="a" x1="0" x2="1"><stop offset="0" stop-color="#C9A45C" stop-opacity="0"/><stop offset="1" stop-color="#C9A45C"/></linearGradient>
    <linearGradient id="b" x1="0" x2="1"><stop offset="0" stop-color="#C9A45C"/><stop offset="1" stop-color="#C9A45C" stop-opacity="0"/></linearGradient>
  </defs>
  <rect x="8" y="11.8" width="126" height="1.4" fill="url(#a)"/>
  <rect x="166" y="11.8" width="126" height="1.4" fill="url(#b)"/>
  <circle cx="138.5" cy="12.5" r="1.4" fill="#C9A45C"/><circle cx="161.5" cy="12.5" r="1.4" fill="#C9A45C"/>
  <path d="M150 20.5C144 16 140.6 12.6 140.6 9.2c0-2.6 2-4.4 4.4-4.4 2 0 3.6 1.2 5 3.2 1.4-2 3-3.2 5-3.2 2.4 0 4.4 1.8 4.4 4.4 0 3.4-3.4 6.8-9.4 11.3Z" fill="none" stroke="#B88A3E" stroke-width="1.6"/>
</svg>`),
  'image/svg+xml',
);

const bokeh = [
  [520, 60, 70], [1130, 90, 90], [600, 520, 60], [1040, 560, 80], [80, 300, 70], [850, 40, 40], [1180, 330, 50],
].map(([x, y, r]) => ({
  type: 'div',
  props: {
    style: {
      position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: r,
      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 70%)',
    },
  },
}));

const abs = (style, src, w) => ({ type: 'img', props: { src, width: w, style: { position: 'absolute', ...style } } });

const arbol = {
  type: 'div',
  props: {
    style: {
      position: 'relative', display: 'flex', width: W, height: H, overflow: 'hidden',
      backgroundImage: 'linear-gradient(135deg, #FFF4F6 0%, #FBDDE3 55%, #F6C6D2 100%)',
    },
    children: [
      ...bokeh,
      // Halo detrás de la foto
      { type: 'div', props: { style: { position: 'absolute', left: 20, top: -40, width: 560, height: 560, borderRadius: 280, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,240,245,0.5) 45%, rgba(255,240,245,0) 70%)' } } },
      abs({ left: 60, top: 18 }, foto, ANCHO_FOTO),
      abs({ left: 0, top: 0 }, img.ramaIzq, 150),
      abs({ left: 0, bottom: 0 }, img.rosaIzq, 165),
      abs({ right: 0, top: 120 }, img.ramaDer, 120),
      abs({ right: 0, bottom: 0 }, img.rosaDer, 150),
      abs({ right: 30, top: 6 }, img.mariposa, 130),
      // Columna de texto
      {
        type: 'div',
        props: {
          style: {
            position: 'absolute', left: 530, top: 0, width: 560, height: H,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          },
          children: [
            { type: 'img', props: { src: img.corona, width: 190, height: Math.round(190 * (122 / 210)), style: { marginBottom: -14 } } },
            {
              type: 'div',
              props: {
                style: {
                  fontFamily: 'Great Vibes', fontSize: 168, lineHeight: 1.05, color: '#B8155F', padding: '0 30px 10px',
                  textShadow: '0 2px 0 rgba(255,255,255,0.9)',
                },
                children: NOMBRE,
              },
            },
            {
              type: 'div',
              props: {
                style: { fontFamily: 'Cinzel', fontWeight: 600, fontSize: 44, letterSpacing: 9, color: '#7A1347', marginTop: -6 },
                children: SUBTITULO.toUpperCase(),
              },
            },
            { type: 'img', props: { src: separador, width: 420, height: 34, style: { marginTop: 18, marginBottom: 14 } } },
            {
              type: 'div',
              props: {
                style: { fontFamily: 'Cinzel', fontWeight: 600, fontSize: 26, letterSpacing: 2.5, color: '#3D2B31' },
                children: LINEA_FECHA.toUpperCase(),
              },
            },
            {
              type: 'div',
              props: {
                style: { fontFamily: 'Cormorant', fontStyle: 'italic', fontWeight: 500, fontSize: 31, color: '#6B4F58', marginTop: 8 },
                children: 'Te invito a una noche inolvidable',
              },
            },
          ],
        },
      },
    ],
  },
};

const svg = await satori(arbol, { width: W, height: H, fonts: fuentes });
const pngOG = new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render().asPng();
await mkdir('public/og', { recursive: true });
const jpg = await sharp(pngOG).jpeg({ quality: 84, mozjpeg: true, chromaSubsampling: '4:4:4' }).toBuffer();
await writeFile('public/og/delfina-xv.jpg', jpg);
console.log(`public/og/delfina-xv.jpg · ${(jpg.length / 1024).toFixed(0)} KB`);
if (jpg.length > 300 * 1024) console.warn('Ojo: pesa más de 300 KB; WhatsApp podría no mostrarla.');

// Íconos a partir del favicon SVG
const favicon = await readFile('public/favicon.svg');
await sharp(favicon, { density: 300 }).resize(32, 32).png().toFile('public/favicon-32.png');
await sharp(favicon, { density: 600 })
  .resize(150, 150)
  .extend({ top: 15, bottom: 15, left: 15, right: 15, background: '#FBDDE3' })
  .flatten({ background: '#FBDDE3' })
  .png()
  .toFile('public/apple-touch-icon.png');
console.log('Íconos listos: public/favicon-32.png, public/apple-touch-icon.png');
