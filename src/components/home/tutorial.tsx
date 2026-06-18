export default function Tutorial() {
  return (
    <section id="tutorial" className="bg-slate-50 py-24">
      <div className="mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="font-bold text-slate-900 text-3xl md:text-4xl">
            See How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            Getting started with Ucomp is simple. Watch how easy it is to
            upload, queue, and print your documents.
          </p>
        </div>

        {/* YouTube Video */}
        <div className="shadow-xl mx-auto rounded-2xl max-w-4xl aspect-video overflow-hidden">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/Y-x0efG1seA"
            title="Ucomp Tutorial Coming Soon"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
