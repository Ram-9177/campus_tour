import Link from 'next/link';

export default function AIGuideButton() {
  return (
    <Link
      href="/ai-guide"
      aria-label="Open AI Guide"
      className="fixed bottom-24 right-4 z-40 inline-flex min-h-12 items-center justify-center rounded-full border border-[#9ebcf3] bg-[#0b57d0] px-4 text-sm font-semibold text-white shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 sm:right-6"
    >
      AI Guide
    </Link>
  );
}
