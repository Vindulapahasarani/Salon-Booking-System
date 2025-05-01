// app/admin/layout.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/services', label: 'Services' },
    { href: '/admin/calendar', label: 'Calendar' },
    { href: '/admin/appointments', label: 'Appointments' },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="w-48 bg-white h-full p-4 border-r shadow-sm">
        <h2 className="text-lg font-bold mb-4">Admin Panel</h2>
        <nav className="flex flex-col gap-2">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-4 py-2 rounded-lg hover:bg-gray-100 transition ${
                pathname === href ? 'bg-blue-100 text-blue-800 font-semibold' : 'text-gray-700'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
