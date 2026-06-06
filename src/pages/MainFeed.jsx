import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

const MALLS = ['Leesburg', 'Tysons', 'Potomac']

export default function MainFeed() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeMall, setActiveMall] = useState('Leesburg')
  const [activeSort, setActiveSort] = useState('Latest')

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    setLoading(true)
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30)
    if (error) console.error(error)
    else setPosts(data || [])
    setLoading(false)
  }

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', fontFamily: 'Noto Sans KR, sans-serif', color: '#e4e1e9', paddingBottom: 120 }}>

      <header style={{ position: 'fixed', top: 0, width: '100%', zIndex: 50, background: 'rgba(19,19,24,0.9)', backdropFilter: 'blur(12px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px', height: 64, borderBottom: '1px solid #1e1e24', boxShadow: '0 0 8px rgba(0,255,157,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: '#00e38b', letterSpacing: '-0.5px', margin: 0 }}>SHOPSPY 🕵️</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#1f1f25', padding: '4px 12px', borderRadius: 20, border: '1px solid rgba(86,255,168,0.2)', cursor: 'pointer' }} onClick={() => navigate('/wallet')}>
          <span style={{ fontSize: 14 }}>💰</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#00ff9d' }}>$12.40</span>
        </div>
      </header>

      <main style={{ paddingTop: 80, padding: '80px 16px 0' }}>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '8px 0', marginBottom: 16 }}>
          {MALLS.map(mall => (
            <button key={mall} onClick={() => setActiveMall(mall)}
              style={{ flexShrink: 0, padding: '8px 24px', borderRadius: 8, border: activeMall === mall ? '1px solid #00ff9d' : '1px solid #1e1e24', background: activeMall === mall ? '#00ff9d' : '#1b1b20', color: activeMall === mall ? '#000' : '#888', fontWeight: 700, fontSize: 10, cursor: 'pointer' }}>
              {mall}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e1e24', paddingBottom: 8, marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 16 }}>
            {['Latest', 'Discount%', 'Votes'].map(sort => (
              <button key={sort} onClick={() => setActiveSort(sort)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 700, color: activeSort === sort ? '#00ff9d' : '#888', borderBottom: activeSort === sort ? '2px solid #00ff9d' : 'none', paddingBottom: 4 }}>
                {sort}
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: 'rgba(255,171,61,0.1)', border: '1px solid rgba(255,171,61,0.3)', borderRadius: 8, padding: 12, display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: 16 }}>⚠️</span>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#ffab3d', letterSpacing: 1, textTransform: 'uppercase' }}>Warning</div>
            <div style={{ fontSize: 12, color: '#e4e1e9' }}>Coach · 23hrs · Promotion may have changed</div>
          </div>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: 40, color: '#555' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🕵️</div>
            <div>Loading intel...</div>
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: '#555' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🕵️</div>
            <div>No deals reported yet!</div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!loading && posts.map(post => (
            <div key={post.id} style={{ background: 'rgba(26,26,31,0.8)', borderRadius: 12, border: '1px solid #1e1e24', overflow: 'hidden' }}>
              <div style={{ position: 'relative', height: 180, background: '#1a1a1f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {post.image_url
                  ? <img src={post.image_url} alt="deal" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                  : <span style={{ fontSize: 40 }}>🏪</span>
                }
                <div style={{ position: 'absolute', top: 12, right: 12, background: '#ffab3d', color: '#000', padding: '4px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
                  {post.discount_rate}
                </div>
              </div>
              <div style={{ padding: 16 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>{post.mall_name}</h2>
                <div style={{ fontSize: 12, color: '#9dcaff', marginBottom: 4 }}>📍 {post.brand_name}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#00e38b' }}>👍 {post.valid_votes || 0}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#ff6b6b' }}>👎 {post.expired_votes || 0}</span>
                    <span style={{ fontSize: 10, color: '#888' }}>💬 0</span>
                  </div>
                  <button style={{ background: '#2a292f', border: 'none', borderRadius: '50%', padding: 8, cursor: 'pointer', fontSize: 14 }}>📤</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <div style={{ position: 'fixed', bottom: 88, left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 32px)', maxWidth: 448, zIndex: 40 }}>
        <button onClick={() => navigate('/report')} style={{ width: '100%', height: 56, background: '#00ff9d', color: '#000', fontSize: 16, fontWeight: 700, borderRadius: 12, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, boxShadow: '0 8px 32px rgba(0,255,157,0.3)' }}>
          📸 Report a Deal & Earn 10¢
        </button>
      </div>

      <nav style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', height: 72, zIndex: 50, display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '0 16px', background: 'rgba(13,13,20,0.95)', backdropFilter: 'blur(12px)', borderTop: '1px solid #1e1e24', borderRadius: '12px 12px 0 0' }}>
        {[
          { icon: '📡', label: 'INTEL', path: '/', active: true },
          { icon: '🔔', label: 'ALERTS', path: '/notifications', active: false },
          { icon: '➕', label: 'POST', path: '/report', active: false },
          { icon: '👤', label: 'PROFILE', path: '/profile', active: false },
        ].map(tab => (
          <div key={tab.label} onClick={() => navigate(tab.path)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, cursor: 'pointer', opacity: tab.active ? 1 : 0.4 }}>
            <span style={{ fontSize: 20 }}>{tab.icon}</span>
            <span style={{ fontSize: 8, fontWeight: 700, color: tab.active ? '#00ff9d' : '#888' }}>{tab.label}</span>
          </div>
        ))}
      </nav>

    </div>
  )
}