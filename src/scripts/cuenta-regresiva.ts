/** Cuenta regresiva hasta la fecha de [data-cuenta]. Se actualiza cada segundo. */
export function iniciarCuentaRegresiva() {
  const fila = document.querySelector<HTMLElement>('[data-cuenta]');
  if (!fila) return;

  const objetivo = new Date(fila.dataset.cuenta ?? '').getTime();
  if (Number.isNaN(objetivo)) return;

  const campos = {
    dias: fila.querySelector<HTMLElement>('[data-unidad="dias"]'),
    horas: fila.querySelector<HTMLElement>('[data-unidad="horas"]'),
    minutos: fila.querySelector<HTMLElement>('[data-unidad="minutos"]'),
    segundos: fila.querySelector<HTMLElement>('[data-unidad="segundos"]'),
  };
  const fin = fila.parentElement?.querySelector<HTMLElement>('.cuenta__fin');
  const dosDigitos = (n: number) => String(n).padStart(2, '0');

  let intervalo = 0;
  const actualizar = () => {
    const resto = objetivo - Date.now();
    if (resto <= 0) {
      window.clearInterval(intervalo);
      fila.hidden = true;
      if (fin) fin.hidden = false;
      return;
    }
    const s = Math.floor(resto / 1000);
    const valores = {
      dias: String(Math.floor(s / 86400)),
      horas: dosDigitos(Math.floor((s % 86400) / 3600)),
      minutos: dosDigitos(Math.floor((s % 3600) / 60)),
      segundos: dosDigitos(s % 60),
    };
    for (const clave of Object.keys(campos) as (keyof typeof campos)[]) {
      const el = campos[clave];
      if (el && el.textContent !== valores[clave]) el.textContent = valores[clave];
    }
  };

  actualizar();
  intervalo = window.setInterval(actualizar, 1000);
}
