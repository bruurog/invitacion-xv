/**
 * Profundidad al deslizar: cada [data-parallax="factor"] se mueve a otra velocidad.
 *   factor > 0 → va más lento que la página (queda atrás)
 *   factor < 0 → va más rápido (queda adelante)
 * Lo que se ve al cargar parte de su lugar; el resto queda en su lugar
 * cuando su sección está centrada en la pantalla.
 * [data-parallax-desvanecer] además se va apagando mientras sale de pantalla.
 * Usa la propiedad `translate`, así no pisa las animaciones de `transform`.
 */
export function iniciarParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const capas = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]')).map((el) => ({
    el,
    factor: Number(el.dataset.parallax) || 0,
    seccion: (el.closest('section, header, footer') as HTMLElement | null) ?? el.parentElement!,
    desvanecer: el.hasAttribute('data-parallax-desvanecer'),
    reposo: 0,
    arriba: 0,
    alto: 0,
  }));
  if (capas.length === 0) return;

  const medir = () => {
    const alto = window.innerHeight;
    const maximo = document.documentElement.scrollHeight - alto;
    for (const c of capas) {
      const r = c.seccion.getBoundingClientRect();
      c.arriba = r.top + window.scrollY;
      c.alto = r.height;
      const centrada = c.arriba + c.alto / 2 - alto / 2;
      c.reposo = c.arriba < alto ? 0 : Math.min(Math.max(centrada, 0), maximo);
    }
  };

  let pendiente = false;
  const pintar = () => {
    pendiente = false;
    const y = window.scrollY;
    const alto = window.innerHeight;
    for (const c of capas) {
      if (y + alto < c.arriba - alto * 0.5 || y > c.arriba + c.alto + alto * 0.5) continue;
      c.el.style.translate = `0 ${((y - c.reposo) * c.factor).toFixed(1)}px`;
      if (c.desvanecer) {
        const salida = Math.min(1, Math.max(0, (y - c.arriba) / c.alto));
        c.el.style.opacity = (1 - salida * 0.75).toFixed(3);
      }
    }
  };

  const pedir = () => {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(pintar);
  };
  const remedir = () => {
    medir();
    pedir();
  };

  medir();
  pintar();
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', remedir);
  window.addEventListener('load', remedir);
  document.fonts?.ready.then(remedir);
}
