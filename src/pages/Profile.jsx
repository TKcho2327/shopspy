import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const RANKS = [
  { level: 4, name: 'Silver Agent', color: '#aaa', min: 0 },
  { level: 3, name: 'Gold Agent', color: '#ffd700', min: 20 },
  { level: 2, name: 'Sapphire Agent', color: '#4fa3ff', min: 50 },
  { level: 1, name: 'Ruby Elite', color: '#ff4f4f', min: 100 },
]

export default function Profile() {
  const navigate = useNavigate()
  const [agent] = useState({
    name: 'Agent_Fairfax',
    reports: 24,
    validVotes: 103,
    flagged: 0,
    totalEarned: 24.70,
    balance: 12.40,
  })

  const score = agent.reports + agent.validVotes
  const currentRank = [...RANKS].reverse().find(r => score >= r.min) || RANKS[0]
  const nextRank = RANKS.find(r => r.min > score)
  const progress = nextRank
    ? Math.round(((score - currentRank.min) / (nextRank.min - currentRank.min)) * 100)
    : 100

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', fontFamily: 'Noto Sans KR, sans-serif', color: '#e4e1e9', paddingBottom: 100 }}>

      {/* 헤더 */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid #1e1e24' }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#e4e1e9', fontSize: 20, cursor: 'pointer' }}>←</button>
        <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>My Profile</span>
        <div style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #00ff9d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🛡️</div>
      </header>

      <div style={{ padding: 16 }}>

        {/* 프로필 카드 */}
        <div style={{ background: '#1a1a1f', borderRadius: 16, border: '1px solid #2a2a30', padding: 20, marginBottom: 16, textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#2a2a30', border: `2px solid ${currentRank.color}`, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>🕵️</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', marginBottom: 4 }}>{agent.name}</div>
          <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 20, background: `${currentRank.color}22`, border: `1px solid ${currentRank.color}`, fontSize: 11, fontWeight: 700, color: currentRank.color, marginBottom: 16 }}>
            {currentRank.name.toUpperCase()}
          </div>

          {/* 스탯 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ background: '#0a0a0f', borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#00ff9d' }}>{agent.reports}</div>
              <div style={{ fontSize: 10, color: '#555', marginTop: 2 }}>TOTAL REPORTS</div>
            </div>
            <div style={{ background: '#0a0a0f', borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#00ff9d' }}>{agent.validVotes}</div>
              <div style={{ fontSize: 10, color: '#555', marginTop: 2 }}>VALID VOTES</div>
            </div>
          </div>
        </div>

        {/* 등급 진행률 */}
        <div style={{ background: '#1a1a1f', borderRadius: 16, border: '1px solid #2a2a30', padding: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#555', letterSpacing: 1, marginBottom: 12 }}>CLEARANCE LEVEL</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: currentRank.color }}>{currentRank.name}</span>
            {nextRank && <span style={{ fontSize: 11, color: '#555' }}>→ {nextRank.name}</span>}
          </div>
          <div style={{ height: 6, background: '#2a2a30', borderRadius: 3, overflow: 'hidden', marginBottom: 6 }}>
            <div style={{ height: '100%', width: `${progress}%`, background: currentRank.color, borderRadius: 3, transition: 'width 0.4s' }} />
          </div>
          <div style={{ fontSize: 11, color: '#555', textAlign: 'right' }}>{progress}%</div>
          {nextRank && (
            <div style={{ fontSize: 11, color: '#555', marginTop: 8 }}>
              다음 등급까지 {nextRank.min - score}점 남았어요 (제보 + 유효투표 합산)
            </div>
          )}
        </div>

        {/* 지갑 바로가기 */}
        <div onClick={() => navigate('/wallet')} style={{ background: '#1a1a1f', borderRadius: 16, border: '1px solid #2a2a30', padding: 20, marginBottom: 16, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#555', letterSpacing: 1, marginBottom: 4 }}>WALLET BALANCE</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#00ff9d' }}>${agent.balance.toFixed(2)}</div>
            <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>총 적립 ${agent.totalEarned.toFixed(2)}</div>
          </div>
          <span style={{ fontSize: 24 }}>💰</span>
        </div>

        {/* 메뉴 */}
        {[
          { icon: '📋', label: 'My Report History', path: null },
          { icon: '⚙️', label: 'Settings', path: null },
          { icon: '🚪', label: 'Logout', path: null, red: true },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#1a1a1f', borderRadius: 12, border: '1px solid #2a2a30', marginBottom: 8, cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span style={{ fontSize: 14, color: item.red ? '#ff4f4f' : '#e4e1e9' }}>{item.label}</span>
            </div>
            <span style={{ color: '#555' }}>›</span>
          </div>
        ))}

      </div>

      {/* 하단 탭바 */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', height: 72, zIndex: 50, display: 'flex', justifyContent: 'space-around', alignItems: 'center', background: 'rgba(13,13,20,0.95)', backdropFilter: 'blur(12px)', borderTop: '1px solid #1e1e24', borderRadius: '12px 12px 0 0' }}>
        {[
          { icon: '📡', label: 'INTEL', path: '/' },
          { icon: '🔔', label: 'ALERTS', path: null },
          { icon: '➕', label: 'POST', path: '/report' },
          { icon: '👤', label: 'PROFILE', path: '/profile', active: true },
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