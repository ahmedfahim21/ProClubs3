import Image from "next/image";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-900 border-t border-border py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex flex-col items-center mb-6">
          <Image src="/ProClubs3.png" alt="Logo" className="w-8 h-8" width={24} height={24} />
          <span className="text-2xl font-bold text-cyan-500">ProClubs3</span>
        </div>
        <p className="text-muted-cyan-500 mb-6">
          Revolutionizing football gaming on the blockchain.
        </p>
        <div className="flex justify-center space-x-6 mb-8">
          {/* Placeholder for social links */}
          <a href="#" className="text-muted-cyan-500 hover:text-cyan-500">Twitter</a>
          <a href="#" className="text-muted-cyan-500 hover:text-cyan-500">Discord</a>
          <a href="#" className="text-muted-cyan-500 hover:text-cyan-500">Telegram</a>
        </div>
        <p className="text-sm text-muted-cyan-500">
          &copy; {currentYear} ProClubs3. All rights reserved. Built on Sui.
        </p>
      </div>
    </footer>
  );
};

export default Footer;