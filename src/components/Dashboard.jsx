import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useStore } from '../store/contextStore'
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

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
    <div style={{ padding: '24px', minHeight: '100vh', color: '#e2e8f0' }}>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', color: '#fff' }}>📊 Instrument Testing Dashboard</h2>
      <p style={{ color: '#94a3b8', marginBottom: '32px' }}>Real-time testing analytics and instrument performance metrics</p>

      {/* Filters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px', backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#cbd5e1' }}>📅 MONTH</label>
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#e2e8f0' }}>
            {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#cbd5e1' }}>📆 YEAR</label>
          <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#e2e8f0' }}>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <StatCard title="Total Tested" value={stats.total} icon="🧪" color="#3b82f6" />
        <StatCard title="Passed" value={stats.passed} icon="✓" color="#10b981" />
        <StatCard title="Failed" value={stats.failed} icon="✗" color="#ef4444" />
        <StatCard title="Pass Rate" value={`${stats.passRate}%`} icon="📈" color="#f59e0b" />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '8px', border: '1px solid #334155' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', color: '#fff' }}>📊 Daily Test Results</h3>
          <div style={{ height: '350px' }}>
            <canvas ref={canvasRef1} />
          </div>
        </div>

        <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '8px', border: '1px solid #334155' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', color: '#fff' }}>⚙️ Instrument Performance</h3>
          <div style={{ height: '350px' }}>
            <canvas ref={canvasRef2} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '8px', border: '1px solid #334155' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', color: '#fff' }}>🔧 Instrument Test Summary</h3>
        {Object.keys(instrumentData).length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #475569' }}>
                <th style={{ textAlign: 'left', padding: '12px', color: '#cbd5e1', fontWeight: 'bold' }}>Instrument</th>
                <th style={{ textAlign: 'center', padding: '12px', color: '#cbd5e1', fontWeight: 'bold' }}>Total</th>
                <th style={{ textAlign: 'center', padding: '12px', color: '#cbd5e1', fontWeight: 'bold' }}>Passed</th>
                <th style={{ textAlign: 'center', padding: '12px', color: '#cbd5e1', fontWeight: 'bold' }}>Failed</th>
                <th style={{ textAlign: 'center', padding: '12px', color: '#cbd5e1', fontWeight: 'bold' }}>Success Rate</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(instrumentData).map(([name, data], i) => (
                <tr key={name} style={{ borderBottom: '1px solid #334155', backgroundColor: i % 2 === 0 ? '#0f172a' : 'transparent' }}>
                  <td style={{ padding: '12px', color: '#e2e8f0', fontWeight: '500' }}>{name}</td>
                  <td style={{ textAlign: 'center', padding: '12px', color: '#cbd5e1' }}>{data.total}</td>
                  <td style={{ textAlign: 'center', padding: '12px', color: '#10b981', fontWeight: 'bold' }}>{data.passed}</td>
                  <td style={{ textAlign: 'center', padding: '12px', color: '#ef4444', fontWeight: 'bold' }}>{data.failed}</td>
                  <td style={{ textAlign: 'center', padding: '12px', color: '#f59e0b', fontWeight: 'bold' }}>{Math.round((data.passed / data.total) * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>No test data available for {months[selectedMonth]} {selectedYear}</p>
        )}
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, color }) {
  return (
    <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', border: `1px solid #334155`, borderLeft: `4px solid ${color}` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', margin: 0, textTransform: 'uppercase' }}>{title}</p>
          <p style={{ color: '#e2e8f0', fontSize: '32px', fontWeight: 'bold', margin: 0 }}>{value}</p>
        </div>
        <div style={{ fontSize: '40px' }}>{icon}</div>
      </div>
    </div>
  )
}
