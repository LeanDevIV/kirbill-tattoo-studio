import { Grainient } from "@/components/Grainient";
import { HeroCarousel } from "@/components/HeroCarousel";

export function GrainientHero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <Grainient />
      <div className="relative z-10 h-[70vh] w-full max-w-6xl px-4">
        <HeroCarousel />
      </div>
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <h1 className="text-8xl font-bold text-gradient">Kirbill</h1>
      </div>
    </section>
  );
}
