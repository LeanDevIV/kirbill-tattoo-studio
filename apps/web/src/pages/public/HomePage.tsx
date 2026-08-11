import { GrainientHero } from "@/components/GrainientHero";
import { DriftGallery } from "@/components/DriftGallery";
import { ContactSection } from "@/components/ContactSection";

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

      <ContactSection />
    </div>
  );
}
