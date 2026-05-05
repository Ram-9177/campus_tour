'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: 'Home', shortLabel: 'H' },
  { href: '/locations', label: 'Locations', shortLabel: 'L' },
  { href: '/map', label: 'Map', shortLabel: 'M' },
  { href: '/ai-guide', label: 'AI Guide', shortLabel: 'AI' },
  { href: '/brochures', label: 'Brochures', shortLabel: 'B' },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#dbe5f5] bg-white/96 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-backdrop-filter:bg-white/88"
    >
      <div className="mx-auto grid max-w-5xl grid-cols-5 gap-1 px-2 py-2">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/' ? pathname === '/' : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.label}
              className={`flex min-h-14 flex-col items-center justify-center rounded-2xl px-1 py-2 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                isActive
                  ? 'bg-[#eef4ff] text-[#0b57d0]'
                  : 'text-slate-600 hover:bg-[#f5f9ff]'
              }`}
            >
              <span
                aria-hidden="true"
                className={`mb-1 flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-semibold ${
                  isActive
                    ? 'bg-[#0b57d0] text-white'
                    : 'border border-[#dbe5f5] bg-white text-slate-700'
                }`}
              >
                {item.shortLabel}
              </span>
              <span className="truncate text-center leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
