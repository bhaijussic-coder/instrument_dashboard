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
      <div className="testing-container">
        {/* Header */}
        <section className="testing-header">
          <div className="container" style={{ maxWidth: '1200px' }}>
            <button onClick={() => setShowTesting(false)} className="testing-back-btn">
              ← Back to Landing
            </button>
            <h1 className="testing-header h1">
              Start Testing Instruments
            </h1>
            <p className="testing-header p">
              Select testing status for each instrument
            </p>
          </div>
        </section>

        {/* Instruments List */}
        <section className="testing-section">
          <div className="container" style={{ maxWidth: '1200px' }}>
            <div className="instruments-grid simple">
              {allInstruments.length > 0 ? (
                allInstruments.map((instrument, idx) => {
                  const instrumentId = `MCS-M${(12052026 + idx).toString()}${Math.floor(Math.random() * 1000)}`
                  const currentStatus = testingStatus[instrument] || 'pending'
                  
                  return (
                    <div key={idx} className="instrument-card">
                      {/* Instrument Info */}
                      <div className="card-info">
                        <div className="card-label simple">
                          Instrument ID
                        </div>
                        <h3 className="card-title landing">
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
    <div className="testing-container">
      {/* Hero Section */}
      <section className="landing-hero">
        {/* Decorative Graphics */}
        <div className="hero-decoration" style={{
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
        <div className="hero-decoration" style={{
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
          <h1 className="landing-title">
            Precision Instruments, <br />Performance Excellence
          </h1>
          <p className="landing-subtitle">
            Professional surgical instrument management system designed for healthcare facilities that demand precision, reliability, and real-time insights.
          </p>
          <div className="hero-actions" style={{ justifyContent: 'center' }}>
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

          <div className="features-grid">
            {/* Feature 1 */}
            <div className="feature-card">
              <div className="feature-emoji">🔬</div>
              <h3 className="feature-title">
                Advanced Analytics
              </h3>
              <p className="feature-text">
                Real-time monitoring and detailed analytics for complete instrument lifecycle management and performance tracking.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card">
              <div className="feature-emoji">⚙️</div>
              <h3 className="feature-title">
                Precision Engineering
              </h3>
              <p className="feature-text">
                Calibrated systems designed to meet the highest medical standards with consistent accuracy and reliability.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card">
              <div className="feature-emoji">🔐</div>
              <h3 className="feature-title">
                Enterprise Security
              </h3>
              <p className="feature-text">
                Bank-level security protocols ensuring your medical instrument data remains completely protected and compliant.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="feature-card">
              <div className="feature-emoji">📊</div>
              <h3 className="feature-title">
                Intelligent Reporting
              </h3>
              <p className="feature-text">
                Comprehensive dashboards and custom reports for data-driven decision making and compliance documentation.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="feature-card">
              <div className="feature-emoji">🌐</div>
              <h3 className="feature-title">
                Global Connectivity
              </h3>
              <p className="feature-text">
                Cloud-based system accessible from anywhere with instant synchronization across all your facilities.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="feature-card">
              <div className="feature-emoji">👥</div>
              <h3 className="feature-title">
                Dedicated Support
              </h3>
              <p className="feature-text">
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

          <div className="pricing-grid">
            {/* Plan 1 */}
            <div className="pricing-card">
              <h3 className="pricing-title">
                Professional
              </h3>
              <div className="pricing-price">
                <span className="pricing-amount">$299</span>
                <span className="pricing-period">/month</span>
              </div>
              <ul className="pricing-features">
                <li className="pricing-item">✓ Up to 100 instruments</li>
                <li className="pricing-item">✓ Basic analytics</li>
                <li className="pricing-item">✓ Email support</li>
                <li className="pricing-item">✓ Monthly reports</li>
              </ul>
              <button className="cta" onClick={onOpenDashboard} style={{ width: '100%', fontSize: '14px' }}>
                Get Started
              </button>
            </div>

            {/* Plan 2 - Featured */}
            <div className="pricing-card featured">
              <div className="pricing-badge">
                POPULAR
              </div>
              <h3 className="pricing-title">
                Enterprise
              </h3>
              <div className="pricing-price">
                <span className="pricing-amount">$999</span>
                <span className="pricing-period">/month</span>
              </div>
              <ul className="pricing-features">
                <li className="pricing-item">✓ Unlimited instruments</li>
                <li className="pricing-item">✓ Advanced analytics</li>
                <li className="pricing-item">✓ Priority 24/7 support</li>
                <li className="pricing-item">✓ Custom integrations</li>
              </ul>
              <button className="cta" onClick={onOpenDashboard} style={{ width: '100%', fontSize: '14px', background: 'rgba(255,255,255,0.2)', color: 'white' }}>
                Get Started
              </button>
            </div>

            {/* Plan 3 */}
            <div className="pricing-card">
              <h3 className="pricing-title">
                Custom
              </h3>
              <div className="pricing-price">
                <span className="pricing-amount">Custom</span>
                <span className="pricing-period"> Pricing</span>
              </div>
              <ul className="pricing-features">
                <li className="pricing-item">✓ Bespoke solutions</li>
                <li className="pricing-item">✓ Dedicated manager</li>
                <li className="pricing-item">✓ On-site support</li>
                <li className="pricing-item">✓ SLA guarantee</li>
              </ul>
              <button className="cta" onClick={() => alert('Contact sales team')} style={{ width: '100%', fontSize: '14px' }}>
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container" style={{ maxWidth: '1200px', textAlign: 'center' }}>
          <h2 className="cta-heading">
            Ready to Transform Your Operations?
          </h2>
          <p className="cta-text">
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
