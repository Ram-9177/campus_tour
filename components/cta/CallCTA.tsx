import Link from 'next/link';

interface CallCTAProps {
  href?: string;
}

export default function CallCTA({ href = '#' }: CallCTAProps) {
  return (
    <Link
      href={href}
      className="btn-secondary inline-flex min-h-11 w-full items-center justify-center"
      aria-label="Call support placeholder"
    >
      Call Support
    </Link>
  );
}
