import { Metadata } from 'next'
import { ContactForm } from '@/components/sections/ContactForm'

export const metadata: Metadata = {
  title: 'Yhteystiedot',
  description:
    'Ota yhteyttä PrintMedia PM Solutionsiin. Lähetä tarjouspyyntö tai tiedustelu yhteydenottolomakkeella.',
}

export default function YhteystiedotPage() {
  return <ContactForm showMap={true} />
}
