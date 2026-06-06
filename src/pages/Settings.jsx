import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Settings() {
  const navigate = useNavigate()
  const [flashDeals, setFlashDeals] = useState(true)
  const [followingAlerts, setFollowingAlerts] = useState(true)
  const [voteAlerts, setVoteAlerts] = useState(false)
  const [expiryWarnings, setExpiryWarnings] = useState(true)

  const Toggle = ({ value, onChange }) => (
    <div onClick={() => onChange(!value)}
      style={{ width: 44, height: 24, borderRadius: 12, background: value ? '#00ff9d' : '#2a2a30', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
      <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: value ? 23 : 3, transition: 'left 0.2s' }} />
    </div>
  )

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', fontFamily: 'Noto Sans KR, sans-serif', color: '#e4e1e9', paddingBottom: 100 }}>

      {/* 헤더 */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid #1e1e24' }}>
        <button onClick={() => navigate('/profile')} style={{ background: 'none', border: 'none', color: '#e4e1e9', fontSize: 20, cursor: 'pointer' }}>←</button>
        <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>⚙️ Settings</span>
        <div style={{ width: 28 }} />
      </header>

      <div style={{ padding: 16 }}>

        {/* 알림 설정 */}
        <div style={{ fontSize: 10, fontWeight: 700, color: '#555', letterSpacing: 1, marginBottom: 12 }}>NOTIFICATION SETTINGS</div>

        {[
          { label: '⚡ Flash Deal Alerts', sub: 'Premium exclusive', value: flashDeals, onChange: setFlashDeals },
          { label: '🕵️ Following Alerts', sub: '', value: followingAlerts, onChange: setFollowingAlerts },
          { label: '👍 Vote Result Alerts', sub: '', value: voteAlerts, onChange: setVoteAlerts },
          { label: '⚠️ Expiry Warnings', sub: '', value: expiryWarnings, onChange: setExpiryWarnings },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#1a1a1f', borderRadius: 12, border: '1px solid #2a2a30', marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 14, color: '#e4e1e9' }}>{item.label}</div>
              {item.sub && <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>{item.sub}</div>}
            </div>
            <Toggle value={item.value} onChange={item.onChange} />
          </div>
        ))}

        {/* 앱 설정 */}
        <div style={{ fontSize: 10, fontWeight: 700, color: '#555', letterSpacing: 1, margin: '20px 0 12px' }}>APP SETTINGS</div>

        {[
          { icon: '🏬', label: 'Favorite Malls' },
          { icon: '🌐', label: 'Language' },
          { icon: '👤', label: 'Account' },
          { icon: '🚪', label: 'Logout', red: true },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#1a1a1f', borderRadius: 12, border: '1px solid #2a2a30', marginBottom: 8, cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span style={{ fontSize: 14, color: item.red ? '#ff4f4f' : '#e4e1e9' }}>{item.label}</span>
            </div>
            <span style={{ color: '#555' }}>›</span>
          </div>
        ))}

        {/* 버전 */}
        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 11, color: '#333' }}>
          ShopSpy v1.0.0 · Encryption Active 🔒
        </div>

      </div>

      {/* 하단 탭바 */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', height: 72, zIndex: 50, display: 'flex', justifyContent: 'space-around', alignItems: 'center', background: 'rgba(13,13,20,0.95)', backdropFilter: 'blur(12px)', borderTop: '1px solid #1e1e24', borderRadius: '12px 12px 0 0' }}>
        {[
          { icon: '📡', label: 'INTEL', path: '/' },
          { icon: '🔔', label: 'ALERTS', path: '/notifications' },
          { icon: '➕', label: 'POST', path: '/report' },
          { icon: '👤', label: 'PROFILE', path: '/profile' },
        ].map(tab => (
          <div key={tab.label} onClick={() => navigate(tab.path)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, cursor: 'pointer', opacity: 0.4 }}>
            <span style={{ fontSize: 20 }}>{tab.icon}</span>
            <span style={{ fontSize: 8, fontWeight: 700, color: '#888' }}>{tab.label}</span>
          </div>
        ))}
      </nav>

    </div>
  )
}