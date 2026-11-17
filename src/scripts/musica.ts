/**
 * Música de fondo.
 * - Intenta arrancar sola al cargar (casi todos los celulares lo bloquean; si pasa, no hace nada).
 * - Arranca seguro con el toque en "Abrir mi invitación".
 * - Entra con fundido (en iPhone el volumen no se puede cambiar por código: arranca directo).
 * - Se pausa si salen de la pestaña y vuelve al regresar.
 * - Si el archivo falla, el botón desaparece y la invitación sigue igual.
 */
export function prepararMusica() {
  const audio = document.getElementById('musica') as HTMLAudioElement | null;
  const boton = document.getElementById('boton-musica') as HTMLButtonElement | null;
  if (!audio || !boton) return null;

  const volumenFinal = Math.min(1, Math.max(0, Number(audio.dataset.volumen ?? 0.75)));
  let quiereSonar = false;
  let pausadaPorSalida = false;
  let fundido = 0;

  const marcar = (sonando: boolean) => {
    boton.setAttribute('aria-pressed', String(sonando));
    boton.setAttribute('aria-label', sonando ? 'Pausar música' : 'Reproducir música');
    boton.classList.toggle('sonando', sonando);
  };

  const fundir = (hasta: number, ms: number, alTerminar?: () => void) => {
    cancelAnimationFrame(fundido);
    const desde = audio.volume;
    const inicio = performance.now();
    const paso = (ahora: number) => {
      const p = Math.min(1, (ahora - inicio) / ms);
      audio.volume = desde + (hasta - desde) * p;
      if (p < 1) fundido = requestAnimationFrame(paso);
      else alTerminar?.();
    };
    fundido = requestAnimationFrame(paso);
  };

  const reproducir = () => {
    quiereSonar = true;
    boton.hidden = false;
    marcar(true);
    if (!audio.paused) return;
    audio.volume = 0;
    audio
      .play()
      .then(() => fundir(volumenFinal, 2600))
      .catch(() => {
        quiereSonar = false;
        marcar(false);
      });
  };

  const pausar = () => {
    quiereSonar = false;
    marcar(false);
    fundir(0, 400, () => audio.pause());
  };

  boton.addEventListener('click', () => (quiereSonar && !audio.paused ? pausar() : reproducir()));

  audio.addEventListener('error', () => {
    quiereSonar = false;
    boton.hidden = true;
  });
  // Si el sistema la pausa (una llamada, otra app), el botón lo refleja.
  audio.addEventListener('pause', () => {
    if (!pausadaPorSalida && quiereSonar && audio.volume > 0.05) {
      quiereSonar = false;
      marcar(false);
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (!audio.paused) {
        pausadaPorSalida = true;
        audio.pause();
      }
    } else if (pausadaPorSalida) {
      pausadaPorSalida = false;
      if (quiereSonar) audio.play().catch(() => marcar(false));
    }
  });

  boton.hidden = false;

  // Intento de reproducción automática: solo funciona donde el navegador lo permite.
  audio.volume = volumenFinal;
  audio
    .play()
    .then(() => {
      quiereSonar = true;
      marcar(true);
      document.documentElement.classList.add('musica-sonando');
    })
    .catch(() => {});

  return { reproducir };
}
