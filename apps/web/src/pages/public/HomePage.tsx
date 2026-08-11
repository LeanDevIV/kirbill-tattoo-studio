import { GrainientHero } from "@/components/GrainientHero";
import { DriftGallery } from "@/components/DriftGallery";

export function HomePage() {
  return (
    <div>
      <GrainientHero />

      <section id="gallery" className="min-h-screen border-t border-border py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-5xl font-bold text-gradient">Gallery</h2>
          <DriftGallery />
        </div>
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
