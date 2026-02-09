import React, {useEffect, useRef} from 'react'
import { useStore } from '../store/contextStore'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'

Chart.register(ArcElement, Tooltip, Legend)

export default function Dashboard(){
  const {state, dispatch} = useStore()
  const canvasRef = useRef(null)
  
  useEffect(()=>{
    const ctx = canvasRef.current && canvasRef.current.getContext('2d')
    if(!ctx) return

    const data = [
      state.testResults.filter(r=>r.status==='passed').length,
      state.testResults.filter(r=>r.status==='failed').length,
      state.testResults.filter(r=>r.status==='pending').length
    ]

    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Passed','Failed','Pending'],
        datasets: [{data, backgroundColor:['#10b981','#ef4444','#f59e0b']}]
      },
      options:{maintainAspectRatio:false}
    })

    return ()=>chart.destroy()
  },[state.testResults])

  // demo: function to add a random test result
  function addDemoResult(){
    const statuses = ['passed','failed','pending']
    const status = statuses[Math.floor(Math.random()*statuses.length)]
    dispatch({type:'ADD_TEST_RESULT', payload:{id:Date.now(), title:'Auto test', status}})
  }

  return (
    <div>
      <h2>QA Testing Dashboard</h2>

      <div className="cards">
        <div className="card"><h3>Total Test Cases</h3><p>{state.testResults.length}</p></div>
        <div className="card"><h3>Pass Rate</h3><p>{state.testResults.length?Math.round((state.testResults.filter(r=>r.status==='passed').length/state.testResults.length)*100):0}%</p></div>
        <div className="card"><h3>Failed Tests</h3><p>{state.testResults.filter(r=>r.status==='failed').length}</p></div>
        <div className="card"><h3>Open Bugs</h3><p>—</p></div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:16,marginTop:18}}>
        <div className="card">
          <h3>Test Results</h3>
          <div style={{height:260}}>
            <canvas ref={canvasRef}/>
          </div>
          <button className="cta" style={{marginTop:12}} onClick={addDemoResult}>Add demo result</button>
        </div>

        <div className="card">
          <h3>Recent Activity</h3>
          <ul>
            {state.testResults.slice().reverse().slice(0,6).map(r=> (
              <li key={r.id}>{r.title} — {r.status}</li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  )
}
