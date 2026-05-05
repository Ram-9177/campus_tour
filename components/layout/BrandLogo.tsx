import Image from 'next/image';
import smruLogo from '../../SMRU Logo.png';

interface BrandLogoProps {
  className?: string;
}

export default function BrandLogo({ className }: BrandLogoProps) {
  return (
    <Image
      src={smruLogo}
      alt="St. Mary's University logo"
      className={className ?? 'h-10 w-auto object-contain sm:h-11'}
      priority
    />
  );
}