import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Wallet() {
  const navigate = useNavigate()
  const [wallet, setWallet] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWallet()
  }, [])

  async function fetchWallet() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: walletData } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .single()

    const { data: posts } = await supabase
      .from('posts')
      .select('brand_name, created_at')
      .eq('agent_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    setWallet(walletData)
    setHistory(posts || [])
    setLoading(false)
  }

  const balance = wallet?.balance || 0
  const totalEarned = wallet?.total_earned || 0
  const spyPoints = wallet?.spy_points || 0

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', fontFamily: 'Noto Sans KR, sans-serif', color: '#e4e1e9', paddingBottom: 100 }}>

      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid #1e1e24' }}>
        <button onClick={() => navigate('/profile')} style={{ background: 'none', border: 'none', color: '#e4e1e9', fontSize: 20, cursor: 'pointer' }}>←</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>MY WALLET</span>
        </div>
        <span style={{ fontSize: 16, fontWeight: 900, color: '#00e38b' }}>SHOPSPY 🕵️</span>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#555' }}>
          <div style={{ fontSize: 32 }}>🕵️</div>
          <div style={{ marginTop: 8 }}>Loading...</div>
        </div>
      ) : (
        <div style={{ padding: 16 }}>

          <div style={{ background: '#1a1a1f', borderRadius: 16, border: '1px solid #2a2a30', padding: 20, marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#555', letterSpacing: 1, marginBottom: 4 }}>CURRENT BALANCE</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#00ff9d', marginBottom: 4 }}>${balance.toFixed(2)}</div>
            <div style={{ fontSize: 12, color: '#555' }}>↑ Total earned: ${totalEarned.toFixed(2)}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
              <button style={{ padding: '10px', background: 'rgba(0,255,157,0.1)', border: '1px solid rgba(0,255,157,0.3)', borderRadius: 10, color: '#00ff9d', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                💳 Use for Shopping
              </button>
              <button style={{ padding: '10px', background: '#1a1a1f', border: '1px solid #2a2a30', borderRadius: 10, color: '#e4e1e9', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                💸 Withdraw
              </button>
            </div>
          </div>

          <div style={{ background: '#1a1a1f', borderRadius: 16, border: '1px solid #2a2a30', padding: 20, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#555', letterSpacing: 1 }}>SPY REWARDS</div>
              <div style={{ fontSize: 11, color: '#00ff9d', fontWeight: 700 }}>{spyPoints} / 300 pts</div>
            </div>
            <div style={{ height: 6, background: '#2a2a30', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
              <div style={{ height: '100%', width: `${Math.min((spyPoints / 300) * 100, 100)}%`, background: 'linear-gradient(90deg, #00ff9d, #4fa3ff)', borderRadius: 3 }} />
            </div>
            <div style={{ fontSize: 11, color: '#555' }}>→ {Math.max(300 - spyPoints, 0)}점 더 모으면 $3 할인 쿠폰!</div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#555', letterSpacing: 1 }}>INTEL EXTRACTION LOG</div>
            </div>
            {history.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 20, color: '#555', fontSize: 13 }}>아직 제보 내역이 없어요</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {history.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#1a1a1f', borderRadius: 12, border: '1px solid #2a2a30' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{item.brand_name}</div>
                      <div style={{ fontSize: 11, color: '#555' }}>{new Date(item.created_at).toLocaleDateString()}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 14, fontWeight: 900, color: '#00ff9d' }}>+$0.10</div>
                      <div style={{ fontSize: 10, color: '#00ff9d', opacity: 0.7 }}>VERIFIED</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

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