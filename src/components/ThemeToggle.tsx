import { useState, useEffect } from "preact/hooks";

export default function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false,
  );
  const [angle, setAngle] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [introGlow, setIntroGlow] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored) {
      setDark(stored === "dark");
    } else {
      setDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }

    // Glow de entrada: aparece a 1s, se va a los 2s
    const show = setTimeout(() => setIntroGlow(true), 1000);
    const hide = setTimeout(() => setIntroGlow(false), 2000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    setAngle((a) => a + 180);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  // Glow: amarillo-cálido para el sol, azul-frío para la luna
  const glowColor = dark
    ? "rgba(251, 191, 36, 0.45)"
    : "rgba(99, 179, 237, 0.45)";

  return (
    <button
      onClick={toggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      class="relative flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-[colors,box-shadow] duration-300 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
      style={
        hovered || introGlow
          ? { boxShadow: `0 0 14px 3px ${glowColor}` }
          : undefined
      }
    >

      {/* Ícono con rotación acumulativa */}
      <span
        aria-hidden="true"
        style={{
          display: "flex",
          transform: `rotate(${angle}deg)`,
          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {dark ? (
          /* Sol */
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
        ) : (
          /* Luna */
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        )}
      </span>
    </button>
  );
}
