
import type { ReactNode } from 'react';

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

const PageWrapper = ({ children, className = '' }: PageWrapperProps) => {
  return (
    <div className={`container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-fade-in ${className}`}>
      {children}
    </div>
  );
};

export default PageWrapper;
