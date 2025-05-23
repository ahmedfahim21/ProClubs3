import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-cyan-500/50 shadow-lg transition-all duration-300 ease-in-out">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/ProClubs3.png" alt="Logo" className="w-8 h-8" width={24} height={24} />
            <span className="text-2xl font-bold text-cyan-500">ProClubs3</span>
          </Link>
          <div className="flex items-center space-x-4">
            <a href="#features" className="text-muted-cyan-500 hover:text-cyan-500 transition-colors">Features</a>
            <a href="#economy" className="text-muted-cyan-500 hover:text-cyan-500 transition-colors">Economy</a>
            <a href="#token" className="text-muted-cyan-500 hover:text-cyan-500 transition-colors">Token</a>
            <Link href="/init/connect">
              <Button className="btn bg-cyan-500 hover:bg-cyan-600 font-light text-gray-950 rounded-none">Join the Beta</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;