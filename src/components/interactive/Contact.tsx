import { useState } from "preact/hooks";

interface FormState {
  name: string;
  timeline: string;
  message: string;
}

const TIMELINE_OPTIONS = [
  "Urgente (esta semana)",
  "En las próximas semanas",
  "En 1-2 meses",
  "Aún explorando opciones",
];

const inputBase =
  "w-full rounded-xl border bg-white px-4 py-3.5 pl-11 text-sm text-zinc-900 transition-all outline-none placeholder:text-zinc-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:bg-white/5 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-cyan-500/70 dark:focus:bg-white/8 dark:focus:ring-cyan-500/20";

const inputNormal = "border-zinc-200 dark:border-white/10";
const inputError = "border-red-500/60 ring-2 ring-red-500/20";

export default function Contact() {
  const [form, setForm] = useState<FormState>({
    name: "",
    timeline: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const next: Partial<FormState> = {};
    if (!form.name.trim()) next.name = "Tu nombre es requerido";
    if (!form.timeline) next.timeline = "Selecciona un plazo";
    if (!form.message.trim()) next.message = "Cuéntame sobre tu proyecto";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: Event) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    // Número ensamblado en runtime para evitar indexación por crawlers
    const waNumber = ["5222", "01298518"].join("");
    const text = encodeURIComponent(
      `Hola, soy ${form.name}.\nPlazo: ${form.timeline}\n\n${form.message}`,
    );
    window.open(`https://wa.me/${waNumber}?text=${text}`, "_blank", "noopener");

    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 600);
  }

  if (sent) {
    return (
      <div class="flex flex-col items-center justify-center py-16 text-center">
        <div class="relative mb-6">
          <div class="absolute inset-0 rounded-full bg-green-400/20 blur-xl" />
          <div class="relative flex h-16 w-16 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="text-green-400"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>
        <h3 class="mb-2 text-xl font-bold text-zinc-800 dark:text-zinc-50">
          ¡Mensaje listo!
        </h3>
        <p class="max-w-xs text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          Se abrió WhatsApp con tu mensaje preparado. Te respondo en menos de
          24 horas.
        </p>
        <button
          onClick={() => {
            setSent(false);
            setForm({ name: "", timeline: "", message: "" });
          }}
          class="mt-6 text-xs text-zinc-400 underline-offset-4 transition-colors hover:text-cyan-500 hover:underline dark:text-zinc-500 dark:hover:text-cyan-400"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate class="flex flex-col gap-5">
      {/* Nombre */}
      <div class="group">
        <label
          for="contact-name"
          class="mb-2 block text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400"
        >
          Nombre
        </label>
        <div class="relative">
          <span class="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-cyan-500 dark:text-zinc-500 dark:group-focus-within:text-cyan-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </span>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            placeholder="¿Cómo te llamas?"
            value={form.name}
            onInput={(e) =>
              setForm({ ...form, name: (e.target as HTMLInputElement).value })
            }
            aria-describedby={errors.name ? "name-error" : undefined}
            aria-invalid={!!errors.name}
            class={`${inputBase} ${errors.name ? inputError : inputNormal}`}
          />
        </div>
        {errors.name && (
          <p
            id="name-error"
            class="mt-1.5 flex items-center gap-1 text-xs text-red-400"
            role="alert"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {errors.name}
          </p>
        )}
      </div>

      {/* Plazo */}
      <div class="group">
        <label
          for="contact-timeline"
          class="mb-2 block text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400"
        >
          Plazo
        </label>
        <div class="relative">
          <span class="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-cyan-500 dark:text-zinc-500 dark:group-focus-within:text-cyan-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </span>
          <select
            id="contact-timeline"
            value={form.timeline}
            onChange={(e) =>
              setForm({
                ...form,
                timeline: (e.target as HTMLSelectElement).value,
              })
            }
            aria-describedby={errors.timeline ? "timeline-error" : undefined}
            aria-invalid={!!errors.timeline}
            class={`${inputBase} appearance-none ${errors.timeline ? inputError : inputNormal}`}
          >
            <option value="" disabled>
              ¿Cuándo lo necesitas?
            </option>
            {TIMELINE_OPTIONS.map((option) => (
              <option value={option}>{option}</option>
            ))}
          </select>
          <span class="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </div>
        {errors.timeline && (
          <p
            id="timeline-error"
            class="mt-1.5 flex items-center gap-1 text-xs text-red-400"
            role="alert"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {errors.timeline}
          </p>
        )}
      </div>

      {/* Separador decorativo */}
      <div class="flex items-center gap-3">
        <div class="h-px flex-1 bg-zinc-200 dark:bg-white/8" />
        <span class="text-[10px] font-semibold tracking-widest text-zinc-400 uppercase dark:text-zinc-600">
          Tu proyecto
        </span>
        <div class="h-px flex-1 bg-zinc-200 dark:bg-white/8" />
      </div>

      {/* Mensaje */}
      <div class="group">
        <div class="mb-2 flex items-center justify-between">
          <label
            for="contact-message"
            class="text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400"
          >
            Mensaje
          </label>
          <span
            class={`text-xs tabular-nums transition-colors ${
              form.message.length > 480
                ? "text-red-500 dark:text-red-400"
                : form.message.length > 300
                  ? "text-amber-500 dark:text-amber-400"
                  : "text-zinc-400 dark:text-zinc-600"
            }`}
          >
            {form.message.length}/500
          </span>
        </div>
        <div class="relative">
          <span class="pointer-events-none absolute top-3.5 left-3.5 text-zinc-400 transition-colors group-focus-within:text-cyan-500 dark:text-zinc-500 dark:group-focus-within:text-cyan-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </span>
          <textarea
            id="contact-message"
            rows={5}
            maxLength={500}
            placeholder="Cuéntame sobre tu proyecto, qué necesitas, tus ideas..."
            value={form.message}
            onInput={(e) =>
              setForm({
                ...form,
                message: (e.target as HTMLTextAreaElement).value,
              })
            }
            aria-describedby={errors.message ? "message-error" : undefined}
            aria-invalid={!!errors.message}
            class={`${inputBase} resize-none pt-3.5 pl-11 leading-relaxed ${errors.message ? inputError : inputNormal}`}
          />
        </div>
        {errors.message && (
          <p
            id="message-error"
            class="mt-1.5 flex items-center gap-1 text-xs text-red-400"
            role="alert"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {errors.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        class="group relative mt-1 w-full overflow-hidden rounded-xl bg-linear-to-r from-green-600 to-green-500 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition-all hover:shadow-green-500/40 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {/* shimmer */}
        <span
          aria-hidden="true"
          class="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full"
        />
        <span class="relative inline-flex items-center justify-center gap-2">
          {loading ? (
            <>
              <svg
                class="animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                aria-hidden="true"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Preparando mensaje...
            </>
          ) : (
            <>
              Enviar por WhatsApp
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                class="transition-transform group-hover:translate-x-0.5"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
            </>
          )}
        </span>
      </button>

      <p class="text-center text-[11px] text-zinc-400 dark:text-zinc-600">
        Sin spam · Solo te contacto para hablar de tu proyecto
      </p>
    </form>
  );
}
