import { prepararMusica } from './musica';
import { iniciarCuentaRegresiva } from './cuenta-regresiva';

const sinMovimiento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Muestra cada bloque con [data-revelar] cuando entra en pantalla. */
function revelarAlDeslizar() {
  const elementos = document.querySelectorAll<HTMLElement>('[data-revelar]');
  if (!('IntersectionObserver' in window)) {
    elementos.forEach((el) => el.classList.add('visible'));
    return;
  }
  const observador = new IntersectionObserver(
    (entradas) => {
      for (const entrada of entradas) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('visible');
          observador.unobserve(entrada.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  elementos.forEach((el) => observador.observe(el));
}

/** Pantalla de apertura: al tocar el sello arranca la música y se abre el sobre. */
function prepararApertura(musica: ReturnType<typeof prepararMusica>) {
  const html = document.documentElement;
  const apertura = document.getElementById('apertura');
  const boton = document.getElementById('abrir');
  const contenido = document.getElementById('contenido');
  if (!apertura || !boton) {
    html.classList.remove('cerrada');
    html.classList.add('abierta');
    return;
  }

  contenido?.setAttribute('inert', '');
  boton.focus({ preventScroll: true });

  let abierta = false;
  boton.addEventListener('click', () => {
    if (abierta) return;
    abierta = true;

    // Dentro del toque: es lo que habilita el audio en iPhone y Android.
    musica?.reproducir();

    html.classList.add('abriendo');
    const duracion = sinMovimiento() ? 450 : 1900;
    window.setTimeout(() => {
      html.classList.remove('cerrada', 'abriendo');
      html.classList.add('abierta');
      contenido?.removeAttribute('inert');
      apertura.remove();
      document.getElementById('nombre')?.closest('h1')?.setAttribute('tabindex', '-1');
      (document.querySelector('.titulo-principal') as HTMLElement | null)?.focus({ preventScroll: true });
    }, duracion);
  });
}

export function iniciarInvitacion() {
  window.history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  const musica = prepararMusica();
  prepararApertura(musica);
  iniciarCuentaRegresiva();
  revelarAlDeslizar();
}
