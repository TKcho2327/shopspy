import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Subscription() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState('premium')
  const [spyPoints] = useState(178)

  const discount = Math.min((spyPoints / 300) * 3, 3).toFixed(2)
  const finalPrice = (9.99 - parseFloat(discount)).toFixed(2)
  const waitlistCount = 3247

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', fontFamily: 'Noto Sans KR, sans-serif', color: '#e4e1e9', paddingBottom: 100 }}>

      {/* 헤더 */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid #1e1e24' }}>
        <button onClick={() => navigate('/profile')} style={{ background: 'none', border: 'none', color: '#e4e1e9', fontSize: 20, cursor: 'pointer' }}>←</button>
        <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>💎 Subscription</span>
        <div style={{ width: 28 }} />
      </header>

      <div style={{ padding: 16 }}>

        {/* 웨이팅 배너 */}
        <div style={{ background: 'rgba(255,171,61,0.1)', border: '1px solid rgba(255,171,61,0.3)', borderRadius: 12, padding: 16, marginBottom: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#ffab3d', letterSpacing: 1, marginBottom: 6 }}>WAITLIST STATUS</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', marginBottom: 4 }}>{waitlistCount.toLocaleString()} / 5,000</div>
          <div style={{ height: 6, background: '#2a2a30', borderRadius: 3, overflow: 'hidden', margin: '8px 0' }}>
            <div style={{ height: '100%', width: `${(waitlistCount / 5000) * 100}%`, background: '#ffab3d', borderRadius: 3 }} />
          </div>
          <div style={{ fontSize: 12, color: '#888' }}>5,000명 달성 시 프리미엄 오픈 · {5000 - waitlistCount}명 남음</div>
        </div>

        {/* 플랜 선택 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>

          {/* 무료 플랜 */}
          <div onClick={() => setSelected('free')}
            style={{ padding: 20, background: selected === 'free' ? 'rgba(0,255,157,0.05)' : '#1a1a1f', borderRadius: 16, border: `1.5px solid ${selected === 'free' ? 'rgba(0,255,157,0.4)' : '#2a2a30'}`, cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Free Plan</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#00ff9d', marginTop: 4 }}>$0 <span style={{ fontSize: 12, color: '#555' }}>/ year</span></div>
              </div>
              <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${selected === 'free' ? '#00ff9d' : '#555'}`, background: selected === 'free' ? '#00ff9d' : 'transparent' }} />
            </div>
            {['Basic feed access', 'Report rewards', 'Limited malls'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ color: '#00ff9d', fontSize: 12 }}>✓</span>
                <span style={{ fontSize: 13, color: '#888' }}>{f}</span>
              </div>
            ))}
          </div>

          {/* 프리미엄 플랜 */}
          <div onClick={() => setSelected('premium')}
            style={{ padding: 20, background: selected === 'premium' ? 'rgba(0,255,157,0.05)' : '#1a1a1f', borderRadius: 16, border: `1.5px solid ${selected === 'premium' ? '#00ff9d' : '#2a2a30'}`, cursor: 'pointer', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -10, left: 16, background: '#00ff9d', color: '#000', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>PREMIUM</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Premium Plan</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#00ff9d', marginTop: 4 }}>
                  ${finalPrice} <span style={{ fontSize: 12, color: '#555' }}>/ year</span>
                </div>
                {parseFloat(discount) > 0 && (
                  <div style={{ fontSize: 11, color: '#ffab3d', marginTop: 2 }}>
                    포인트 할인 -${discount} 적용됨 (원가 $9.99)
                  </div>
                )}
              </div>
              <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${selected === 'premium' ? '#00ff9d' : '#555'}`, background: selected === 'premium' ? '#00ff9d' : 'transparent' }} />
            </div>
            {['Ad-free feed', 'Flash deal priority alerts', 'Unlimited mall access', 'Premium badge', '90-day free trial'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ color: '#00ff9d', fontSize: 12 }}>✓</span>
                <span style={{ fontSize: 13, color: '#e4e1e9' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SPY 포인트 할인 안내 */}
        <div style={{ background: '#1a1a1f', borderRadius: 12, border: '1px solid #2a2a30', padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#555', letterSpacing: 1, marginBottom: 8 }}>SPY REWARDS DISCOUNT</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 13, color: '#888' }}>보유 포인트</span>
            <span style={{ fontSize: 13, color: '#00ff9d', fontWeight: 700 }}>{spyPoints} pts</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 13, color: '#888' }}>적용 할인</span>
            <span style={{ fontSize: 13, color: '#ffab3d', fontWeight: 700 }}>-${discount}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: '#888' }}>최종 결제액</span>
            <span style={{ fontSize: 16, color: '#fff', fontWeight: 900 }}>${finalPrice}</span>
          </div>
        </div>

        {/* CTA 버튼 */}
        <button
          onClick={() => alert(selected === 'premium' ? '🎉 웨이팅 등록 완료! 5,000명 달성 시 알림을 드릴게요.' : '무료 플랜을 선택하셨어요.')}
          style={{ width: '100%', height: 52, background: '#00ff9d', color: '#000', fontSize: 15, fontWeight: 700, borderRadius: 12, border: 'none', cursor: 'pointer', boxShadow: '0 8px 32px rgba(0,255,157,0.3)' }}>
          {selected === 'premium' ? '🚀 Join Waitlist & Get Notified' : '무료로 계속하기'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 11, color: '#555', marginTop: 12 }}>
          5,000명 달성 후 자동 오픈 · 신용카드 불필요
        </p>

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