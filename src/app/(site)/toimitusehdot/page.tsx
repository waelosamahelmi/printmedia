import { Metadata } from 'next'
import { Container } from '@/components/ui/Container'

export const metadata: Metadata = {
  title: 'Toimitusehdot | PrintMedia PM Solutions Oy',
  description:
    'PrintMedia PM Solutions Oy:n yleiset toimitusehdot. Voimassa 1.1.2011 alkaen.',
}

export default function ToimitusehdotPage() {
  return (
    <div className="pt-32 pb-20">
      <Container>
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Toimitusehdot
          </h1>
          <p className="text-xl text-gray-600">
            PrintMedia PM Solutions Oy:n yleiset toimitusehdot 1.1.2011 alkaen
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <h2>Yleistä</h2>
          
          <h3>Soveltamisala</h3>
          <p>
            PrintMedia PM Solutions Oy:n yleisiä toimitusehtoja sovelletaan Suomessa 
            tapahtuviin toimituksiin. Näissä ehdoissa PrintMedia PM Solutions Oy on 
            myyjä ja asiakas on ostaja. Näitä ehtoja sovelletaan, ellei kirjallisesti 
            ole toisin sovittu.
          </p>

          <h3>Hinnat</h3>
          <p>
            Ilmoitamme hinnat ilman arvonlisäveroa 24 %. Asennusajasta veloitamme 
            70 € / h, ajoajasta 50 € / h ja kilometrikorvaus 0,45 € / km. Rullan 
            kavennuksesta veloitamme 10 € / rulla, rullan leveydestä riippumatta. 
            Pidätämme oikeuden hintojen tarkistuksiin ilman ennakkoilmoitusta sekä 
            virheellisen hinnoittelun korjaamiseen. Toimituskulut määräytyvät 
            Matkahuollon ja Kaukokiidon voimassa olevien hinnastojen mukaan.
          </p>

          <h3>Tarjoukset ja myyntiehdot</h3>
          <p>
            Myyjän tarjoukset ovat voimassa tarjouksessa mainitun ajan. Mikäli 
            voimassaoloaikaa ei ole mainittu, tarjous on voimassa yhden kuukauden 
            tarjouksen päivämäärästä. Tarjouksen saajalla ei ole oikeutta käyttää 
            tarjouksen tietoja myyjän vahingoksi tai antaa niistä tietoja kolmansille 
            osapuolille.
          </p>

          <h3>Tilaus</h3>
          <p>
            Laitekaupassa sopimus syntyy, kun ostaja on hyväksynyt kauppasopimuksen 
            tai tilausvahvistuksen ilman muutoksia ja/tai varauksia. Muussa kuin 
            laitekaupassa sopimus syntyy, kun myyjä on vahvistanut tilauksen. Osan 
            tuotteista toimitamme toimitusmyyntinä.
          </p>

          <h2>Myyjän velvollisuudet</h2>

          <h3>Toimitusaika</h3>
          <p>
            Ellei toisin ole sovittu, toimitusaika on luettava alkavaksi sopimuksen 
            syntymisajankohdasta. Ennen klo 14:00 tulleet tilaukset lähtevät meiltä 
            Matkahuoltoon vielä samana päivänä. Lavatavarat toimitamme 2 päivän 
            sisällä tilauksesta (Kaukokiito, Transpoint, Kiitolinja).
          </p>
          <p>
            Käytössämme olevat toimitustavat ovat: Matkahuolto (bussirahti, jakorahti, 
            pikarahti), Kaukokiito (lavatavarat), Posti (kirje), Transpoint ja 
            Kiitolinja (asiakkaan omalla sopimuksella).
          </p>

          <h3>Toimitusehtolausekkeet</h3>
          <p>
            Kotimaan kaupassa käytetään vapaasti varastosta, mikäli muuta ei ole 
            sovittu. Laitekaupoissa toimitustapa on vapaasti varastoon, ellei toisin 
            ole sovittu. Vaaranvastuu siirtyy ostajalle sovelletun toimitusehdon mukaan.
          </p>

          <h3>Laitetakuu</h3>
          <p>
            Myydyille laitteille on voimassa tarjouksen mukainen takuuaika, ellei 
            toisin sovita. Laitetakuu sisältää laitteen korjaamisen PrintMedia PM 
            Solutions Oy:n tiloissa Sysmässä tai asiakkaan omissa tiloissa. Myyjä 
            maksaa takuulaitteen toimittamisen Sysmään ja palauttaa laitteen 
            asiakkaalle ilman rahtikuluja.
          </p>
          <p>
            Laitetakuu ei ole voimassa, mikäli laitteen ylläpidosta ei ole huolehdittu 
            asianmukaisesti. Mikäli on todettavissa, että rikkoutuminen on käyttäjän 
            aiheuttama tai mikäli laitteeseen on tehty muutoksia tai siinä ei käytetä 
            tai ei ole käytetty PrintMedia PM Solutions Oy:n toimittamia tarvikkeita 
            (esim. värit). Laitteen korjaaminen ei pidennä sen takuuaikaa.
          </p>
          <p>
            Takuu kattaa vain laitteelle itselleen tapahtuvat vahingot. Takuuseen 
            perustuva vaatimus on esitettävä tuotteen myyjälle 7 arkipäivän kuluessa 
            siitä, kun takuun kattava vika on havaittu.
          </p>

          <h3>Tuotteen ominaisuudet</h3>
          <p>
            Myyjä vastaa tuotteen laadusta ja muista ominaisuuksista vain sopimuksessa 
            määriteltyjen tietojen mukaisesti. Myyjän korvausvelvollisuus kattaa 
            ainoastaan viallisen tuotteen ostohinnan. Myyjällä ei ole velvollisuutta 
            korvata muita välittömiä eikä välillisiä vahinkoja tai kustannuksia.
          </p>

          <h3>Viivästys</h3>
          <p>
            Myyjä on velvollinen heti viivästyksestä tiedon saatuaan ilmoittamaan 
            siitä ostajalle ilmoittaen samalla viivästyksen syyn ja arvioidun uuden 
            toimituspäivän.
          </p>

          <h2>Ostajan velvollisuudet</h2>

          <h3>Kauppahinnan suorittaminen</h3>
          <p>
            Mikäli maksuajasta ei ole muuta sovittu, on se neljätoista (14) pv netto. 
            Maksuaika lasketaan laskun päivämäärästä.
          </p>

          <h3>Viivästyskorko ja perintäkulut</h3>
          <p>
            Maksun viivästyessä viivästysajalta peritään yhdentoista (11) prosentin 
            viivästyskorko. Myyjällä on viivästyskoron lisäksi oikeus periä 
            kohtuulliset perintäkulut.
          </p>

          <h3>Vastaanotto- ja käyttötarkastus</h3>
          <p>
            Ostajan tai tämän edustajan on tavaraa vastaanottaessaan todettava, että 
            toimitus on lähetysluettelon mukainen ja tarkastettava, että se on 
            ulkopuolisesti vahingoittumaton. Vastaanottotarkastus on tehtävä 7 pv:n 
            kuluessa tavaran saapumisesta ja samassa ajassa ilmoitettava mahdollinen 
            virhe.
          </p>
          <p>
            Kuljetusvahingosta tai kollien puuttumisesta, joka havaitaan tavaraa 
            vastaanotettaessa, on ilmoitettava välittömästi rahdinkuljettajalle. 
            Puutteesta on tehtävä merkintä rahtikirjaan ja asianmukainen reklamaatio 
            myyjälle sekä rahdinkuljettajalle.
          </p>

          <h3>Tuotteiden palautukset</h3>
          <p>
            Ostajalla on oikeus palauttaa ostamansa tuote 7 pv:n sisällä tavaran 
            vastaanottamisesta. Mikäli tuote on tilattu nimenomaan asiakkaalle tai 
            sitä on leikattu tai muuten käsitelty, palautusoikeutta ei ole.
          </p>
          <p>
            Tuotteiden palautuksesta on aina sovittava etukäteen myyjän edustajan 
            kanssa ja palautuksen on tapahduttava välittömästi sopimuksen jälkeen. 
            Myyjä ei suorita hyvityksiä ilman sopimusta palautetuista tavaroista. 
            Tavarapalautuksen hyväksymisen ehtona on, että tavara pakkauksineen on 
            palautettaessa täysin virheetön.
          </p>

          <h2>Sopimuksen purkaminen</h2>

          <h3>Ostajan oikeus purkuun</h3>
          <p>
            Mikäli myyjän toimitus poikkeaa olennaisesti sovitusta eikä puutetta 
            ostajan kirjallisen huomautuksen johdosta kohtuullisessa ajassa korjata 
            tai uutta sopimuksen mukaista tavaraa toimiteta tai jos myyjästä 
            riippuvasta syystä toimitus viivästyy olennaisesti siten, että siitä 
            aiheutuu ostajalle kohtuutonta haittaa, ostajalla on oikeus purkaa sopimus.
          </p>

          <h3>Myyjän oikeus purkuun</h3>
          <p>
            Mikäli kauppahinnan maksu tai osa siitä olennaisesti viivästyy 
            eräpäivästään, myyjällä on oikeus valintansa mukaan purkaa kauppa 
            kokonaisuudessaan tai se osa kauppaa, jota koskevaa tavaraa ostaja ei 
            ole vielä vastaanottanut.
          </p>

          <h3>Ylivoimainen este</h3>
          <p>
            Myyjä ei ole velvollinen täyttämään sopimusta, jos luonnoneste, tulipalo, 
            konevaurio tai siihen verrattava häiriö, lakko, työsulku, sota, 
            liikekannallepano, vienti- tai tuontikielto, kuljetusvälineiden puute, 
            valmistuksen lopettaminen, liikennehäiriö tai muu sellainen este, jota 
            myyjä ei voi voittaa, estää tavaran tai sen osan toimittamisen.
          </p>

          <h2>Omistusoikeuden siirtyminen</h2>
          <p>
            Omistusoikeus tavaraan siirtyy ostajalle silloin, kun koko kauppahinta 
            on maksettu, ellei erikseen ole toisin sovittu.
          </p>

          <h2>Sovellettava laki ja erimielisyyksien ratkaiseminen</h2>
          <p>
            Myyjän ja ostajan välisiin sopimuksiin sovelletaan Suomen lakia. Ellei 
            toisin ole sovittu, myyjän ja ostajan väliset erimielisyydet ratkaistaan 
            myyjän kotipaikan alioikeudessa.
          </p>

          <div className="bg-gray-50 rounded-xl p-6 mt-12 not-prose">
            <p className="text-gray-600 mb-4">
              Toivomme, että olet tyytyväinen testattuihin tuotteisiimme ja voit tehdä 
              kannattavaa tulostusta hyvällä menestyksellä.
            </p>
            <p className="font-semibold text-gray-900">
              PRINTMEDIA PM SOLUTIONS OY
            </p>
            <p className="text-gray-600">
              Harri Hynynen<br />
              Toimitusjohtaja
            </p>
          </div>
        </div>
      </Container>
    </div>
  )
}
