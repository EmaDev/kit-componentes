import Link from "next/link";
import { Button } from "../../../components/Button";
import { I } from "./Icon";

export function Hero() {
  return (
    <div className="pt-14 pb-10 max-w-2xl">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        lib-kit-components · playground
      </div>
      <h1 className="mt-4 text-5xl sm:text-6xl font-bold tracking-tight text-foreground leading-[1.05]">
        Tu kit de
        <br />
        <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          componentes atómicos.
        </span>
      </h1>
      <p className="mt-5 text-base text-muted leading-relaxed max-w-xl">
        Los mismos componentes que se instalan en otros proyectos, corriendo acá en vivo — no una
        recreación visual. Framer Motion real, Tailwind v4 real, tema claro/oscuro real.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <Button
          leftIcon={I.zap}
          onClick={() => document.getElementById("button")?.scrollIntoView({ behavior: "smooth" })}
        >
          Empezar
        </Button>
        <Button variant="secondary" leftIcon={I.github}>
          Ver código
        </Button>
        <Link href="/ejemplos">
          <Button variant="outline" leftIcon={I.layers}>
            Ver ejemplos
          </Button>
        </Link>
      </div>
    </div>
  );
}
