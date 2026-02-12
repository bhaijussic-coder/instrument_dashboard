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
      <div style={{ width: '100%', minHeight: '90vh', paddingBottom: '40px' }}>
        {/* Header */}
        <section style={{
          background: 'linear-gradient(135deg, rgba(14,165,233,0.08), rgba(2,132,199,0.04))',
          padding: '40px 28px',
          borderBottom: '1.5px solid rgba(14,165,233,0.1)'
        }}>
          <div className="container" style={{ maxWidth: '1200px' }}>
            <button onClick={() => setShowTesting(false)} style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent)',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '16px'
            }}>
              ← Back to Home
            </button>
            <h1 style={{
              fontSize: '2.8rem',
              fontWeight: '900',
              margin: '0 0 12px',
              background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Start Testing Instruments
            </h1>
            <p style={{ color: 'var(--muted)', margin: '0', fontSize: '1.1rem' }}>
              Mark each instrument as pending or done after testing
            </p>
          </div>
        </section>

        {/* Instruments List */}
        <section style={{ padding: '40px 28px' }}>
          <div className="container" style={{ maxWidth: '1200px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '28px',
              perspective: '1200px'
            }}>
              {allInstruments.length > 0 ? (
                allInstruments.map((instrument, idx) => {
                  const instrumentId = `MCS-${(12052025 + idx).toString()} ${Math.floor(Math.random() * 10000)}`
                  const currentStatus = testingStatus[instrument] || 'pending'
                  
                  // Different colors for each card
                  const colors = [
                    { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.2)', light: 'rgba(59, 130, 246, 0.15)', shadow: 'rgba(59, 130, 246, 0.15)' },
                    { bg: 'rgba(139, 92, 246, 0.1)', border: 'rgba(139, 92, 246, 0.2)', light: 'rgba(139, 92, 246, 0.15)', shadow: 'rgba(139, 92, 246, 0.15)' },
                    { bg: 'rgba(236, 72, 153, 0.1)', border: 'rgba(236, 72, 153, 0.2)', light: 'rgba(236, 72, 153, 0.15)', shadow: 'rgba(236, 72, 153, 0.15)' },
                    { bg: 'rgba(14, 165, 233, 0.1)', border: 'rgba(14, 165, 233, 0.2)', light: 'rgba(14, 165, 233, 0.15)', shadow: 'rgba(14, 165, 233, 0.15)' },
                  ]
                  const cardColor = colors[idx % colors.length]
                  
                  return (
                    <div key={idx} style={{
                      background: `linear-gradient(135deg, ${cardColor.bg}, transparent), linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0.2))`,
                      backdropFilter: 'blur(16px)',
                      border: `2px solid ${cardColor.border}`,
                      borderRadius: '20px',
                      padding: '28px',
                      transition: 'all .4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      boxShadow: `0 20px 50px ${cardColor.shadow}, 0 0 60px ${cardColor.shadow}, inset 0 1px 0 rgba(255,255,255,0.6)`,
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer'
                    }}>
                      {/* Card Shine Effect */}
                      <div style={{
                        position: 'absolute',
                        top: '0',
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        animation: 'shimmer 3s infinite'
                      }} />

                      {/* Instrument Info */}
                      <div style={{ marginBottom: '20px', position: 'relative', zIndex: 1 }}>
                        <div style={{
                          fontSize: '11px',
                          color: 'var(--accent)',
                          fontWeight: '700',
                          marginBottom: '8px',
                          textTransform: 'uppercase',
                          letterSpacing: '1px'
                        }}>
                          🛒 Instrument ID
                        </div>
                        <h3 style={{
                          margin: '0 0 8px',
                          color: 'var(--text)',
                          fontSize: '1.15rem',
                          fontWeight: '800',
                          wordBreak: 'break-word',
                          fontFamily: 'monospace',
                          letterSpacing: '0.5px'
                        }}>
                          {instrumentId}
                        </h3>
                        <p style={{
                          margin: '0',
                          color: 'var(--text-light)',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}>
                          {instrument.replace(/_/g, ' ')}
                        </p>
                      </div>

                      {/* Status Selection */}
                      <div style={{
                        borderTop: `1px solid ${cardColor.border}`,
                        paddingTop: '16px',
                        position: 'relative',
                        zIndex: 1
                      }}>
                        <div style={{
                          fontSize: '11px',
                          color: 'var(--muted)',
                          fontWeight: '700',
                          marginBottom: '12px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Test Status
                        </div>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '12px'
                        }}>
                          {/* Pending Button */}
                          <button onClick={() => handleStatusChange(instrument, 'pending')} style={{
                            padding: '12px 16px',
                            borderRadius: '12px',
                            border: '2px solid',
                            borderColor: currentStatus === 'pending' ? 'var(--accent)' : cardColor.border,
                            background: currentStatus === 'pending' ? `linear-gradient(135deg, rgba(14,165,233,0.3), rgba(2,132,199,0.15))` : `linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))`,
                            color: currentStatus === 'pending' ? 'var(--accent)' : 'var(--muted)',
                            fontWeight: '700',
                            fontSize: '13px',
                            cursor: 'pointer',
                            transition: 'all .2s ease',
                            boxShadow: currentStatus === 'pending' ? '0 8px 16px rgba(14,165,233,0.2), inset 0 1px 0 rgba(255,255,255,0.3)' : 'inset 0 1px 0 rgba(255,255,255,0.2)'
                          }}>
                            ⏳ Pending
                          </button>

                          {/* Done Button */}
                          <button onClick={() => handleStatusChange(instrument, 'done')} style={{
                            padding: '12px 16px',
                            borderRadius: '12px',
                            border: '2px solid',
                            borderColor: currentStatus === 'done' ? '#10b981' : cardColor.border,
                            background: currentStatus === 'done' ? `linear-gradient(135deg, rgba(16,185,129,0.3), rgba(16,185,129,0.15))` : `linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))`,
                            color: currentStatus === 'done' ? '#10b981' : 'var(--muted)',
                            fontWeight: '700',
                            fontSize: '13px',
                            cursor: 'pointer',
                            transition: 'all .2s ease',
                            boxShadow: currentStatus === 'done' ? '0 8px 16px rgba(16,185,129,0.2), inset 0 1px 0 rgba(255,255,255,0.3)' : 'inset 0 1px 0 rgba(255,255,255,0.2)'
                          }}>
                            ✓ Done
                          </button>
                        </div>
                      </div>

                      {/* Status Indicator */}
                      <div style={{
                        marginTop: '16px',
                        padding: '12px',
                        borderRadius: '12px',
                        background: currentStatus === 'done' 
                          ? 'linear-gradient(135deg, rgba(16,185,129,0.25), rgba(16,185,129,0.1))'
                          : 'linear-gradient(135deg, rgba(245,158,11,0.25), rgba(245,158,11,0.1))',
                        border: `1.5px solid ${currentStatus === 'done' ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
                        textAlign: 'center',
                        fontSize: '13px',
                        fontWeight: '700',
                        color: currentStatus === 'done' ? '#10b981' : '#f59e0b',
                        boxShadow: `inset 0 2px 4px ${currentStatus === 'done' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)'}`,
                        position: 'relative',
                        zIndex: 1
                      }}>
                        {currentStatus === 'done' ? '✓ Completed' : '⏳ Pending Review'}
                      </div>
                    </div>
                  )
                })
              ) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
                  <p style={{ fontSize: '1.1rem', margin: '0' }}>📭 No instruments available</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {allInstruments.length > 0 && (
              <div style={{
                marginTop: '40px',
                display: 'flex',
                gap: '16px',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
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
    <div style={{ width: '100%', minHeight: '90vh', paddingBottom: '40px' }}>
      {/* Hero Banner with Featured */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(14,165,233,0.08), rgba(2,132,199,0.04))',
        padding: '60px 28px',
        marginBottom: '0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Graphics */}
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14,165,233,0.1), transparent)',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(2,132,199,0.08), transparent)',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ maxWidth: '1200px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
            
            {/* Left side - Content */}
            <div>
              <h1 style={{ 
                margin: '0 0 16px', 
                fontSize: '3.2rem', 
                fontWeight: '900',
                background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent', 
                backgroundClip: 'text',
                lineHeight: '1.1'
              }}>
                Mudra Instruments
              </h1>
              <p style={{ 
                margin: '0 0 32px', 
                fontSize: '1.2rem', 
                color: 'var(--muted)', 
                maxWidth: '500px',
                lineHeight: '1.7'
              }}>
                Precision surgical instruments engineered for excellence. Monitor, test, and manage your complete instrument inventory with advanced analytics.
              </p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <button className="cta" onClick={onOpenDashboard} style={{ fontSize: '15px', fontWeight: '700' }}>
                  📊 View Dashboard
                </button>
                <button className="btn" onClick={() => setShowTesting(true)} style={{ fontSize: '15px', fontWeight: '700' }}>
                  🧪 Start Testing
                </button>
              </div>
            </div>

            {/* Right side - Featured Image */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.4), rgba(248,250,252,0.3))',
              backdropFilter: 'blur(12px)',
              border: '1.5px solid rgba(14,165,233,0.15)',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 20px 60px rgba(14,165,233,0.12)',
              transition: 'all .3s ease'
            }}>
              <div style={{
                width: '100%',
                height: '320px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(14,165,233,0.08), rgba(2,132,199,0.04))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                marginBottom: '16px',
                border: '1.5px solid rgba(14,165,233,0.1)'
              }}>
                <img 
                  src={localImg} 
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = fallbackImg }} 
                  alt={currentInstrument}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    animation: 'fadeInScale .6s ease-out'
                  }} 
                />
              </div>

              {/* Featured Info */}
              <div style={{
                background: 'rgba(14,165,233,0.05)',
                padding: '16px',
                borderRadius: '10px',
                marginBottom: '12px'
              }}>
                <div style={{ 
                  fontSize: '11px', 
                  color: 'var(--accent)', 
                  fontWeight: '700', 
                  marginBottom: '8px', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.5px' 
                }}>
                  ⭐ Featured Instrument
                </div>
                <h3 style={{ 
                  margin: '4px 0 8px', 
                  color: 'var(--text)', 
                  fontSize: '1.2rem', 
                  fontWeight: '700',
                  wordBreak: 'break-word'
                }}>
                  {currentInstrument ? currentInstrument.replace(/_/g, ' ') : 'Loading...'}
                </h3>
                <p style={{ 
                  margin: '0', 
                  color: 'var(--muted)', 
                  fontSize: '13px', 
                  lineHeight: '1.6' 
                }}>
                  {instrumentInfo.desc}
                </p>
              </div>

              {/* Navigation Dots */}
              <div style={{ 
                display: 'flex', 
                gap: '6px', 
                justifyContent: 'center', 
                padding: '12px 0',
                flexWrap: 'wrap'
              }}>
                {allInstruments.slice(0, 12).map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setCurrentInstrumentIdx(i)} 
                    style={{
                      width: i === currentInstrumentIdx ? '20px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      background: i === currentInstrumentIdx ? 'var(--accent)' : 'rgba(14,165,233,0.2)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all .2s ease'
                    }} 
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

