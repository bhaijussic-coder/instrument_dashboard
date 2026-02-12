// Export to PDF
export function exportToPDF(state) {
  const { instruments, testResults, instrumentsByCategory } = state
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Instrument Dashboard Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 10px; text-align: left; border: 1px solid #ddd; }
        th { background: #1a2f42; color: white; }
        .section { margin: 30px 0; page-break-inside: avoid; }
      </style>
    </head>
    <body>
      <h1>Instrument Dashboard Report</h1>
      <p>Generated: ${new Date().toLocaleString()}</p>

      <div class="section">
        <h2>Summary</h2>
        <p>Total Instruments: ${instruments.length}</p>
        <p>Total Test Results: ${testResults.length}</p>
      </div>

      <div class="section">
        <h2>Instruments by Category</h2>
        ${Object.entries(instrumentsByCategory).map(([cat, list]) => `
          <h3>${cat} (${list.length} items)</h3>
          <ul>
            ${list.map(item => `<li>${item}</li>`).join('')}
          </ul>
        `).join('')}
      </div>

      <div class="section">
        <h2>Test Results Summary</h2>
        <table>
          <thead>
            <tr><th>ID</th><th>Instrument</th><th>Status</th><th>Date</th></tr>
          </thead>
          <tbody>
            ${testResults.map(r => `
              <tr>
                <td>${r.id}</td>
                <td>${r.instrument}</td>
                <td style="color: ${r.status === 'passed' ? 'green' : 'red'}">${r.status}</td>
                <td>${new Date(r.date).toLocaleDateString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </body>
    </html>
  `

  const blob = new Blob([html], { type: 'text/html' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `instrument-report-${Date.now()}.html`
  a.click()
  window.URL.revokeObjectURL(url)
}

// Export to Excel (as CSV)
export function exportToExcel(state) {
  const { instruments, testResults, instrumentsByCategory } = state
  
  let csv = 'Instrument Dashboard Report\n'
  csv += `Generated: ${new Date().toLocaleString()}\n\n`

  csv += 'SUMMARY\n'
  csv += `Total Instruments,${instruments.length}\n`
  csv += `Total Test Results,${testResults.length}\n\n`

  csv += 'INSTRUMENTS BY CATEGORY\n'
  Object.entries(instrumentsByCategory).forEach(([cat, list]) => {
    csv += `${cat},${list.length}\n`
    list.forEach(item => csv += `,${item}\n`)
    csv += '\n'
  })

  csv += 'TEST RESULTS\nID,Instrument,Status,Date\n'
  testResults.forEach(r => {
    csv += `${r.id},"${r.instrument}",${r.status},${new Date(r.date).toLocaleDateString()}\n`
  })

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `instrument-report-${Date.now()}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}

// Fill sample data (for demo)
export function fillSampleData(dispatch) {
  dispatch({
    type: 'SET_STATE',
    payload: {
      testResults: [
        ...Array.from({length: 20}, (_, i) => ({
          id: 100 + i,
          instrument: ['Monopolar_Hook', 'Maryland_Bipolar_Forceps', 'Potts_Scissors', 'Large_Needle_Driver'][Math.floor(Math.random() * 4)],
          status: Math.random() > 0.3 ? 'passed' : 'failed',
          date: new Date(2026, 1, Math.floor(Math.random() * 28) + 1)
        }))
      ]
    }
  })
}
