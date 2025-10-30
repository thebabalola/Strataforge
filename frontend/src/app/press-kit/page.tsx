export default function PressKitPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-5xl mx-auto px-6 pt-32 pb-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold">Press Kit</h1>
          <p className="text-gray-400 mt-4">
            Logos, colors, screenshots, and brand guidelines for StrataForge.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-white/10 bg-black/40 p-6">
            <h3 className="text-lg font-medium mb-2">Logo</h3>
            <img src="/strataforge-logo.png" alt="StrataForge Logo" className="w-48" />
            <a href="/strataforge-logo.png" download className="text-purple-400 mt-3 inline-block">
              Download PNG
            </a>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/40 p-6">
            <h3 className="text-lg font-medium mb-2">Colors</h3>
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded" style={{ background: '#C44DFF' }} />
              <div className="w-10 h-10 rounded" style={{ background: '#0AACE6' }} />
              <div className="w-10 h-10 rounded" style={{ background: '#000000' }} />
            </div>
            <p className="text-gray-400 text-sm mt-3">Primary gradient and background tones.</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/40 p-6">
            <h3 className="text-lg font-medium mb-2">Screenshots</h3>
            <p className="text-gray-400 text-sm">Use landing and dashboard screenshots from the app.</p>
          </div>
        </div>
      </section>
    </main>
  );
}


