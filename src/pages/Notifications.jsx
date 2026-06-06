import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Notifications() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('All')

  const notifications = [
    { type: 'flash', icon: '⚡', title: 'Flash Deal! Moncler 60% OFF - First 50 only', time: 'Just now', sub: 'Last few · Premium only', color: '#ffab3d', urgent: true },
    { type: 'follow', icon: '🕵️', title: 'Agent_McLean new deal · Gucci Tysons 29% OFF', time: '3 mins ago', sub: '', color: '#00ff9d', urgent: false },
    { type: 'vote', icon: '👍', title: 'Nike report got 24 valid votes! +12 trust score', time: '1 hr ago', sub: '', color: '#4fa3ff', urgent: false },
    { type: 'warning', icon: '⚠️', title: 'Coach report 23hrs old · may have changed', time: '23 hrs ago', sub: '', color: '#ffab3d', urgent: false },
    { type: 'flag', icon: '🚨', title: 'Kate Spade report has 2 flags', time: '1 day ago', sub: '', color: '#ff4f4f', urgent: false },
  ]

  const tabs = ['All', 'Flash Deals', 'Following', 'Votes']

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', fontFamily: 'Noto Sans KR, sans-serif', color: '#e4e1e9', paddingBottom: 100 }}>

      {/* 헤더 */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid #1e1e24' }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#e4e1e9', fontSize: 20, cursor: 'pointer' }}>←</button>
        <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>🔔 Notifications</span>
        <button style={{ background: 'none', border: 'none', color: '#555', fontSize: 12, cursor: 'pointer' }}>ALL READ</button>
      </header>

      {/* 탭 */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #1e1e24', padding: '0 16px' }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{ background: 'none', border: 'none', borderBottom: activeTab === tab ? '2px solid #00ff9d' : '2px solid transparent', padding: '12px 14px', fontSize: 11, fontWeight: 700, color: activeTab === tab ? '#00ff9d' : '#555', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {tab}
          </button>
        ))}
      </div>

      {/* INTEL SUMMARY */}
      <div style={{ margin: 16, background: '#1a1a1f', borderRadius: 12, border: '1px solid #2a2a30', padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#555', letterSpacing: 1 }}>INTEL SUMMARY</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: '#00ff9d' }}>94%</div>
        <div style={{ fontSize: 11, color: '#555' }}>Efficiency Level 04</div>
      </div>

      {/* 알림 리스트 */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {notifications.map((n, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, padding: '14px', background: n.urgent ? 'rgba(255,171,61,0.05)' : '#1a1a1f', borderRadius: 12, border: `1px solid ${n.urgent ? 'rgba(255,171,61,0.3)' : '#2a2a30'}`, cursor: 'pointer' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${n.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
              {n.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: '#e4e1e9', marginBottom: 2, lineHeight: 1.4 }}>{n.title}</div>
              {n.sub && <div style={{ fontSize: 11, color: '#ffab3d', marginBottom: 2 }}>{n.sub}</div>}
              <div style={{ fontSize: 11, color: '#555' }}>{n.time}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 하단 탭바 */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', height: 72, zIndex: 50, display: 'flex', justifyContent: 'space-around', alignItems: 'center', background: 'rgba(13,13,20,0.95)', backdropFilter: 'blur(12px)', borderTop: '1px solid #1e1e24', borderRadius: '12px 12px 0 0' }}>
        {[
          { icon: '📡', label: 'INTEL', path: '/' },
          { icon: '🔔', label: 'ALERTS', path: '/notifications', active: true },
          { icon: '➕', label: 'POST', path: '/report' },
          { icon: '👤', label: 'PROFILE', path: '/profile' },
        ].map(tab => (
          <div key={tab.label} onClick={() => tab.path && navigate(tab.path)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, cursor: 'pointer', opacity: tab.active ? 1 : 0.4 }}>
            <span style={{ fontSize: 20 }}>{tab.icon}</span>
            <span style={{ fontSize: 8, fontWeight: 700, color: tab.active ? '#00ff9d' : '#888' }}>{tab.label}</span>
          </div>
        ))}
      </nav>

    </div>
  )
}