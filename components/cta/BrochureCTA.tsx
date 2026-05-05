import Link from 'next/link';

interface BrochureCTAProps {
  href?: string;
}

export default function BrochureCTA({ href = '/brochures' }: BrochureCTAProps) {
  return (
    <Link
      href={href}
      className="btn-secondary inline-flex min-h-11 w-full items-center justify-center"
      aria-label="Open brochure placeholder"
    >
      Open Brochure
    </Link>
  );
}
