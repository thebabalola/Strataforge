"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "../components/layout/Footer";

// Animated Counter Component
const AnimatedCounter: React.FC<{
  end: number;
  duration?: number;
  suffix?: string;
}> = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const startCount = 0;
    const endCount = end;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentCount = Math.floor(
        progress * (endCount - startCount) + startCount
      );

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  }, [end, duration]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

// Floating Elements Component
const FloatingElements: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Geometric shapes */}
      <div className="absolute top-20 left-10 w-32 h-32 border border-purple-500/20 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-20 w-24 h-24 border border-blue-500/20 rotate-45 animate-bounce"></div>
      <div className="absolute bottom-32 left-20 w-40 h-40 border border-purple-400/15 rounded-2xl rotate-12 animate-pulse"></div>
      <div className="absolute top-1/3 left-1/4 w-16 h-16 border border-cyan-500/20 rotate-45 animate-bounce"></div>
      <div className="absolute bottom-1/4 right-1/3 w-28 h-28 border border-purple-300/15 rounded-full animate-pulse"></div>

      {/* Gradient orbs */}
      <div className="absolute top-10 right-1/3 w-64 h-64 bg-gradient-to-br from-purple-500/5 to-transparent rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-tr from-blue-500/5 to-transparent rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-gradient-to-bl from-cyan-500/3 to-transparent rounded-full blur-3xl animate-pulse"></div>
    </div>
  );
};

// Team Member Component
const TeamMember: React.FC<{
  name: string;
  role: string;
  image: string;
  description: string;
  social: { twitter?: string; linkedin?: string; github?: string };
}> = ({ name, role, image, description, social }) => {
  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300 group">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 p-1">
          <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
            <Image
              src={image}
              alt={name}
              width={88}
              height={88}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{name}</h3>
        <p className="text-purple-400 text-sm mb-3">{role}</p>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>

        <div className="flex justify-center space-x-3 mt-4">
          {social.twitter && (
            <a
              href={social.twitter}
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.902 4.902 0 01-2.224.084 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </a>
          )}
          {social.linkedin && (
            <a
              href={social.linkedin}
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          )}
          {social.github && (
            <a
              href={social.github}
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// Technology Stack Component
const TechStack: React.FC = () => {
  const technologies = [
    { name: "Next.js 15", category: "Frontend", icon: "⚡" },
    { name: "Solidity 0.8.26", category: "Smart Contracts", icon: "🔗" },
    { name: "Base Blockchain", category: "Blockchain", icon: "🌐" },
    { name: "Wagmi", category: "Web3", icon: "🔌" },
    { name: "Tailwind CSS", category: "Styling", icon: "🎨" },
    { name: "TypeScript", category: "Language", icon: "📘" },
    { name: "Hardhat", category: "Development", icon: "⚒️" },
    { name: "OpenZeppelin", category: "Security", icon: "🛡️" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {technologies.map((tech, index) => (
        <div
          key={index}
          className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-purple-500/30 transition-all duration-300 group"
        >
          <div className="text-center">
            <div className="text-2xl mb-2">{tech.icon}</div>
            <h4 className="text-white font-medium text-sm">{tech.name}</h4>
            <p className="text-gray-400 text-xs">{tech.category}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// Timeline Component
const Timeline: React.FC = () => {
  const milestones = [
    {
      year: "2024 Q3",
      title: "Project Inception",
      description:
        "StrataForge concept born from the need to democratize token creation",
      status: "completed",
    },
    {
      year: "2024 Q4",
      title: "MVP Development",
      description: "Core platform development with ERC-20 and ERC-721 support",
      status: "completed",
    },
    {
      year: "2025 Q1",
      title: "Base Integration",
      description:
        "Full Base blockchain integration and smart contract deployment",
      status: "completed",
    },
    {
      year: "2025 Q2",
      title: "Advanced Features",
      description: "ERC-1155, memecoin, and stablecoin templates added",
      status: "completed",
    },
    {
      year: "2025 Q3",
      title: "Campaign Management",
      description: "Airdrop and marketing campaign tools launched",
      status: "completed",
    },
    {
      year: "2025 Q4",
      title: "Platform Optimization",
      description: "Enhanced UI/UX and performance improvements",
      status: "current",
    },
    {
      year: "2026 Q1",
      title: "Multi-Chain Support",
      description: "Expansion to additional blockchain networks",
      status: "upcoming",
    },
    {
      year: "2026 Q2",
      title: "DAO Governance",
      description: "Community governance and template marketplace",
      status: "upcoming",
    },
  ];

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-blue-500"></div>

      <div className="space-y-8">
        {milestones.map((milestone, index) => (
          <div key={index} className="relative flex items-start space-x-6">
            {/* Timeline dot */}
            <div
              className={`relative z-10 w-4 h-4 rounded-full ${
                milestone.status === "completed"
                  ? "bg-green-500"
                  : milestone.status === "current"
                  ? "bg-purple-500"
                  : "bg-gray-500"
              }`}
            >
              <div
                className={`absolute inset-0 rounded-full animate-ping ${
                  milestone.status === "current" ? "bg-purple-500" : ""
                }`}
              ></div>
            </div>

            {/* Content */}
            <div className="flex-1 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-purple-400 font-semibold text-sm">
                  {milestone.year}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    milestone.status === "completed"
                      ? "bg-green-500/20 text-green-400"
                      : milestone.status === "current"
                      ? "bg-purple-500/20 text-purple-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {milestone.status}
                </span>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">
                {milestone.title}
              </h3>
              <p className="text-gray-400 text-sm">{milestone.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AboutUs: React.FC = () => {
  const [activeSection, setActiveSection] = useState(0);

  const stats = [
    { label: "Tokens Created", value: 1250, suffix: "+" },
    { label: "Active Users", value: 500, suffix: "+" },
    { label: "Campaigns Launched", value: 89, suffix: "" },
    { label: "Blockchain Networks", value: 1, suffix: "" },
  ];

  const team = [
    {
      name: "Rebirth",
      role: "Co-Founder & Developer",
      image: "https://unavatar.io/twitter/_therebirth",
      description:
        "Blockchain enthusiast and Web3 developer passionate about democratizing access to blockchain technology.",
      social: { twitter: "https://x.com/_therebirth", linkedin: "#", github: "#" },
    },
    {
      name: "Philip Gbangbola",
      role: "Co-Founder & Developer",
      image: "https://unavatar.io/twitter/gbangbolaphilip",
      description:
        "Full-stack developer and blockchain specialist focused on building innovative no-code solutions for Web3.",
      social: { twitter: "https://x.com/gbangbolaphilip", linkedin: "#", github: "#" },
    },
  ];

  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      <FloatingElements />

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-md text-white text-sm py-2 px-6 rounded-full border border-purple-400/50">
                <span className="mr-2 text-xs uppercase tracking-wider font-medium">
                  About StrataForge
                </span>
                <div className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse ml-2"></div>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-blue-200">
                Democratizing Token Creation
              </span>
            </h1>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We're building the future where anyone can transform their vision
              into digital assets, regardless of technical expertise.
              StrataForge is more than a platform—it's a movement toward
              accessible blockchain innovation.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 mb-20">
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Our Mission
              </h2>
              <p className="text-gray-300 leading-relaxed">
                To eliminate the technical barriers that prevent creators,
                entrepreneurs, and businesses from participating in the Web3
                economy. We believe that innovative ideas shouldn't be limited
                by coding expertise.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Our Vision</h2>
              <p className="text-gray-300 leading-relaxed">
                A world where blockchain technology is as accessible as creating
                a social media account. We envision millions of creators
                launching their digital assets, building communities, and
                participating in the decentralized economy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                Built on Cutting-Edge Technology
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our platform leverages the latest Web3 technologies to deliver a
              seamless, secure, and scalable token creation experience.
            </p>
          </div>

          <TechStack />
        </div>
      </section>

      {/* Timeline */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                Our Journey
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              From concept to reality, here's how we're building the future of
              token creation.
            </p>
          </div>

          <Timeline />
        </div>
      </section>

      {/* Team */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                Meet Our Team
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              The passionate individuals behind StrataForge, working to make
              blockchain accessible to everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <TeamMember key={index} {...member} />
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                Our Core Values
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Security First
              </h3>
              <p className="text-gray-400">
                Every smart contract is audited and tested. We prioritize
                security in every aspect of our platform.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Innovation
              </h3>
              <p className="text-gray-400">
                We continuously push the boundaries of what's possible in
                no-code blockchain development.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Community
              </h3>
              <p className="text-gray-400">
                We believe in the power of community-driven innovation and
                collaborative growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm rounded-3xl p-12 border border-purple-400/20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Vision?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of creators who are already building the future
              with StrataForge. Start your token creation journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/role-selection">
                <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg rounded-full px-8 py-4 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
                  Get Started Now
                </button>
              </Link>
              <Link href="/features">
                <button className="border border-purple-400/50 text-white font-semibold text-lg rounded-full px-8 py-4 transition-all duration-300 hover:bg-purple-500/10">
                  Explore Features
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                Get in Touch
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Have questions or want to collaborate? We'd love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">Email</h3>
              <p className="text-gray-400">hello@strataforge.io</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.902 4.902 0 01-2.224.084 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">Twitter</h3>
              <p className="text-gray-400">@StrataForge</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">LinkedIn</h3>
              <p className="text-gray-400">StrataForge</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default AboutUs;
