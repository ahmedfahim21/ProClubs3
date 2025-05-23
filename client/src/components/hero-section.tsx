import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import SectionWrapper from './section-wrapper';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <SectionWrapper className="relative pt-40 pb-20 text-center bg-gradient-to-b from-gray-900 to-transparent min-h-screen flex flex-col justify-center items-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="/background.png"
        alt="Background"
        fill
        className="absolute inset-0 w-full h-full object-cover opacity-10 md:opacity-20 z-0" // Lower opacity for subtlety
      />

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col justify-center items-center w-full">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-600 animate-fade-in-up">
          ProClubs3
        </h1>
        <p className="text-xl md:text-2xl text-muted-cyan-500 mb-10 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Own Your Football Legacy. A revolutionary football simulation game on the Sui Blockchain.
          Built with AI Agents, Walrus, and cutting-edge tech.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Link href='/init/connect'>
            <Button size="lg" className="btn bg-cyan-500 hover:bg-cyan-600 font-light text-gray-950 rounded-none text-lg px-8 py-4">
              Join the Beta
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="btn font-light rounded-none text-lg px-8 py-4 border-cyan-500 bg-gray-900 text-cyan-500 hover:text-white hover:bg-cyan-500">
            Learn More
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default HeroSection;