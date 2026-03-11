import { useState, useRef } from "preact/hooks";

export type Service = {
  badge: string;
  title: string;
  description: string;
  image: string;
  iconHtml: string;
};

// ─── Desktop card: zoom imagen + reveal panel + shine ────────────────────────

function DesktopCard({ badge, title, description, image, iconHtml }: Service) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const [hovered, setHovered] = useState(false);
  const [shine, setShine] = useState({ x: 50, y: 50 });

  function onMouseMove(e: MouseEvent) {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      setShine({
        x: ((e.clientX - r.left) / r.width) * 100,
        y: ((e.clientY - r.top) / r.height) * 100,
      });
    });
  }

  return (
    <article
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      class="group relative cursor-pointer overflow-hidden rounded-3xl"
      style={{
        boxShadow: hovered
          ? "0 28px 56px -10px rgba(6,182,212,0.22), 0 16px 32px -14px rgba(0,0,0,0.5)"
          : "0 8px 28px -8px rgba(0,0,0,0.3)",
        transition: "box-shadow 0.4s ease",
      }}
    >
      {/* Imagen — zoom sutil en hover */}
      <div class="absolute inset-0 overflow-hidden">
        <img
          src={image}
          alt={title}
          class="h-full w-full object-cover transition-transform duration-700 ease-out"
          style={{ transform: hovered ? "scale(1.07)" : "scale(1)" }}
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Gradiente base */}
      <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
      <div class="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />

      {/* Shine que sigue al mouse */}
      <div
        class="absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.10), transparent 52%)`,
        }}
      />

      {/* Glow verde desde abajo */}
      <div
        class="absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: hovered ? 1 : 0,
          background:
            "radial-gradient(ellipse 90% 45% at 50% 100%, rgba(6,182,212,0.20), transparent 70%)",
        }}
      />

      {/* ── Contenido principal (siempre visible) ── */}
      <div class="relative flex min-h-[400px] flex-col justify-end">

        {/* Badge flotante arriba */}
        <div class="absolute left-6 top-6">
          <span class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/70 backdrop-blur-md">
            <div
              class="text-emerald-400"
              dangerouslySetInnerHTML={{ __html: iconHtml }}
            />
            {badge}
          </span>
        </div>

        {/* Panel inferior con fondo sólido que garantiza legibilidad */}
        <div class="bg-gradient-to-t from-black/50 to-transparent p-7 pt-12">
          <h3 class="mb-3 text-2xl font-bold leading-tight text-white drop-shadow-lg">
            {title}
          </h3>

          {/* Línea de acento */}
          <div
            class="mb-4 h-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-green-400 transition-all duration-500"
            style={{ width: hovered ? "3.5rem" : "2rem" }}
          />

          {/* Descripción: se revela desde abajo */}
          <div
            class="overflow-hidden transition-all duration-500 ease-out"
            style={{
              maxHeight: hovered ? "6rem" : "0",
              opacity: hovered ? 1 : 0,
            }}
          >
            <p class="text-sm leading-relaxed text-white/75">
              {description}
            </p>
          </div>
        </div>

      </div>
    </article>
  );
}

// ─── Mobile: tarjeta estática para el carrusel ────────────────────────────────

function MobileCard({ badge, title, description, image, iconHtml }: Service) {
  return (
    <article class="relative overflow-hidden rounded-3xl select-none">
      <div class="aspect-[3/4]">
        <img
          src={image}
          alt={title}
          class="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
      <div class="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />

      <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/45 to-transparent p-6 pt-10">
        <div class="mb-3 flex items-center gap-2">
          <div
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white backdrop-blur-sm"
            dangerouslySetInnerHTML={{ __html: iconHtml }}
          />
          <span class="rounded-full border border-white/20 bg-black/35 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/65 backdrop-blur-sm">
            {badge}
          </span>
        </div>
        <h3 class="mb-2 text-xl font-bold text-white drop-shadow-lg">{title}</h3>
        <div class="mb-3 h-0.5 w-8 rounded-full bg-gradient-to-r from-cyan-400 to-green-400" />
        <p class="text-sm leading-relaxed text-white/80">{description}</p>
      </div>
    </article>
  );
}

// ─── Mobile: carrusel con scroll-snap ────────────────────────────────────────

function MobileCarousel({ services }: { services: Service[] }) {
  const [current, setCurrent] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  function onScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = (el.firstElementChild as HTMLElement)?.offsetWidth ?? 0;
    if (cardWidth === 0) return;
    setCurrent(Math.round(el.scrollLeft / (cardWidth + 16)));
  }

  function goTo(index: number) {
    setCurrent(index);
    const el = scrollRef.current;
    if (!el) return;
    const card = el.children[index] as HTMLElement;
    card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  }

  return (
    <div>
      {/* Carrusel scroll-snap: w-[88%] deja ver el borde de la siguiente */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        class="flex gap-4 overflow-x-auto scroll-smooth pl-4"
        style={{
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        } as any}
      >
        {services.map((service, i) => (
          <div
            key={i}
            class="w-[88%] flex-shrink-0"
            style={{ scrollSnapAlign: "start" }}
          >
            <MobileCard {...service} />
          </div>
        ))}
        {/* Espaciador final para que la última card pueda snappear */}
        <div class="w-4 flex-shrink-0" aria-hidden="true" />
      </div>

      {/* Navegación: dots + contador */}
      <div class="mt-5 flex items-center justify-center gap-4">
        <div class="flex items-center gap-2">
          {services.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ver servicio ${i + 1}`}
              class={[
                "h-1.5 rounded-full bg-cyan-500 transition-all duration-300",
                i === current ? "w-6 opacity-100" : "w-1.5 opacity-30",
              ].join(" ")}
            />
          ))}
        </div>
        <span class="text-xs font-medium text-zinc-400">
          {current + 1} / {services.length}
        </span>
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function ServicesCards({ services }: { services: Service[] }) {
  return (
    <>
      {/* Desktop: grid 2×2 con efectos 3D */}
      <div class="hidden gap-5 md:grid md:grid-cols-2">
        {services.map((s, i) => (
          <DesktopCard key={i} {...s} />
        ))}
      </div>

      {/* Mobile: carrusel swipeable */}
      <div class="md:hidden">
        <MobileCarousel services={services} />
      </div>
    </>
  );
}
