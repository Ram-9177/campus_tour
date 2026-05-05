import Link from 'next/link';

interface WhatsAppCTAProps {
  href?: string;
}

export default function WhatsAppCTA({ href = '#' }: WhatsAppCTAProps) {
  return (
    <Link
      href={href}
      className="btn-secondary inline-flex min-h-11 w-full items-center justify-center"
      aria-label="Open WhatsApp support placeholder"
    >
      WhatsApp Support
    </Link>
  );
}
