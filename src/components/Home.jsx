import React, { useState, useEffect } from 'react'
import { useStore } from '../store/contextStore'

export default function Home({onOpenDashboard}){
  const {state} = useStore()
  const [showTesting, setShowTesting] = useState(false)
  const [testingStatus, setTestingStatus] = useState({})
  const [currentInstrumentIdx, setCurrentInstrumentIdx] = useState(0)
  const allInstruments = state.instruments || []
  const metadata = state.instrumentMetadata || {}

  // Auto-rotate instruments every 50 seconds
  useEffect(() => {
    if (allInstruments.length === 0) return
    const timer = setInterval(() => {
      setCurrentInstrumentIdx(prev => (prev + 1) % allInstruments.length)
    }, 50000)
    return () => clearInterval(timer)
  }, [allInstruments.length])

  const handleStatusChange = (instrument, status) => {
    setTestingStatus(prev => ({
      ...prev,
      [instrument]: status
    }))
  }

  const currentInstrument = allInstruments[currentInstrumentIdx]
  const instrumentInfo = metadata[currentInstrument] || { desc: 'Surgical instrument for precision procedures', category: 'Instruments' }
  const slug = currentInstrument ? currentInstrument.replace(/[^a-z0-9]+/gi, '_').toLowerCase() : 'instrument'
  const localImg = `/images/${slug}.jpg`
  const fallbackImg = `https://picsum.photos/seed/${encodeURIComponent(currentInstrument)}/600/400`

  // Testing Interface
  if (showTesting) {
    return (
      <div className="testing-container">
        {/* Header */}
        <section className="testing-header">
          <div className="container" style={{ maxWidth: '1200px' }}>
            <button onClick={() => setShowTesting(false)} className="testing-back-btn">
              ← Back to Home
            </button>
            <h1 className="testing-header h1">
              Start Testing Instruments
            </h1>
            <p className="testing-header p">
              Mark each instrument as pending or done after testing
            </p>
          </div>
        </section>

        {/* Instruments List */}
        <section className="testing-section">
          <div className="container" style={{ maxWidth: '1200px' }}>
            <div className="instruments-grid">
              {allInstruments.length > 0 ? (
                allInstruments.map((instrument, idx) => {
                  const instrumentId = `MCS-${(12052025 + idx).toString()} ${Math.floor(Math.random() * 10000)}`
                  const currentStatus = testingStatus[instrument] || 'pending'
                  const colorClasses = ['blue', 'purple', 'pink', 'sky']
                  const cardColorClass = colorClasses[idx % colorClasses.length]
                  
                  return (
                    <div key={idx} className={`instrument-card ${cardColorClass}`}>
                      {/* Card Shine Effect */}
                      <div className="card-shine" />

                      {/* Instrument Info */}
                      <div className="card-info card-content">
                        <div className="card-label">
                          🛒 Instrument ID
                        </div>
                        <h3 className="card-title">
                          {instrumentId}
                        </h3>
                        <p className="card-desc">
                          {instrument.replace(/_/g, ' ')}
                        </p>
                      </div>

                      {/* Status Selection */}
                      <div className="card-divider">
                        <div className="test-status-label">
                          Test Status
                        </div>
                        <div className="button-group">
                          {/* Pending Button */}
                          <button onClick={() => handleStatusChange(instrument, 'pending')} className={`status-btn ${currentStatus === 'pending' ? 'pending' : ''}`}>
                            ⏳ Pending
                          </button>

                          {/* Done Button */}
                          <button onClick={() => handleStatusChange(instrument, 'done')} className={`status-btn ${currentStatus === 'done' ? 'done' : ''}`}>
                            ✓ Done
                          </button>
                        </div>
                      </div>

                      {/* Status Indicator */}
                      <div className={`status-indicator ${currentStatus}`}>
                        {currentStatus === 'done' ? '✓ Completed' : '⏳ Pending Review'}
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="empty-state">
                  <p>📭 No instruments available</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {allInstruments.length > 0 && (
              <div className="action-buttons">
                <button onClick={() => setShowTesting(false)} className="btn" style={{
                  fontSize: '14px',
                  fontWeight: '700'
                }}>
                  ← Back to Home
                </button>
                <button onClick={onOpenDashboard} className="cta" style={{
                  fontSize: '14px',
                  fontWeight: '700'
                }}>
                  📊 View Dashboard
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    )
  }

  // Main Home Page
  return (
    <div className="testing-container">
      {/* Hero Banner with Featured */}
      <section className="hero-section">
        {/* Decorative Graphics */}
        <div className="hero-decoration top-right" />
        <div className="hero-decoration bottom-left" />

        <div className="container" style={{ maxWidth: '1200px' }}>
          <div className="hero-content">
            
            {/* Left side - Content */}
            <div>
              <h1 className="hero-text h1">
                Mudra Instruments
              </h1>
              <p className="hero-text p">
                Precision surgical instruments engineered for excellence. Monitor, test, and manage your complete instrument inventory with advanced analytics.
              </p>
              <div className="hero-actions">
                <button className="cta" onClick={onOpenDashboard} style={{ fontSize: '15px', fontWeight: '700' }}>
                  📊 View Dashboard
                </button>
                <button className="btn" onClick={() => setShowTesting(true)} style={{ fontSize: '15px', fontWeight: '700' }}>
                  🧪 Start Testing
                </button>
              </div>
            </div>

            {/* Right side - Featured Image */}
            <div className="hero-featured">
              <div className="featured-image-wrapper">
                <img 
                  src={localImg} 
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = fallbackImg }} 
                  alt={currentInstrument}
                  className="featured-image"
                />
              </div>

              {/* Featured Info */}
              <div className="featured-info">
                <div className="featured-label">
                  ⭐ Featured Instrument
                </div>
                <h3 className="featured-title">
                  {currentInstrument ? currentInstrument.replace(/_/g, ' ') : 'Loading...'}
                </h3>
                <p className="featured-desc">
                  {instrumentInfo.desc}
                </p>
              </div>

              {/* Navigation Dots */}
              <div className="nav-dots">
                {allInstruments.slice(0, 12).map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setCurrentInstrumentIdx(i)} 
                    className={`dot ${i === currentInstrumentIdx ? 'active' : ''}`}
                    aria-label={`Go to instrument ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Graphics */}
      <section style={{
        background: 'linear-gradient(180deg, rgba(14,165,233,0.02), transparent)',
        padding: '40px 28px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Elements */}
        <div style={{
          position: 'absolute',
          top: '0',
          left: '10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'conic-gradient(from 0deg, rgba(14,165,233,0.1), rgba(2,132,199,0.05))',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }} />
        
        <div className="container" style={{ maxWidth: '1200px', position: 'relative', zIndex: 1, textAlign: 'center', padding: '40px 28px' }}>
          <p style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: '600' }}>
            View detailed analytics and metrics on the Dashboard
          </p>
        </div>
      </section>
    </div>
  )
}

