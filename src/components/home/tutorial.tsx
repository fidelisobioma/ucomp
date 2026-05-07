import { Play } from "lucide-react";

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

        {/* Video Placeholder */}
        <div className="relative flex justify-center items-center bg-slate-900 shadow-xl mx-auto rounded-2xl max-w-4xl aspect-video overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
          <div className="relative flex flex-col items-center gap-4">
            <button className="flex justify-center items-center bg-white/10 hover:bg-white/20 border border-white/20 rounded-full w-20 h-20 transition-colors">
              <Play className="ml-1 w-8 h-8 text-white" />
            </button>
            <p className="text-white/50 text-sm">Tutorial video coming soon</p>
          </div>
        </div>
      </div>
    </section>
  );
}
