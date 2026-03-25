const fs = require('fs')
const xml = fs.readFileSync('tmp/docx/unzipped/word/document.xml', 'utf8')
const rels = fs.readFileSync('tmp/docx/unzipped/word/_rels/document.xml.rels', 'utf8')

const relMap = {}
for (const m of rels.matchAll(/Id="(rId\d+)"[^>]*Target="([^"]+)"/g)) {
  relMap[m[1]] = m[2]
}

const keys = [
  'Jetbest ES3 - värikasetti 440 ml',
  'Jetbest ES3 - täyttöpullo 500 ml',
  'Jetbest SS21',
  'Jetbest I-2',
  'Jetbest puhdistu',
  'Jetbest LUS-170',
  'Chromoink',
]

for (const key of keys) {
  const idx = xml.indexOf(key)
  if (idx < 0) {
    console.log(`\n${key}: not found`)
    continue
  }

  const chunk = xml.slice(Math.max(0, idx - 6000), Math.min(xml.length, idx + 6000))
  const ids = [...chunk.matchAll(/r:embed="(rId\d+)"/g)].map((x) => x[1])
  const uniq = [...new Set(ids)]

  console.log(`\n${key}`)
  console.log('rIds:', uniq.join(', '))
  console.log('targets:', uniq.map((id) => relMap[id]).filter(Boolean).join(', '))
}
