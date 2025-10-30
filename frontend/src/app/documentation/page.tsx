export default function DocumentationPage() {
  const sections = [
    {
      title: 'Getting Started',
      items: [
        'Connect your wallet',
        'Choose a role (creator, trader, admin)',
        'Create a token from templates',
      ],
    },
    {
      title: 'Token Types',
      items: [
        'ERC-20: fungible tokens for utilities and economies',
        'ERC-721: single NFTs with unique metadata',
        'ERC-1155: multi-token standard for collections',
        'Memecoin & Stablecoin: opinionated templates',
      ],
    },
    {
      title: 'Airdrops & Whitelists',
      items: [
        'Upload CSV of addresses',
        'Merkle tree generation and proof verification',
        'Claim page for end-users',
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-5xl mx-auto px-6 pt-32 pb-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold">Documentation</h1>
          <p className="text-gray-400 mt-4">
            Learn how to create tokens, run airdrops, and manage campaigns with StrataForge.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {sections.map((s, idx) => (
            <div key={idx} className="rounded-xl border border-white/10 bg-black/40 p-6">
              <h3 className="text-xl font-medium mb-4">{s.title}</h3>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                {s.items.map((it, i) => (
                  <li key={i}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}


