import React, { useState } from 'react'
import { useStore } from '../store/contextStore'

export default function LandingPage({onOpenDashboard}){
  const { state } = useStore()
  const [showTesting, setShowTesting] = useState(false)
  const [testingStatus, setTestingStatus] = useState({})

  // Initialize testing status for instruments
  const allInstruments = state.instruments || []
  
  const handleStatusChange = (instrument, status) => {
    setTestingStatus(prev => ({
      ...prev,
      [instrument]: status
    }))
  }

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
              ← Back to Landing
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
              Select testing status for each instrument
            </p>
          </div>
        </section>

        {/* Instruments List */}
        <section style={{ padding: '40px 28px' }}>
          <div className="container" style={{ maxWidth: '1200px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px'
            }}>
              {allInstruments.length > 0 ? (
                allInstruments.map((instrument, idx) => {
                  const instrumentId = `MCS-M${(12052026 + idx).toString()}${Math.floor(Math.random() * 1000)}`
                  const currentStatus = testingStatus[instrument] || 'pending'
                  
                  return (
                    <div key={idx} style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.4), rgba(248,250,252,0.3))',
                      backdropFilter: 'blur(12px)',
                      border: '1.5px solid rgba(14,165,233,0.15)',
                      borderRadius: '16px',
                      padding: '24px',
                      transition: 'all .3s ease',
                      boxShadow: '0 4px 12px rgba(14,165,233,0.08)'
                    }}>
                      {/* Instrument Info */}
                      <div style={{ marginBottom: '20px' }}>
                        <div style={{
                          fontSize: '12px',
                          color: 'var(--accent)',
                          fontWeight: '700',
                          marginBottom: '8px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Instrument ID
                        </div>
                        <h3 style={{
                          margin: '0 0 8px',
                          color: 'var(--text)',
                          fontSize: '1.1rem',
                          fontWeight: '700',
                          wordBreak: 'break-word'
                        }}>
                          {instrumentId}
                        </h3>
                        <p style={{
                          margin: '0',
                          color: 'var(--text)',
                          fontSize: '13px',
                          fontWeight: '600'
                        }}>
                          {instrument.replace(/_/g, ' ')}
                        </p>
                      </div>

                      {/* Status Selection */}
                      <div style={{
                        borderTop: '1px solid rgba(14,165,233,0.1)',
                        paddingTop: '16px'
                      }}>
                        <div style={{
                          fontSize: '12px',
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
                            borderRadius: '10px',
                            border: '1.5px solid',
                            borderColor: currentStatus === 'pending' ? 'var(--accent)' : 'rgba(14,165,233,0.15)',
                            background: currentStatus === 'pending' ? 'linear-gradient(135deg, rgba(14,165,233,0.2), rgba(2,132,199,0.1))' : 'transparent',
                            color: currentStatus === 'pending' ? 'var(--accent)' : 'var(--muted)',
                            fontWeight: '700',
                            fontSize: '13px',
                            cursor: 'pointer',
                            transition: 'all .2s ease'
                          }}>
                            ⏳ Pending
                          </button>

                          {/* Done Button */}
                          <button onClick={() => handleStatusChange(instrument, 'done')} style={{
                            padding: '12px 16px',
                            borderRadius: '10px',
                            border: '1.5px solid',
                            borderColor: currentStatus === 'done' ? '#10b981' : 'rgba(14,165,233,0.15)',
                            background: currentStatus === 'done' ? 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.1))' : 'transparent',
                            color: currentStatus === 'done' ? '#10b981' : 'var(--muted)',
                            fontWeight: '700',
                            fontSize: '13px',
                            cursor: 'pointer',
                            transition: 'all .2s ease'
                          }}>
                            ✓ Done
                          </button>
                        </div>
                      </div>

                      {/* Status Indicator */}
                      <div style={{
                        marginTop: '16px',
                        padding: '12px',
                        borderRadius: '8px',
                        background: currentStatus === 'done' 
                          ? 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.05))'
                          : 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.05))',
                        textAlign: 'center',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: currentStatus === 'done' ? '#10b981' : '#f59e0b'
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
                  ← Back
                </button>
                <button onClick={onOpenDashboard} className="cta" style={{
                  fontSize: '14px',
                  fontWeight: '700'
                }}>
                  📊 View Results in Dashboard
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', minHeight: '90vh', paddingBottom: '40px' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(14,165,233,0.08), rgba(2,132,199,0.04))',
        padding: '80px 28px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Graphics */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-100px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14,165,233,0.15), transparent)',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '-100px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(2,132,199,0.1), transparent)',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ maxWidth: '1200px', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h1 style={{
            fontSize: '4rem',
            fontWeight: '900',
            margin: '0 0 20px',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2), var(--accent-3))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: '1.1'
          }}>
            Precision Instruments, <br />Performance Excellence
          </h1>
          <p style={{
            fontSize: '1.4rem',
            color: 'var(--muted)',
            maxWidth: '700px',
            margin: '0 auto 40px',
            lineHeight: '1.8'
          }}>
            Professional surgical instrument management system designed for healthcare facilities that demand precision, reliability, and real-time insights.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="cta" onClick={onOpenDashboard} style={{ fontSize: '16px', fontWeight: '700', padding: '14px 32px' }}>
              🚀 Get Started
            </button>
            <button className="btn" onClick={() => setShowTesting(true)} style={{ fontSize: '16px', fontWeight: '700', padding: '14px 32px' }}>
              🧪 Start Testing
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 28px', background: 'linear-gradient(180deg, rgba(14,165,233,0.02), transparent)' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          <h2 style={{
            fontSize: '2.8rem',
            fontWeight: '800',
            textAlign: 'center',
            marginBottom: '60px',
            color: 'var(--text)'
          }}>
            Why Choose Mudra?
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px'
          }}>
            {/* Feature 1 */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.4), rgba(248,250,252,0.3))',
              backdropFilter: 'blur(12px)',
              border: '1.5px solid rgba(14,165,233,0.15)',
              borderRadius: '16px',
              padding: '40px 32px',
              textAlign: 'center',
              transition: 'all .3s ease'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔬</div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '12px', color: 'var(--text)' }}>
                Advanced Analytics
              </h3>
              <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>
                Real-time monitoring and detailed analytics for complete instrument lifecycle management and performance tracking.
              </p>
            </div>

            {/* Feature 2 */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.4), rgba(248,250,252,0.3))',
              backdropFilter: 'blur(12px)',
              border: '1.5px solid rgba(14,165,233,0.15)',
              borderRadius: '16px',
              padding: '40px 32px',
              textAlign: 'center',
              transition: 'all .3s ease'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚙️</div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '12px', color: 'var(--text)' }}>
                Precision Engineering
              </h3>
              <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>
                Calibrated systems designed to meet the highest medical standards with consistent accuracy and reliability.
              </p>
            </div>

            {/* Feature 3 */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.4), rgba(248,250,252,0.3))',
              backdropFilter: 'blur(12px)',
              border: '1.5px solid rgba(14,165,233,0.15)',
              borderRadius: '16px',
              padding: '40px 32px',
              textAlign: 'center',
              transition: 'all .3s ease'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔐</div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '12px', color: 'var(--text)' }}>
                Enterprise Security
              </h3>
              <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>
                Bank-level security protocols ensuring your medical instrument data remains completely protected and compliant.
              </p>
            </div>

            {/* Feature 4 */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.4), rgba(248,250,252,0.3))',
              backdropFilter: 'blur(12px)',
              border: '1.5px solid rgba(14,165,233,0.15)',
              borderRadius: '16px',
              padding: '40px 32px',
              textAlign: 'center',
              transition: 'all .3s ease'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '12px', color: 'var(--text)' }}>
                Intelligent Reporting
              </h3>
              <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>
                Comprehensive dashboards and custom reports for data-driven decision making and compliance documentation.
              </p>
            </div>

            {/* Feature 5 */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.4), rgba(248,250,252,0.3))',
              backdropFilter: 'blur(12px)',
              border: '1.5px solid rgba(14,165,233,0.15)',
              borderRadius: '16px',
              padding: '40px 32px',
              textAlign: 'center',
              transition: 'all .3s ease'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌐</div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '12px', color: 'var(--text)' }}>
                Global Connectivity
              </h3>
              <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>
                Cloud-based system accessible from anywhere with instant synchronization across all your facilities.
              </p>
            </div>

            {/* Feature 6 */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.4), rgba(248,250,252,0.3))',
              backdropFilter: 'blur(12px)',
              border: '1.5px solid rgba(14,165,233,0.15)',
              borderRadius: '16px',
              padding: '40px 32px',
              textAlign: 'center',
              transition: 'all .3s ease'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '12px', color: 'var(--text)' }}>
                Dedicated Support
              </h3>
              <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>
                24/7 professional support team ready to assist with implementation, training, and ongoing optimization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section style={{ padding: '80px 28px', background: 'linear-gradient(135deg, rgba(14,165,233,0.03), transparent)' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          <h2 style={{
            fontSize: '2.8rem',
            fontWeight: '800',
            textAlign: 'center',
            marginBottom: '60px',
            color: 'var(--text)'
          }}>
            Simple, Transparent Pricing
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px'
          }}>
            {/* Plan 1 */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.4), rgba(248,250,252,0.3))',
              backdropFilter: 'blur(12px)',
              border: '1.5px solid rgba(14,165,233,0.15)',
              borderRadius: '16px',
              padding: '40px 32px',
              transition: 'all .3s ease'
            }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '12px', color: 'var(--text)' }}>
                Professional
              </h3>
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '2.4rem', fontWeight: '800', color: 'var(--accent)' }}>$299</span>
                <span style={{ color: 'var(--muted)' }}>/month</span>
              </div>
              <ul style={{ listStyle: 'none', margin: '0 0 32px', padding: 0, color: 'var(--muted)' }}>
                <li style={{ marginBottom: '12px', fontSize: '14px' }}>✓ Up to 100 instruments</li>
                <li style={{ marginBottom: '12px', fontSize: '14px' }}>✓ Basic analytics</li>
                <li style={{ marginBottom: '12px', fontSize: '14px' }}>✓ Email support</li>
                <li style={{ marginBottom: '12px', fontSize: '14px' }}>✓ Monthly reports</li>
              </ul>
              <button className="cta" onClick={onOpenDashboard} style={{ width: '100%', fontSize: '14px' }}>
                Get Started
              </button>
            </div>

            {/* Plan 2 - Featured */}
            <div style={{
              background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
              filter: 'drop-shadow(0 20px 40px rgba(14,165,233,0.3))',
              borderRadius: '16px',
              padding: '40px 32px',
              transition: 'all .3s ease',
              position: 'relative',
              transform: 'scale(1.05)'
            }}>
              <div style={{
                position: 'absolute',
                top: '-12px',
                right: '20px',
                background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                color: 'white',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '700',
                letterSpacing: '0.5px'
              }}>
                POPULAR
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '12px', color: 'white' }}>
                Enterprise
              </h3>
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '2.4rem', fontWeight: '800', color: 'white' }}>$999</span>
                <span style={{ color: 'rgba(255,255,255,0.9)' }}>/month</span>
              </div>
              <ul style={{ listStyle: 'none', margin: '0 0 32px', padding: 0, color: 'rgba(255,255,255,0.9)' }}>
                <li style={{ marginBottom: '12px', fontSize: '14px' }}>✓ Unlimited instruments</li>
                <li style={{ marginBottom: '12px', fontSize: '14px' }}>✓ Advanced analytics</li>
                <li style={{ marginBottom: '12px', fontSize: '14px' }}>✓ Priority 24/7 support</li>
                <li style={{ marginBottom: '12px', fontSize: '14px' }}>✓ Custom integrations</li>
              </ul>
              <button className="cta" onClick={onOpenDashboard} style={{ width: '100%', fontSize: '14px', background: 'rgba(255,255,255,0.2)', color: 'white' }}>
                Get Started
              </button>
            </div>

            {/* Plan 3 */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.4), rgba(248,250,252,0.3))',
              backdropFilter: 'blur(12px)',
              border: '1.5px solid rgba(14,165,233,0.15)',
              borderRadius: '16px',
              padding: '40px 32px',
              transition: 'all .3s ease'
            }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '12px', color: 'var(--text)' }}>
                Custom
              </h3>
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '2.4rem', fontWeight: '800', color: 'var(--accent)' }}>Custom</span>
                <span style={{ color: 'var(--muted)' }}> Pricing</span>
              </div>
              <ul style={{ listStyle: 'none', margin: '0 0 32px', padding: 0, color: 'var(--muted)' }}>
                <li style={{ marginBottom: '12px', fontSize: '14px' }}>✓ Bespoke solutions</li>
                <li style={{ marginBottom: '12px', fontSize: '14px' }}>✓ Dedicated manager</li>
                <li style={{ marginBottom: '12px', fontSize: '14px' }}>✓ On-site support</li>
                <li style={{ marginBottom: '12px', fontSize: '14px' }}>✓ SLA guarantee</li>
              </ul>
              <button className="cta" onClick={() => alert('Contact sales team')} style={{ width: '100%', fontSize: '14px' }}>
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '60px 28px', background: 'linear-gradient(135deg, rgba(14,165,233,0.1), rgba(2,132,199,0.05))' }}>
        <div className="container" style={{ maxWidth: '1200px', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '2.4rem',
            fontWeight: '800',
            marginBottom: '16px',
            color: 'var(--text)'
          }}>
            Ready to Transform Your Operations?
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: 'var(--muted)',
            marginBottom: '32px',
            maxWidth: '600px',
            margin: '0 auto 32px',
            lineHeight: '1.7'
          }}>
            Join leading healthcare facilities in achieving unprecedented instrument management efficiency.
          </p>
          <button className="cta" onClick={onOpenDashboard} style={{ fontSize: '16px', fontWeight: '700', padding: '14px 48px' }}>
            Start Free Trial Today
          </button>
        </div>
      </section>
    </div>
  )
}
