'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Send, Phone, Mail, MapPin, Clock, CheckCircle } from 'lucide-react'

interface ContactFormProps {
  showMap?: boolean
}

export function ContactForm({ showMap = true }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
  })
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Viestin lahetys epaonnistui')
      }

      setIsSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Viestin lahetys epaonnistui. Yrita myohemmin uudelleen.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  if (isSubmitted) {
    return (
      <section className="section">
        <Container>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center py-16"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Kiitos viestistäsi!
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Olemme vastaanottaneet viestisi ja palaamme asiaan mahdollisimman
              pian. Yleensä vastaamme 1-2 arkipäivän kuluessa.
            </p>
            <Button onClick={() => setIsSubmitted(false)}>
              Lähetä uusi viesti
            </Button>
          </motion.div>
        </Container>
      </section>
    )
  }

  return (
    <section className="section bg-gray-50">
      <Container>
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Ota yhteyttä
            </h2>
            <p className="text-gray-600 mb-8">
              Autamme mielellämme kaikissa tulostus- ja leikkausratkaisuihin
              liittyvissä kysymyksissä. Ota yhteyttä, niin löydetään yhdessä
              paras ratkaisu tarpeisiisi.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Puhelin</h3>
                  <a
                    href="tel:+358440875025"
                    className="text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    0440 875 025
                  </a>
                  <br />
                  <span className="text-sm text-gray-500">
                    Harri Hynynen (Toimitusjohtaja): 0440 875 020
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Sähköposti</h3>
                  <a
                    href="mailto:myynti@printmedia.fi"
                    className="text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    myynti@printmedia.fi
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Osoite</h3>
                  <p className="text-gray-600">
                    PrintMedia PM Solutions Oy
                    <br />
                    Koskueentie 7
                    <br />
                    19700 Sysmä
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Y-tunnus: 1877937-4
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Aukioloajat</h3>
                  <p className="text-gray-600">
                    Ma-Pe 8:00-16:00
                    <br />
                    La-Su Suljettu
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Laheta viesti
              </h3>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="label">
                      Nimi *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="input"
                      placeholder="Etunimi Sukunimi"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="label">
                      Sähköposti *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="input"
                      placeholder="email@yritys.fi"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="label">
                      Puhelin
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input"
                      placeholder="+358 40 123 4567"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="label">
                      Yritys
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="input"
                      placeholder="Yrityksen nimi"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="label">
                    Aihe *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="">Valitse aihe</option>
                    <option value="tarjouspyynto">Tarjouspyyntö</option>
                    <option value="tuotetiedustelu">Tuotetiedustelu</option>
                    <option value="huolto">Huolto ja tuki</option>
                    <option value="varaosat">Varaosat ja tarvikkeet</option>
                    <option value="muu">Muu asia</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="label">
                    Viesti *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="input resize-none"
                    placeholder="Kerro tarkemmin, miten voimme auttaa..."
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  isLoading={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  <Send className="w-5 h-5" />
                  Lähetä viesti
                </Button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Map */}
        {showMap && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <div className="rounded-2xl overflow-hidden shadow-xl h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1943.5!2d25.508!3d61.502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x468e1b0a5b5b5b5b%3A0x5b5b5b5b5b5b5b5b!2sKoskueentie%207%2C%2019700%20Sysm%C3%A4!5e0!3m2!1sfi!2sfi!4v1710000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="PrintMedia PM Solutions Oy sijainti"
              />
            </div>
          </motion.div>
        )}
      </Container>
    </section>
  )
}
