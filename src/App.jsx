import React, {useState} from 'react'
import { StoreProvider } from './store/contextStore'
import Home from './components/Home'
import LandingPage from './components/LandingPage'
import Dashboard from './components/Dashboard'

export default function App(){
  const [route, setRoute] = useState('home')

  return (
    <StoreProvider>
      <div className="site">
        <header className="site-header container">
          <h1 className="logo">Instrument Dashboard</h1>
          <nav className="nav">
            <button className={`nav-link ${route==='home'?'active':''}`} onClick={()=>setRoute('home')}>Home</button>
            <button className={`nav-link ${route==='landing'?'active':''}`} onClick={()=>setRoute('landing')}>Landing Page</button>
            <button className={`nav-link ${route==='dashboard'?'active':''}`} onClick={()=>setRoute('dashboard')}>Dashboard</button>
          </nav>
        </header>

        <main className="container" style={{padding:24}}>
          {route==='home' && <Home onOpenDashboard={()=>setRoute('dashboard')}/>} 
          {route==='landing' && <LandingPage onOpenDashboard={()=>setRoute('dashboard')}/>} 
          {route==='dashboard' && <Dashboard/>}
        </main>

        <footer className="site-footer container">© {new Date().getFullYear()} Instrument Dashboard</footer>
      </div>
    </StoreProvider>
  )
}
