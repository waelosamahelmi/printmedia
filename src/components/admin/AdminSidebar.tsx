'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from '@/components/ui/Image'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  Package,
  FolderTree,
  Image as ImageIcon,
  Settings,
  Navigation,
  Users,
  LogOut,
  ChevronDown,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useState } from 'react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Sivut',
    href: '/admin/pages',
    icon: FileText,
  },
  {
    name: 'Tuotteet',
    href: '/admin/products',
    icon: Package,
    children: [
      { name: 'Kaikki tuotteet', href: '/admin/products' },
      { name: 'Kategoriat', href: '/admin/products/categories' },
    ],
  },
  {
    name: 'Media',
    href: '/admin/media',
    icon: ImageIcon,
  },
  {
    name: 'Navigaatio',
    href: '/admin/navigation',
    icon: Navigation,
  },
  {
    name: 'Käyttäjät',
    href: '/admin/users',
    icon: Users,
  },
  {
    name: 'Asetukset',
    href: '/admin/settings',
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = useState<string[]>([])

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    )
  }

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white hidden lg:block">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <Link href="/admin" className="flex items-center gap-3">
          <Image
            src="/images/logos/logo.svg"
            alt="PrintMedia"
            width={32}
            height={32}
            className="brightness-0 invert"
          />
          <span className="font-bold text-lg">Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {navigation.map((item) => (
          <div key={item.name}>
            {item.children ? (
              <>
                <button
                  onClick={() => toggleMenu(item.name)}
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors',
                    isActive(item.href)
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </div>
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 transition-transform',
                      openMenus.includes(item.name) && 'rotate-180'
                    )}
                  />
                </button>
                {openMenus.includes(item.name) && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          'block px-4 py-2 rounded-lg text-sm transition-colors',
                          pathname === child.href
                            ? 'bg-gray-800 text-white'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        )}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive(item.href)
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm"
        >
          Näytä sivusto →
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" />
          Kirjaudu ulos
        </button>
      </div>
    </aside>
  )
}
