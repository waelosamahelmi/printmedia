'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from '@/components/ui/Image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
} from 'lucide-react'

const navigation = [
  { name: 'Etusivu', href: '/' },
  { 
    name: 'Laitteet', 
    href: '/laitteet',
    children: [
      { name: 'Docan UV-tulostimet', href: '/laitteet/docan-uv-tulostimet' },
      { name: 'GCC-tarraleikkurit', href: '/laitteet/gcc-tarraleikkurit' },
      { name: 'Monitoimileikkurit', href: '/laitteet/monitoimileikkurit' },
      { name: 'Laminaattorit', href: '/laitteet/laminaattorit' },
    ]
  },
  { name: 'Tulostusvärit', href: '/tulostusvarit' },
  { name: 'Tulostusmateriaalit', href: '/tulostusmateriaalit' },
  { 
    name: 'Tarvikkeet', 
    href: '/tarvikkeet',
    children: [
      { name: 'Muut tarvikkeet', href: '/tarvikkeet/muut-tarvikkeet' },
    ]
  },
  { 
    name: 'Display-tuotteet', 
    href: '/display',
    children: [
      { name: 'Roll Up', href: '/display/roll-up' },
      { name: 'Messuseinät', href: '/display/messuseinat' },
      { name: 'Messupöydät', href: '/display/messupoydat' },
    ]
  },
  { 
    name: 'Huolto ja tuki', 
    href: '/huolto',
    children: [
      { name: 'Tulostimien varaosat', href: '/huolto/tulostimien-varaosat' },
      { name: 'Leikkureiden varaosat', href: '/huolto/leikkureiden-varaosat' },
      { name: 'Ergosoft RIP', href: '/huolto/ergosoft-rip' },
      { name: 'SAi Flexi', href: '/huolto/flexi' },
    ]
  },
  { name: 'Yritys', href: '/yritys' },
  { name: 'Yhteystiedot', href: '/yhteystiedot' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      )}
    >
      {/* Top bar */}
      <div className={cn(
        'border-b transition-all duration-300',
        isScrolled ? 'border-gray-100' : 'border-transparent'
      )}>
        <Container>
          <div className="hidden md:flex items-center justify-between py-2 text-sm">
            <div className="flex items-center gap-6 text-gray-600">
              <a
                href="tel:+358440875025"
                className="flex items-center gap-2 hover:text-primary-600 transition-colors"
              >
                <Phone className="w-4 h-4" />
                0440 875 025
              </a>
              <a
                href="mailto:myynti@printmedia.fi"
                className="flex items-center gap-2 hover:text-primary-600 transition-colors"
              >
                <Mail className="w-4 h-4" />
                myynti@printmedia.fi
              </a>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <MapPin className="w-4 h-4" />
              <span>Koskueentie 7, 19700 Sysmä</span>
            </div>
          </div>
        </Container>
      </div>

      {/* Main navigation */}
      <Container>
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/logos/logo.svg"
              alt="PrintMedia PM Solutions Oy"
              width={140}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.children && setOpenDropdown(item.name)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                      ? 'text-primary-600'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  )}
                >
                  {item.name}
                  {item.children && <ChevronDown className="w-4 h-4" />}
                </Link>
                
                {/* Dropdown menu */}
                {item.children && openDropdown === item.name && (
                  <div className="absolute top-full left-0 pt-2 z-50">
                    <div className="bg-white rounded-lg shadow-lg border border-gray-100 py-2 min-w-[220px]">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={cn(
                            'block px-4 py-2 text-sm transition-colors',
                            pathname === child.href
                              ? 'text-primary-600 bg-primary-50'
                              : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                          )}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button variant="accent" size="sm" href="/yhteystiedot">
              Pyydä tarjous
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </nav>
      </Container>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t border-gray-100 shadow-xl overflow-hidden"
          >
            <Container className="py-4">
              <div className="space-y-1">
                {navigation.map((item) => (
                  <div key={item.name}>
                    {item.children ? (
                      <>
                        <button
                          onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                          className={cn(
                            'flex items-center justify-between w-full px-4 py-3 rounded-lg font-medium transition-colors',
                            pathname.startsWith(item.href)
                              ? 'text-primary-600 bg-primary-50'
                              : 'text-gray-700 hover:bg-gray-50'
                          )}
                        >
                          {item.name}
                          <ChevronDown className={cn(
                            'w-4 h-4 transition-transform',
                            openDropdown === item.name && 'rotate-180'
                          )} />
                        </button>
                        <AnimatePresence>
                          {openDropdown === item.name && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-4 space-y-1 pb-2">
                                {item.children.map((child) => (
                                  <Link
                                    key={child.name}
                                    href={child.href}
                                    className={cn(
                                      'block px-4 py-2 rounded-lg text-sm transition-colors',
                                      pathname === child.href
                                        ? 'text-primary-600 bg-primary-50'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    )}
                                  >
                                    {child.name}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          'block px-4 py-3 rounded-lg font-medium transition-colors',
                          pathname === item.href
                            ? 'text-primary-600 bg-primary-50'
                            : 'text-gray-700 hover:bg-gray-50'
                        )}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <Button variant="accent" className="w-full" href="/yhteystiedot">
                  Pyydä tarjous
                </Button>
              </div>

              {/* Mobile contact info */}
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3 text-sm text-gray-600">
                <a
                  href="tel:+358440875025"
                  className="flex items-center gap-3 hover:text-primary-600"
                >
                  <Phone className="w-4 h-4" />
                  0440 875 025
                </a>
                <a
                  href="mailto:myynti@printmedia.fi"
                  className="flex items-center gap-3 hover:text-primary-600"
                >
                  <Mail className="w-4 h-4" />
                  myynti@printmedia.fi
                </a>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
