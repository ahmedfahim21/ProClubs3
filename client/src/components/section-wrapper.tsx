import { cn } from '@/lib/utils';

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const SectionWrapper = ({ children, className, id }: SectionWrapperProps) => {
  return (
    <section id={id} className={cn("p-12", className)}>
      <div className="container mx-auto mt-20 px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
};

export default SectionWrapper;