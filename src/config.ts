// ─────────────────────────────────────────────────────────────
//  DATOS DE LA INVITACIÓN
//  Todo lo que se puede cambiar está en este archivo.
//  Lo marcado como "PENDIENTE" todavía no fue confirmado:
//  mientras esté vacío, la web no lo muestra.
// ─────────────────────────────────────────────────────────────

export const evento = {
  quinceanera: 'Delfina',
  titulo: 'Mis XV Años',

  // Fecha y hora de inicio con la zona horaria de Argentina (-03:00).
  // PENDIENTE DE CONFIRMAR: el año (la invitación solo dice "23 de Enero").
  fechaISO: '2027-01-23T21:00:00-03:00',
  hora: '21 hs',
  notaHora: 'Puntual',

  frase: 'Te invito a compartir una noche inolvidable.',
  fraseSecundaria:
    'Hay momentos que se vuelven eternos cuando los compartimos con personas especiales.',
  cierre: 'Cuento con tu presencia.',

  lugar: {
    nombre: 'Centro de Jubilados de Verónica',
    // Opcional: calle y número, se muestra debajo del nombre. Ej.: 'Calle 12 N° 345, Verónica'
    direccion: '',
    // Link de Google Maps (en la app: Compartir → Copiar vínculo).
    // Si queda vacío, "Cómo llegar" busca el nombre del lugar en Google Maps.
    mapsUrl: 'https://maps.app.goo.gl/bGDmL6aABj9MAS7B6',
  },
};

export const confirmacion = {
  // Número de WhatsApp que recibe las confirmaciones (temporal).
  // Formato internacional: +54 9 + característica sin 0 + número sin 15.
  // Se puede escribir con espacios o guiones: se usan solo los dígitos.
  whatsapp: '+54 9 11 4034-7959',
  mensaje:
    '¡Hola! 💗 Quiero confirmar mi asistencia a los XV de Delfina. ¡Muchas gracias por la invitación!',
  texto:
    'Los momentos más lindos se viven con personas especiales. Me encantaría que seas parte de esta noche inolvidable.',
  pregunta: '¿Me acompañás?',
  // Opcional. Ej.: 'Por favor, confirmá antes del 10 de enero.'
  fechaLimite: '',
};

// Opcional: dress code, regalos u otra info. Cada bloque se muestra
// solo si está cargado. Ej.: { titulo: 'Dress code', texto: 'Elegante' }
export const extras: { titulo: string; texto: string }[] = [];

export const musica = {
  // Copiá el archivo en public/musica/ con este nombre.
  // Si el archivo no existe, la invitación funciona igual, sin botón de música.
  archivo: '/musica/a-thousand-years.mp3',
  titulo: 'A Thousand Years · Christina Perri',
  volumen: 0.75,
};

export const sitio = {
  titulo: 'Mis XV Años | Delfina ✨',
  descripcion:
    'Hay momentos que se vuelven eternos cuando los compartimos con personas especiales. Te invito a vivir una noche inolvidable. 💗',
  // Si cambiás la imagen, cambiá también el número de versión para que
  // WhatsApp y Facebook la vuelvan a descargar.
  imagenOG: '/og/delfina-xv.jpg?v=1',
  imagenOGAlt: 'Invitación a los XV años de Delfina, con su foto, flores y mariposas rosas',
  colorTema: '#F6C3D2',
};
