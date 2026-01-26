'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from '@/components/ui/Image'
import { Button } from '@/components/ui/Button'
import { Lock, Mail, AlertCircle } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  // Sanitize callback URL to prevent redirect loops - only allow simple paths
  const rawCallbackUrl = searchParams.get('callbackUrl') || '/admin'
  const callbackUrl = rawCallbackUrl.startsWith('/admin') && !rawCallbackUrl.includes('login') 
    ? rawCallbackUrl.split('?')[0] // Remove any query params
    : '/admin'
  const error = searchParams.get('error')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(error)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setLoginError(null)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      })

      if (result?.error) {
        setLoginError(result.error)
      } else if (result?.ok) {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (error) {
      setLoginError('Kirjautuminen epäonnistui. Yritä uudelleen.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/logo.svg"
            alt="PrintMedia"
            width={180}
            height={50}
            className="mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900">Hallintapaneeli</h1>
          <p className="text-gray-600">Kirjaudu sisään jatkaaksesi</p>
        </div>

        {/* Login form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {loginError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{loginError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="label">
                Sähköposti
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10"
                  placeholder="admin@printmedia.fi"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="label">
                Salasana
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              Kirjaudu sisään
            </Button>
          </form>
        </div>

        {/* Help text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Ongelmia kirjautumisessa?{' '}
          <a
            href="mailto:admin@printmedia.fi"
            className="text-primary-600 hover:underline"
          >
            Ota yhteyttä
          </a>
        </p>
      </div>
    </div>
  )
}

function LoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md text-center">
        <div className="animate-pulse">
          <div className="h-12 w-48 bg-gray-200 rounded mx-auto mb-4"></div>
          <div className="h-8 w-32 bg-gray-200 rounded mx-auto mb-2"></div>
          <div className="h-4 w-48 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  )
}

