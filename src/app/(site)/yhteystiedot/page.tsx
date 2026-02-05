import { Metadata } from 'next'
import { ContactForm } from '@/components/sections/ContactForm'

export const metadata: Metadata = {
  title: 'Yhteystiedot',
  description:
    'Ota yhteyttä PrintMedia PM Solutions Oy:öön. Autamme sinua löytämään parhaat tulostus- ja leikkausratkaisut. Puh: 0440 875 025',
}

export default function YhteystiedotPage() {
  return (
    <div className="pt-32">
      <ContactForm showMap={true} />
    </div>
  )
}
