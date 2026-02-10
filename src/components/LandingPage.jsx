import React from 'react'

export default function LandingPage({onOpenDashboard}){
  return (
    <section className="card hero">
      <h2>Welcome to Instruments Testing</h2>
      <p className="muted">Monitor surgical instrument function tests, telemetry, and alerts. View results, spot trends, and keep devices safe.</p>

      <div style={{display:'flex', gap:12, marginTop:16}}>
        <img src="https://picsum.photos/seed/instrument1/600/400" alt="instrument 1" style={{flex:1, borderRadius:8, width:'33%'}}/>
        <img src="https://picsum.photos/seed/instrument2/600/400" alt="instrument 2" style={{flex:1, borderRadius:8, width:'33%'}}/>
        <img src="https://picsum.photos/seed/instrument3/600/400" alt="instrument 3" style={{flex:1, borderRadius:8, width:'33%'}}/>
      </div>

      <div style={{marginTop:18}}>
        <button className="cta" onClick={onOpenDashboard}>Open Dashboard</button>
      </div>
    </section>
  )
}
