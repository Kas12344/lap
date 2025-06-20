
import Image from 'next/image';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface LogoProps extends HTMLAttributes<HTMLDivElement> {
  // You can add specific props for width/height if needed,
  // but next/image handles intrinsic sizing well.
}

const Logo = ({ className, ...props }: LogoProps) => {
  return (
    <div className={cn("relative h-12 w-32", className)} {...props}> {/* Default height */}
      <Image
        src="/data/logo.png" // Updated path
        alt="Lapzen Logo"
        fill
        style={{ objectFit: 'contain' }}
        priority
      />
    </div>
  );
};

export default Logo;
