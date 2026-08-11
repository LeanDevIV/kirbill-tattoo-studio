import { GrainientHero } from "@/components/GrainientHero";

export function HomePage() {
  return (
    <div>
      <GrainientHero />

      <section
        id="gallery"
        className="flex min-h-screen items-center justify-center border-t border-border"
      >
        <h2 className="text-4xl font-bold text-gradient">Gallery Section</h2>
      </section>

      <section
        id="contact"
        className="flex min-h-screen items-center justify-center border-t border-border"
      >
        <h2 className="text-4xl font-bold text-gradient">Contact Section</h2>
      </section>
    </div>
  );
}
