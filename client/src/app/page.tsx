"use client";

import FeatureCard from '@/components/feature-card';
import Footer from '@/components/footer';
import HeroSection from '@/components/hero-section';
import Navbar from '@/components/landing-navbar';
import SectionWrapper from '@/components/section-wrapper';
import { Button } from '@/components/ui/button';
import { Users, ShieldCheck, BarChart3, Coins, Play, Settings, Plus, X, CircleDollarSign, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect } from 'react';

const coreFeatures = [
  {
    icon: Users,
    title: "ClubNFTs: Your Football Identity",
    description: "Mint your unique ClubNFT representing your football club. Track stats, achievements, and manage your ProCoin treasury.",
  },
  {
    icon: ShieldCheck,
    title: "PlayerNFTs: Stars of the Pitch",
    description: "Each PlayerNFT has unique positions, skills, images, and names. Build your dream team with verifiable digital assets.",
  },
  {
    icon: BarChart3,
    title: "Fair Match Simulation with AI",
    description: "Experience transparent and verifiable match outcomes powered by AI off-chain computation.",
  },
];

const economyFeatures = [
  {
    icon: Play,
    title: "Dynamic Game Economy Loop",
    description: "Challenge → Match → Rewards → Improvements → Repeat. Engage by hosting matches, winning bonuses, and strategic squad management.",
  },
  {
    icon: Coins,
    title: "ProCoin: The Game's Currency",
    description: "A fungible token fueling the ProClubs3 ecosystem. Earn through victories, achievements, and tournament wins.",
  },
  {
    icon: Settings, // Using Settings icon for Transfer Market
    title: "Kiosk-Powered Transfer Market",
    description: "Seamlessly trade PlayerNFTs using Sui's Kiosk standard, creating a fluid and secure player marketplace.",
  },
];

const tokenomicsFeatures = [
 {
    icon: Plus,
    title: "ProCoin Minting Mechanisms",
    description: "Initial allocation for new users, rewards for matches (wins, goals, clean sheets), tournament prize pools, and special achievements.",
  },
  {
    icon: X, // Using X for sinks, or could use Minus
    title: "ProCoin Token Sinks",
    description: "Balanced economy through player transfers, entry fees for premium tournaments, and player contract renewals.",
  },
  {
    icon: CircleDollarSign,
    title: "Balanced Tokenomics",
    description: "Designed for a sustainable and engaging in-game economy, rewarding skill, strategy, and participation.",
  }
];

export default function Home() {
useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Optional: stop observing once visible
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => elements.forEach((el) => observer.unobserve(el));
  }, []);

  return (
    <div className="bg-gray-950 min-h-screen text-white">
      <Navbar />
      <main>
        <HeroSection />

        <SectionWrapper id="features" className="animate-on-scroll">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Core Game Architecture</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Discover the foundational elements that make ProClubs3 a unique football experience.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </SectionWrapper>

        <SectionWrapper id="economy" className="bg-gray-900 animate-on-scroll">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">The ProClubs3 Economy</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Engage in a vibrant ecosystem driven by strategy, skill, and rewards.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {economyFeatures.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                className="bg-gray-900 border-border" // Different card bg for this section
              />
            ))}
          </div>
           <div className="mt-12 text-center animate-on-scroll">
            <h3 className="text-2xl font-semibold mb-4">Key Strategic Elements:</h3>
            <ul className="list-disc list-inside inline-block text-left text-muted-cyan-500 space-y-2">
              <li>Master tactical systems with four distinct playing styles</li>
              <li>Create dynamic match strategies with realistic player movements</li>
              <li>Build a sustainable club through smart resource management</li>
            </ul>
          </div>
        </SectionWrapper>

        <SectionWrapper id="token" className="animate-on-scroll">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">ProCoin Tokenomics</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Understand the flow and utility of ProCoin, the heart of our game&apos;s economy.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tokenomicsFeatures.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </SectionWrapper>

        <SectionWrapper id="cta" className="bg-cyan-500 text-background animate-on-scroll">
          <div className="text-center py-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Build Your Legacy?</h2>
            <p className="text-lg text-cyan-100 mb-8 max-w-2xl mx-auto">
              Join the ProClubs3 community and be among the first to experience the future of football gaming.
            </p>
            <Link href="https://x.com/ProClubs_3">
              <Button size="lg" className=" bg-gray-900 text-cyan-500 hover:bg-gray-200 rounded-none text-lg font-light px-10 py-4">
                Sign Up for Updates
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </SectionWrapper>

      </main>
      <Footer />
    </div>
  );
}