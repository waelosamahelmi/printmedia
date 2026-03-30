import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { InquiryBanner } from '@/components/layout/InquiryBanner'
import { HinnastoButton } from '@/components/layout/HinnastoButton'

export const dynamic = 'force-dynamic'

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>

      <HinnastoButton />

      <InquiryBanner />

      <Footer />
    </>
  )
}
