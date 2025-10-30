"use client";
import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Integrate with your backend/email provider here
    setSent(true);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-semibold">Contact Us</h1>
          <p className="text-gray-400 mt-4">
            We’d love to hear from you. Send us a message and we’ll get back soon.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
          {sent ? (
            <div className="text-center py-10">
              <h3 className="text-xl font-medium">Thanks! 🎉</h3>
              <p className="text-gray-400 mt-2">Your message has been received.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <label className="block text-sm mb-2" htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  className="w-full rounded-lg bg-black/50 border border-white/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-2" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  className="w-full rounded-lg bg-black/50 border border-white/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-2" htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={onChange}
                  rows={6}
                  className="w-full rounded-lg bg-black/50 border border-white/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="How can we help?"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-full px-6 py-3 hover:opacity-95"
                >
                  Send Message
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="rounded-xl border border-white/10 bg-black/40 p-6 text-center">
            <h4 className="font-medium">Email</h4>
            <p className="text-gray-400 mt-1">hello@strataforge.io</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/40 p-6 text-center">
            <h4 className="font-medium">Twitter</h4>
            <p className="text-gray-400 mt-1">@StrataForge</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/40 p-6 text-center">
            <h4 className="font-medium">Docs</h4>
            <p className="text-gray-400 mt-1">/documentation</p>
          </div>
        </div>
      </section>
    </main>
  );
}


