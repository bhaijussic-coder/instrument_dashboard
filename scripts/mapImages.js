const fs = require('fs')
const path = require('path')

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images')
const STORE_FILE = path.join(__dirname, '..', 'src', 'store', 'contextStore.jsx')
const OUT_FILE = path.join(IMAGES_DIR, 'manifest.json')

function normalize(s){
  return String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '')
}

// Read instrument names from contextStore (INSTRUMENT_CATEGORIES block)
const storeSrc = fs.readFileSync(STORE_FILE, 'utf8')
const blockMatch = storeSrc.match(/const INSTRUMENT_CATEGORIES = \{([\s\S]*?)\n\}/)
let instruments = []
if(blockMatch){
  const block = blockMatch[1]
  const stringMatches = [...block.matchAll(/'([^']+)'/g)].map(m=>m[1])
  instruments = Array.from(new Set(stringMatches))
}

if(instruments.length === 0){
  console.error('Could not extract instruments from contextStore. Please update manifest manually.')
}

const files = fs.existsSync(IMAGES_DIR) ? fs.readdirSync(IMAGES_DIR).filter(f=>/\.(jpe?g|png|webp)$/i.test(f)) : []

const map = {}

files.forEach(f => {
  const name = path.parse(f).name
  const n = normalize(name)

  // Best-effort match: exact, includes, startsWith
  let best = null
  for(const instr of instruments){
    const instrNorm = normalize(instr)
    if(instrNorm === n){ best = instr; break }
    if(instrNorm.includes(n) || n.includes(instrNorm)){ best = instr; break }
  }

  // fallback: find first instrument where tokens overlap
  if(!best){
    const tokens = name.split(/[^a-zA-Z0-9]+/).filter(Boolean).map(t=>normalize(t))
    for(const instr of instruments){
      const instrNorm = normalize(instr)
      if(tokens.some(tok => instrNorm.includes(tok))){ best = instr; break }
    }
  }

  map[f] = { filename: f, instrument: best || null }
})

fs.writeFileSync(OUT_FILE, JSON.stringify(map, null, 2))
console.log('Wrote', OUT_FILE)
console.log('Mapping summary:')
Object.entries(map).forEach(([k,v])=> console.log(k, '->', v.instrument))
