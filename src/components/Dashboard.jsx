import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useStore } from '../store/contextStore'
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

// Animated Counter Hook
function useAnimatedCounter(targetValue, duration = 800) {
  const [displayValue, setDisplayValue] = useState(0)
  
  useEffect(() => {
    let startTime = null
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const currentValue = Math.floor(progress * targetValue)
      setDisplayValue(currentValue)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [targetValue, duration])
  
  return displayValue
}

export default function Dashboard() {
  const { state } = useStore()
  const canvasRef1 = useRef(null)
  const canvasRef2 = useRef(null)
  const chart1Ref = useRef(null)
  const chart2Ref = useRef(null)
  
  const [selectedYear, setSelectedYear] = useState(2026)
  const [selectedMonth, setSelectedMonth] = useState(1) // February

  // Filter data by month/year
  const filteredData = useMemo(() => {
    return state.testResults.filter(test => {
      if (!test.date) return false
      const d = new Date(test.date)
      return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth
    })
  }, [state.testResults, selectedYear, selectedMonth])

  // Calculate stats
  const stats = useMemo(() => {
    const total = filteredData.length
    const passed = filteredData.filter(t => t.status === 'passed').length
    const failed = filteredData.filter(t => t.status === 'failed').length
    const passRate = total > 0 ? Math.round((passed / total) * 100) : 0
    
    return { total, passed, failed, passRate }
  }, [filteredData])

  // Instrument stats
  const instrumentData = useMemo(() => {
    const data = {}
    filteredData.forEach(test => {
      if (!data[test.instrument]) {
        data[test.instrument] = { passed: 0, failed: 0, total: 0 }
      }
      data[test.instrument].total++
      if (test.status === 'passed') data[test.instrument].passed++
      else data[test.instrument].failed++
    })
    return data
  }, [filteredData])

  // Daily data for chart 1
  const dailyData = useMemo(() => {
    const data = {}
    filteredData.forEach(test => {
      const dateKey = new Date(test.date).toLocaleDateString()
      if (!data[dateKey]) data[dateKey] = { passed: 0, failed: 0 }
      if (test.status === 'passed') data[dateKey].passed++
      else data[dateKey].failed++
    })
    return Object.entries(data).sort()
  }, [filteredData])

  // Chart 1: Daily Results
  useEffect(() => {
    if (!canvasRef1.current || dailyData.length === 0) return

    if (chart1Ref.current) chart1Ref.current.destroy()

    const ctx = canvasRef1.current.getContext('2d')
    const labels = dailyData.map(([date]) => date)
    const passed = dailyData.map(([, d]) => d.passed)
    const failed = dailyData.map(([, d]) => d.failed)

    chart1Ref.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: '✓ Passed', data: passed, backgroundColor: '#10b981', borderRadius: 4 },
          { label: '✗ Failed', data: failed, backgroundColor: '#ef4444', borderRadius: 4 }
        ]
      },
      options: {
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } },
        plugins: { legend: { position: 'top' } }
      }
    })

    return () => {
      if (chart1Ref.current) chart1Ref.current.destroy()
    }
  }, [dailyData])

  // Chart 2: Instrument Performance
  useEffect(() => {
    if (!canvasRef2.current || Object.keys(instrumentData).length === 0) return

    if (chart2Ref.current) chart2Ref.current.destroy()

    const ctx = canvasRef2.current.getContext('2d')
    const instruments = Object.keys(instrumentData)
    const passed = instruments.map(i => instrumentData[i].passed)
    const failed = instruments.map(i => instrumentData[i].failed)

    chart2Ref.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: instruments,
        datasets: [
          { label: '✓ Passed', data: passed, backgroundColor: '#10b981', borderRadius: 4 },
          { label: '✗ Failed', data: failed, backgroundColor: '#ef4444', borderRadius: 4 }
        ]
      },
      options: {
        indexAxis: 'y',
        maintainAspectRatio: false,
        scales: { x: { beginAtZero: true } },
        plugins: { legend: { position: 'top' } }
      }
    })

    return () => {
      if (chart2Ref.current) chart2Ref.current.destroy()
    }
  }, [instrumentData])

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const years = [2024, 2025, 2026]

  return (
    <div style={{ padding: '32px 28px', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 'bold', marginBottom: '8px', background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>📊 Testing Dashboard</h2>
        <p style={{ color: 'var(--muted)', marginBottom: '32px' }}>Real-time analytics and instrument performance metrics for {months[selectedMonth]} {selectedYear}</p>

        {/* Filters */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px', background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)', padding: '20px', borderRadius: '12px', border: '1.5px solid rgba(6,182,212,0.1)' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: 'var(--muted)', textTransform: 'uppercase' }}>📅 Month</label>
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid rgba(6,182,212,0.2)', background: 'rgba(255,255,255,0.2)', color: 'var(--text)', fontFamily: 'inherit', fontWeight: '500' }}>
              {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: 'var(--muted)', textTransform: 'uppercase' }}>📆 Year</label>
            <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid rgba(6,182,212,0.2)', background: 'rgba(255,255,255,0.2)', color: 'var(--text)', fontFamily: 'inherit', fontWeight: '500' }}>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <StatCard title="Total Tested" value={stats.total} icon="🧪" gradientStart="#06b6d4" gradientEnd="#0891b2" />
          <StatCard title="Passed" value={stats.passed} icon="✓" gradientStart="#10b981" gradientEnd="#059669" />
          <StatCard title="Failed" value={stats.failed} icon="✗" gradientStart="#dc2626" gradientEnd="#b91c1c" />
          <StatCard title="Pass Rate" value={stats.passRate} suffix="%" icon="📈" gradientStart="#f59e0b" gradientEnd="#d97706" />
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          <div style={{ background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)', padding: '24px', borderRadius: '12px', border: '1.5px solid rgba(6,182,212,0.1)', boxShadow: '0 8px 32px rgba(6,182,212,0.08)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '16px', color: 'var(--text)' }}>📊 Daily Test Results</h3>
            <div style={{ height: '350px' }}>
              <canvas ref={canvasRef1} />
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)', padding: '24px', borderRadius: '12px', border: '1.5px solid rgba(6,182,212,0.1)', boxShadow: '0 8px 32px rgba(6,182,212,0.08)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '16px', color: 'var(--text)' }}>⚙️ Instrument Performance</h3>
            <div style={{ height: '350px' }}>
              <canvas ref={canvasRef2} />
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)', padding: '24px', borderRadius: '12px', border: '1.5px solid rgba(6,182,212,0.1)', boxShadow: '0 8px 32px rgba(6,182,212,0.08)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '16px', color: 'var(--text)' }}>🔧 Instrument Test Summary</h3>
          {Object.keys(instrumentData).length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(6,182,212,0.1)' }}>
                    <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text)', fontWeight: 'bold', fontSize: '13px' }}>Instrument</th>
                    <th style={{ textAlign: 'center', padding: '12px', color: 'var(--text)', fontWeight: 'bold', fontSize: '13px' }}>Total</th>
                    <th style={{ textAlign: 'center', padding: '12px', color: 'var(--text)', fontWeight: 'bold', fontSize: '13px' }}>Passed</th>
                    <th style={{ textAlign: 'center', padding: '12px', color: 'var(--text)', fontWeight: 'bold', fontSize: '13px' }}>Failed</th>
                    <th style={{ textAlign: 'center', padding: '12px', color: 'var(--text)', fontWeight: 'bold', fontSize: '13px' }}>Success Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(instrumentData).map(([name, data], i) => (
                    <tr key={name} style={{ borderBottom: '1px solid rgba(6,182,212,0.08)', background: i % 2 === 0 ? 'rgba(6,182,212,0.02)' : 'transparent' }}>
                      <td style={{ padding: '12px', color: 'var(--text)', fontWeight: '500', fontSize: '13px' }}>{name}</td>
                      <td style={{ textAlign: 'center', padding: '12px', color: 'var(--muted)', fontSize: '13px' }}>{data.total}</td>
                      <td style={{ textAlign: 'center', padding: '12px', color: '#10b981', fontWeight: 'bold', fontSize: '13px' }}>{data.passed}</td>
                      <td style={{ textAlign: 'center', padding: '12px', color: '#dc2626', fontWeight: 'bold', fontSize: '13px' }}>{data.failed}</td>
                      <td style={{ textAlign: 'center', padding: '12px', color: 'var(--accent)', fontWeight: 'bold', fontSize: '13px' }}>{Math.round((data.passed / data.total) * 100)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '40px 20px', margin: 0 }}>📭 No test data available for {months[selectedMonth]} {selectedYear}</p>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, suffix = '', icon, gradientStart, gradientEnd }) {
  const animatedValue = useAnimatedCounter(value, 900)
  
  return (
    <div style={{ 
      background: `linear-gradient(135deg, ${gradientStart}20 0%, ${gradientEnd}15 100%), linear-gradient(180deg, rgba(255,255,255,0.5), rgba(255,255,255,0.2))`,
      backdropFilter: 'blur(16px)',
      padding: '28px',
      borderRadius: '18px',
      border: `2px solid ${gradientStart}30`,
      boxShadow: `0 20px 50px ${gradientStart}15, 0 0 40px ${gradientStart}10, inset 0 1px 0 rgba(255,255,255,0.6)`,
      transition: 'all .4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'
      e.currentTarget.style.boxShadow = `0 40px 80px ${gradientStart}25, 0 0 60px ${gradientStart}15, inset 0 1px 0 rgba(255,255,255,0.8)`
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0) scale(1)'
      e.currentTarget.style.boxShadow = `0 20px 50px ${gradientStart}15, 0 0 40px ${gradientStart}10, inset 0 1px 0 rgba(255,255,255,0.6)`
    }}>
      {/* Shimmer Effect */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
        animation: 'shimmer 3s infinite'
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
        <div>
          <p style={{ color: 'var(--muted)', fontSize: '12px', fontWeight: 'bold', marginBottom: '12px', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.9 }}>{title}</p>
          <p style={{ color: 'var(--text)', fontSize: '2.8rem', fontWeight: '800', margin: 0, background: `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-1px' }}>
            {animatedValue}{suffix}
          </p>
        </div>
        <div style={{ fontSize: '48px', opacity: 0.85 }}>{icon}</div>
      </div>
    </div>
  )
}
