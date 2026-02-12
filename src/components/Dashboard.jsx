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
    <div className="dashboard-container">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="dashboard-header">
          <h2>📊 Testing Dashboard</h2>
          <p>Real-time analytics and instrument performance metrics for {months[selectedMonth]} {selectedYear}</p>
        </div>

        {/* Filters */}
        <div className="filter-section">
          <div className="filter-group">
            <label className="filter-label">📅 Month</label>
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))} className="filter-select">
              {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">📆 Year</label>
            <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="filter-select">
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="stats-grid">
          <StatCard title="Total Tested" value={stats.total} icon="🧪" gradientStart="#06b6d4" gradientEnd="#0891b2" className="stat-card-blue" />
          <StatCard title="Passed" value={stats.passed} icon="✓" gradientStart="#10b981" gradientEnd="#059669" className="stat-card-green" />
          <StatCard title="Failed" value={stats.failed} icon="✗" gradientStart="#dc2626" gradientEnd="#b91c1c" className="stat-card-red" />
          <StatCard title="Pass Rate" value={stats.passRate} suffix="%" icon="📈" gradientStart="#f59e0b" gradientEnd="#d97706" className="stat-card-orange" />
        </div>

        {/* Charts */}
        <div className="charts-grid">
          <div className="chart-container">
            <h3>📊 Daily Test Results</h3>
            <div className="chart-canvas">
              <canvas ref={canvasRef1} />
            </div>
          </div>

          <div className="chart-container">
            <h3>⚙️ Instrument Performance</h3>
            <div className="chart-canvas">
              <canvas ref={canvasRef2} />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="summary-table">
          <h3>🔧 Instrument Test Summary</h3>
          {Object.keys(instrumentData).length > 0 ? (
            <div className="table-overflow">
              <table>
                <thead>
                  <tr>
                    <th>Instrument</th>
                    <th style={{ textAlign: 'center' }}>Total</th>
                    <th style={{ textAlign: 'center' }}>Passed</th>
                    <th style={{ textAlign: 'center' }}>Failed</th>
                    <th style={{ textAlign: 'center' }}>Success Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(instrumentData).map(([name, data], i) => (
                    <tr key={name}>
                      <td>{name}</td>
                      <td style={{ textAlign: 'center' }}>{data.total}</td>
                      <td style={{ textAlign: 'center' }} className="passed">{data.passed}</td>
                      <td style={{ textAlign: 'center' }} className="failed">{data.failed}</td>
                      <td style={{ textAlign: 'center' }} className="rate">{Math.round((data.passed / data.total) * 100)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="table-empty">📭 No test data available for {months[selectedMonth]} {selectedYear}</p>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, suffix = '', icon, gradientStart, gradientEnd, className }) {
  const animatedValue = useAnimatedCounter(value, 900)
  
  return (
    <div className={`stat-card ${className}`}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'
      e.currentTarget.style.boxShadow = `0 40px 80px ${gradientStart}25, 0 0 60px ${gradientStart}15, inset 0 1px 0 rgba(255,255,255,0.8)`
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0) scale(1)'
      e.currentTarget.style.boxShadow = `0 20px 50px ${gradientStart}15, 0 0 40px ${gradientStart}10, inset 0 1px 0 rgba(255,255,255,0.6)`
    }}>
      {/* Shimmer Effect */}
      <div className="card-shine" />

      <div className="stat-card-content">
        <div>
          <p className="stat-card-text">{title}</p>
          <p className="stat-card-value" style={{ background: `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            {animatedValue}{suffix}
          </p>
        </div>
        <div className="stat-icon">{icon}</div>
      </div>
    </div>
  )
}
