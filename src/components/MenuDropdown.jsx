import React, { useState } from 'react'
import { useAuth } from '../store/authContext'
import { useStore } from '../store/contextStore'
import { exportToPDF, exportToExcel, fillSampleData } from '../utils/exportUtils'

export default function MenuDropdown() {
  const { isLoggedIn, user, login, logout } = useAuth()
  const { state, dispatch } = useStore()
  const [open, setOpen] = useState(false)
  const [loginModal, setLoginModal] = useState(false)
  const [username, setUsername] = useState('')

  const handleLogin = () => {
    if (username.trim()) {
      login(username)
      setUsername('')
      setLoginModal(false)
      setOpen(false)
    }
  }

  const handleLogout = () => {
    logout()
    setOpen(false)
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Menu Button - Unique Floating Design */}
      <button
        onClick={() => setOpen(!open)}
        className={`menu-button ${open ? 'open' : ''}`}
        onMouseEnter={(e) => {
          if (!open) {
            e.currentTarget.style.background = 'rgba(6,182,212,0.15)'
            e.currentTarget.style.borderColor = 'var(--accent)'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }
        }}
        onMouseLeave={(e) => {
          if (!open) {
            e.currentTarget.style.background = 'rgba(6,182,212,0.1)'
            e.currentTarget.style.borderColor = 'rgba(6,182,212,0.3)'
            e.currentTarget.style.transform = 'translateY(0)'
          }
        }}
      >
        <span className="menu-icon">☆</span>
        {isLoggedIn ? user?.username : 'Menu'}
      </button>

      {/* Dropdown Menu - Unique Design */}
      {open && (
        <div className="dropdown-menu">
          {/* Menu Header */}
          {isLoggedIn && (
            <div className="menu-header">
              <span style={{ fontSize: '18px' }}>👤</span>
              <div>
                <div className="menu-header-user">
                  {user?.username}
                </div>
                <div className="menu-header-status">Logged in</div>
              </div>
            </div>
          )}

          <div className="menu-items">
            {/* Export to PDF */}
            <MenuItemButton
              icon="📄"
              label="Export to PDF"
              onClick={() => {
                exportToPDF(state)
                setOpen(false)
              }}
            />

            {/* Export to Excel */}
            <MenuItemButton
              icon="📊"
              label="Export to Excel"
              onClick={() => {
                exportToExcel(state)
                setOpen(false)
              }}
            />

            {/* Fill Data */}
            <MenuItemButton
              icon="➕"
              label="Fill Sample Data"
              onClick={() => {
                fillSampleData(dispatch)
                setOpen(false)
              }}
            />

            {/* Divider */}
            <div className="menu-divider" />

            {/* Login / Logout */}
            {!isLoggedIn ? (
              <MenuItemButton
                icon="🔐"
                label="Sign In"
                onClick={() => setLoginModal(true)}
                isAuth={true}
              />
            ) : (
              <MenuItemButton
                icon="🚪"
                label="Logout"
                onClick={handleLogout}
                isDanger={true}
              />
            )}
          </div>
        </div>
      )}

      {/* Login Modal */}
      {loginModal && (
        <div className="modal-overlay" onClick={() => setLoginModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Welcome Back</h3>
            <input
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="modal-input"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.6)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(6,182,212,0.2)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.4)'
              }}
            />
            <div className="modal-actions">
              <button
                onClick={handleLogin}
                className="modal-btn"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(6,182,212,0.25)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                Sign In
              </button>
              <button
                onClick={() => setLoginModal(false)}
                className="modal-btn cancel"
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0,0,0,0.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.3)'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Menu Item Button Component
function MenuItemButton({ icon, label, onClick, isAuth, isDanger }) {
  return (
    <button
      onClick={onClick}
      className={`menu-item-btn ${isDanger ? 'danger' : ''} ${isAuth ? 'auth' : ''}`}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = isDanger 
          ? 'rgba(220,38,38,0.08)' 
          : isAuth 
          ? 'rgba(6,182,212,0.12)' 
          : 'rgba(6,182,212,0.06)'
        e.currentTarget.style.paddingLeft = '18px'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.paddingLeft = '16px'
      }}
    >
      <span className="menu-item-icon">{icon}</span>
      <span>{label}</span>
    </button>
  )
}
