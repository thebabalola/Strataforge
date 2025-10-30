export default function FAQPage() {
  const faqs = [
    {
      q: 'What is StrataForge?',
      a:
        'StrataForge is a no-code platform to deploy ERC-20, ERC-721, and ERC-1155 tokens, run airdrops, and manage campaigns on Base.',
    },
    {
      q: 'Which networks are supported?',
      a: 'Base Sepolia testnet is live. Mainnet support and additional chains are on the roadmap.',
    },
    {
      q: 'Do I need to code?',
      a: 'No. The UI guides you through token configuration and deployment with a few clicks.',
    },
    {
      q: 'How are airdrops managed?',
      a:
        'You can import CSV whitelists, generate Merkle proofs, and let users claim from the dashboard.',
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold">Frequently Asked Questions</h1>
          <p className="text-gray-400 mt-4">
            Quick answers about deploying tokens, running airdrops, and using StrataForge.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((item, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-black/40 p-6">
              <h3 className="text-lg font-medium">{item.q}</h3>
              <p className="text-gray-400 mt-2 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

"use client";
import React from "react";

const faqs = [
  {
    q: "What is StrataForge?",
    a: "StrataForge is a no-code platform to create ERC-20, ERC-721, and ERC-1155 tokens, run airdrops, and manage campaigns on Base.",
  },
  {
    q: "Which networks are supported?",
    a: "Base Sepolia testnet today, with roadmap for additional EVM networks.",
  },
  {
    q: "Do I need to code?",
    a: "No. Configuration is handled via forms and guided steps with one-click deployment.",
  },
  {
    q: "How are airdrops handled?",
    a: "We use Merkle proofs for scalable distribution. Upload CSV, we generate proofs, and claimers verify onchain.",
  },
  {
    q: "Are the contracts audited?",
    a: "Contracts use OpenZeppelin libraries and follow best practices. Audits are part of the roadmap as we expand.",
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-black pt-28 pb-16 px-6">
      <section className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1
            className="text-4xl font-semibold mb-4"
            style={{
              background: "linear-gradient(275.69deg, #C44DFF 25.22%, #0AACE6 75.5%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Frequently Asked Questions
          </h1>
          <p className="text-gray-400">
            Answers to common questions about using StrataForge.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((item, i) => (
            <details
              key={i}
              className="group bg-[#1E1425] border border-white/10 rounded-xl p-6"
            >
              <summary className="list-none cursor-pointer flex items-center justify-between">
                <span className="text-white font-medium">{item.q}</span>
                <span className="text-purple-400 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-gray-400 mt-4">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}


