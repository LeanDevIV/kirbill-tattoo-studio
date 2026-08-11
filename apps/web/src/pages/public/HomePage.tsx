export function HomePage() {
  return (
    <div>
      <section id="hero" className="flex min-h-screen items-center justify-center">
        <h1 className="text-6xl font-bold text-gradient">Hero Section</h1>
      </section>

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
