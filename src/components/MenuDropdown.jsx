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
        style={{
          background: open 
            ? 'linear-gradient(135deg, #06b6d4, #0891b2)'
            : 'rgba(6,182,212,0.1)',
          border: '1.5px solid rgba(6,182,212,0.3)',
          color: open ? '#ffffff' : 'var(--accent)',
          cursor: 'pointer',
          padding: '10px 14px',
          borderRadius: '12px',
          fontWeight: '600',
          fontSize: '13px',
          transition: 'all .25s cubic-bezier(0.4,0,0.2,1)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          whiteSpace: 'nowrap',
          boxShadow: open ? '0 8px 24px rgba(6,182,212,0.3)' : 'none',
          position: 'relative'
        }}
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
        <span style={{ fontSize: '16px', display: 'flex' }}>☆</span>
        {isLoggedIn ? user?.username : 'Menu'}
      </button>

      {/* Dropdown Menu - Unique Design */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 12px)',
            right: 0,
            background: 'rgba(255,255,255,0.5)',
            backdropFilter: 'blur(15px)',
            border: '1.5px solid rgba(6,182,212,0.15)',
            borderRadius: '16px',
            minWidth: '280px',
            boxShadow: '0 20px 60px rgba(6,182,212,0.12), inset 0 1px 0 rgba(255,255,255,0.8)',
            zIndex: 1000,
            animation: 'slideDown .25s cubic-bezier(0.34,1.56,0.64,1)',
            overflow: 'hidden'
          }}
        >
          {/* Menu Header */}
          {isLoggedIn && (
            <div style={{
              padding: '12px 16px',
              background: 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(8,145,178,0.04))',
              borderBottom: '1px solid rgba(6,182,212,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '18px' }}>👤</span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text)' }}>
                  {user?.username}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Logged in</div>
              </div>
            </div>
          )}

          <div style={{ padding: '8px 0' }}>
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
            <div style={{ margin: '8px 0', borderTop: '1px solid rgba(6,182,212,0.08)' }} />

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
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            backdropFilter: 'blur(4px)'
          }}
          onClick={() => setLoginModal(false)}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.5)',
              backdropFilter: 'blur(15px)',
              padding: '32px',
              borderRadius: '16px',
              minWidth: '320px',
              border: '1.5px solid rgba(6,182,212,0.15)',
              boxShadow: '0 28px 80px rgba(6,182,212,0.1), inset 0 1px 0 rgba(255,255,255,0.8)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 20px', color: 'var(--text)', fontSize: '1.3rem' }}>Welcome Back</h3>
            <input
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              style={{
                width: '100%',
                padding: '12px 14px',
                marginBottom: '16px',
                background: 'rgba(255,255,255,0.4)',
                border: '1.5px solid rgba(6,182,212,0.2)',
                borderRadius: '10px',
                color: 'var(--text)',
                fontSize: '14px',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.6)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(6,182,212,0.2)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.4)'
              }}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleLogin}
                style={{
                  flex: 1,
                  padding: '11px',
                  background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontSize: '13px',
                  transition: 'all .2s ease'
                }}
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
                style={{
                  flex: 1,
                  padding: '11px',
                  background: 'rgba(255,255,255,0.3)',
                  color: 'var(--muted)',
                  border: '1.5px solid rgba(6,182,212,0.1)',
                  borderRadius: '10px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '13px',
                  transition: 'all .2s ease'
                }}
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
      style={{
        width: '100%',
        padding: '12px 16px',
        textAlign: 'left',
        background: 'transparent',
        border: 'none',
        color: isDanger ? '#dc2626' : isAuth ? 'var(--accent)' : 'var(--text)',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: isAuth || isDanger ? '600' : '500',
        transition: 'all .15s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}
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
      <span style={{ fontSize: '16px', display: 'flex', alignItems: 'center' }}>{icon}</span>
      <span>{label}</span>
    </button>
  )
}
