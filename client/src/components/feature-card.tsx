import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

const FeatureCard = ({ icon: Icon, title, description, className }: FeatureCardProps) => {
  return (
    <div className={`bg-gray-850 p-6 border border-gray-700 transform transition-all duration-300 hover:shadow-xl hover:border-cyan-500 ${className}`}>
      <div className="flex items-center justify-center w-12 h-12 bg-cyan-500/10 mb-4">
        <Icon className="w-6 h-6 text-cyan-500" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-cyan-500">{title}</h3>
      <p className="text-gray-400 text-light">{description}</p>
    </div>
  );
};

export default FeatureCard;