export default function ChangelogPage() {
  const entries = [
    { version: '1.1.0', date: '2025-10-26', notes: ['Base Sepolia deployment live', 'Admin & factory controls'] },
    { version: '1.0.0', date: '2025-08-01', notes: ['Initial release', 'Token creator dashboard'] },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold">Changelog</h1>
          <p className="text-gray-400 mt-4">What’s new in StrataForge.</p>
        </div>

        <div className="space-y-6">
          {entries.map((e, idx) => (
            <div key={idx} className="rounded-xl border border-white/10 bg-black/40 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-medium">v{e.version}</h3>
                <span className="text-gray-500 text-sm">{e.date}</span>
              </div>
              <ul className="list-disc list-inside text-gray-400 mt-3 space-y-1">
                {e.notes.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}


