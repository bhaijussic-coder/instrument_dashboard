import React, { useState, useMemo, useEffect } from 'react'
import { useStore } from '../store/contextStore'

export default function Home({onOpenDashboard}){
  const {state} = useStore()
  const [query, setQuery] = useState('')
  const [openCats, setOpenCats] = useState(() => {
    const map = {}
    if (state.instrumentsByCategory) Object.keys(state.instrumentsByCategory).forEach(k => map[k] = false)
    return map
  })
  const [currentInstrumentIdx, setCurrentInstrumentIdx] = useState(0)

  const categories = state.instrumentsByCategory || {}
  const allInstruments = state.instruments || []
  const metadata = state.instrumentMetadata || {}

  // Auto-rotate instruments every 50 seconds
  useEffect(() => {
    if (allInstruments.length === 0) return
    const timer = setInterval(() => {
      setCurrentInstrumentIdx(prev => (prev + 1) % allInstruments.length)
    }, 50000) // 50 seconds
    return () => clearInterval(timer)
  }, [allInstruments.length])

  const currentInstrument = allInstruments[currentInstrumentIdx]
  const instrumentInfo = metadata[currentInstrument] || { desc: 'Surgical instrument for precision procedures', category: 'Instruments' }
  const slug = currentInstrument ? currentInstrument.replace(/[^a-z0-9]+/gi, '_').toLowerCase() : 'instrument'
  const localImg = `/images/${slug}.jpg`
  const fallbackImg = `https://picsum.photos/seed/${encodeURIComponent(currentInstrument)}/400/300`

  const filtered = useMemo(() => {
    if (!query) return categories
    const q = query.toLowerCase()
    const out = {}
    Object.entries(categories).forEach(([cat, list]) => {
      const items = list.filter(i => i.toLowerCase().includes(q))
      if (items.length) out[cat] = items
    })
    return out
  }, [categories, query])

  function toggle(cat){
    setOpenCats(prev => ({...prev, [cat]: !prev[cat]}))
  }

  return (
    <div className="full-hero">
      <div className="container">
        <section className="hero" style={{gap:20}}>
      <div style={{flex:1}}>
        <h2>Welcome to Mudra Instruments Testing</h2>
        <p className="muted">Monitor surgical instrument function tests, telemetry, and alerts.</p>
        <div style={{marginTop:12, display:'flex', gap:12}}>
          <button className="cta" onClick={onOpenDashboard}>Open Dashboard</button>
          <button className="btn" onClick={()=>setQuery('')}>Reset Filter</button>
        </div>

        <div className="catalog-card" style={{marginTop:20}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <h3 style={{margin:0}}>Instrument Catalog</h3>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <input className="catalog-search" placeholder="Search instruments..." value={query} onChange={e=>setQuery(e.target.value)} />
              <div className="badge">{Object.values(categories).flat().length}</div>
            </div>
          </div>

          <div style={{marginTop:12}}>
            {Object.keys(filtered).length === 0 && <p className="muted">No instruments match "{query}"</p>}

            {Object.entries(filtered).map(([cat, list]) => (
              <div key={cat} className="category-card">
                <div className="category-header" onClick={()=>toggle(cat)}>
                  <div>
                    <strong>{cat}</strong>
                    <div className="muted" style={{fontSize:12}}>{list.length} items</div>
                  </div>
                  <div className={`chev ${openCats[cat] ? 'open' : ''}`}></div>
                </div>

                {openCats[cat] && (
                  <ul className="category-list">
                    {list.map((name,i) => (
                      <li key={name+i} className="category-item">{name}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <aside style={{width:360}}>
        <div className="card instrument-carousel">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
            <h3 style={{margin:0}}>Featured Instrument</h3>
            <div style={{fontSize:'12px', color:'var(--muted)'}}>Rotating in {allInstruments.length} items</div>
          </div>

          {/* Carousel Image */}
          <div className="carousel-image" style={{
            width:'100%',
            height:'180px',
            borderRadius:'10px',
            background:`linear-gradient(135deg, rgba(79,209,197,0.2), rgba(43,212,184,0.1))`,
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            marginBottom:16,
            border:'1px solid rgba(79,209,197,0.2)',
            overflow:'hidden'
          }}>
            <img src={localImg} onError={(e)=>{e.currentTarget.onerror=null; e.currentTarget.src=fallbackImg}} alt={currentInstrument} style={{width:'100%', height:'100%', objectFit:'cover'}} />
          </div>

          {/* Instrument Details */}
          <div style={{backgroundColor:'rgba(26,47,66,0.5)', padding:'14px', borderRadius:'8px', marginBottom:12}}>
            <div style={{fontSize:'12px', color:'var(--accent)', fontWeight:'600', marginBottom:'4px', textTransform:'uppercase'}}>
              {instrumentInfo.category}
            </div>
            <h4 style={{margin:'6px 0', color:'var(--text)', fontSize:'16px', fontWeight:'700', wordBreak:'break-word'}}>
              {currentInstrument.replace(/_/g, ' ')}
            </h4>
            <p style={{margin:'8px 0', color:'var(--muted)', fontSize:'13px', lineHeight:'1.5'}}>
              {instrumentInfo.desc}
            </p>
          </div>

          {/* Navigation Dots */}
          <div style={{display:'flex', gap:'6px', justifyContent:'center', padding:'12px 0', borderTop:'1px solid rgba(79,209,197,0.1)'}}>
            {allInstruments.map((_, i) => (
              <button key={i} onClick={() => setCurrentInstrumentIdx(i)} style={{
                width: i === currentInstrumentIdx ? '24px' : '8px',
                height:'8px',
                borderRadius:'4px',
                background: i === currentInstrumentIdx ? 'var(--accent)' : 'rgba(79,209,197,0.3)',
                border:'none',
                cursor:'pointer',
                transition:'all .2s ease'
              }} aria-label={`Go to instrument ${i + 1}`} />
            ))}
          </div>

          {/* Stats */}
          <div style={{marginTop:12, paddingTop:12, borderTop:'1px solid rgba(79,209,197,0.1)'}}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'8px'}}>
              <span style={{color:'var(--muted)', fontSize:'13px'}}>Total Instruments:</span>
              <span style={{color:'var(--text)', fontWeight:'700'}}>{state.instruments.length}</span>
            </div>
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <span style={{color:'var(--muted)', fontSize:'13px'}}>Test Results:</span>
              <span style={{color:'var(--text)', fontWeight:'700'}}>{state.testResults.length}</span>
            </div>
          </div>
        </div>
      </aside>
        </section>
      </div>
    </div>
  )
}
