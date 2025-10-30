export default function FAQPage() {
  const faqs = [
    {
      q: "What is StrataForge?",
      a: "StrataForge is a no-code platform to deploy ERC-20, ERC-721, and ERC-1155 tokens, run airdrops, and manage campaigns on Base.",
    },
    {
      q: "Which networks are supported?",
      a: "Base Sepolia testnet is live. Mainnet support and additional chains are on the roadmap.",
    },
    {
      q: "Do I need to code?",
      a: "No. The UI guides you through token configuration and deployment with a few clicks.",
    },
    {
      q: "How are airdrops managed?",
      a: "You can import CSV whitelists, generate Merkle proofs, and let users claim from the dashboard.",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-400 mt-4">
            Quick answers about deploying tokens, running airdrops, and using
            StrataForge.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/10 bg-black/40 p-6"
            >
              <h3 className="text-lg font-medium">{item.q}</h3>
              <p className="text-gray-400 mt-2 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
