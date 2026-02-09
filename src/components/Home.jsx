import React from 'react'
import { useStore } from '../store/contextStore'

export default function Home({onOpenDashboard}){
  const {state} = useStore()

  return (
    <section className="hero">
      <div>
        <h2>Welcome to Instrument Dashboard</h2>
        <p className="muted">Monitor surgical instrument function tests, telemetry, and alerts.</p>
        <button className="cta" onClick={onOpenDashboard}>Open Dashboard</button>
      </div>

      <div style={{minWidth:220,maxWidth:360}}>
        <div className="card">
          <h3>Quick Summary</h3>
          <p className="muted">Instruments tracked: <strong>{state.instruments.length}</strong></p>
          <p className="muted">Test results: <strong>{state.testResults.length}</strong></p>
        </div>
      </div>
    </section>
  )
}
