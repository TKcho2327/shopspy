import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { isDuplicate, canReport, addReward } from '../lib/rewardSystem'

const MALLS = ['Leesburg Premium Outlets', 'Tysons Corner Center', 'Potomac Mills']
const STORES = [
  { name: 'Nike Factory Store', status: 'ACTIVE' },
  { name: 'Kate Spade', status: 'opens in 11hrs' },
  { name: 'Coach Outlet', status: '' },
]

export default function ReportUpload() {
  const navigate = useNavigate()
  const [mall, setMall] = useState('Leesburg Premium Outlets')
  const [mallOpen, setMallOpen] = useState(false)
  const [selectedStores, setSelectedStores] = useState(['Nike Factory Store'])
  const [image, setImage] = useState(null)
  const [discount, setDiscount] = useState('')
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const toggleStore = (name) => {
    setSelectedStores(prev =>
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    )
  }

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {}
    )
  }

  useState(() => { getLocation() }, [])

  const handleSubmit = async () => {
    if (selectedStores.length === 0 || !discount) {
      setMessage('스토어와 할인 정보를 입력해주세요')
      return
    }
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      const dup = await isDuplicate(mall, selectedStores.join(', '))
      if (dup) {
        setMessage('⚠️ 이미 24시간 이내에 제보된 매장이에요!')
        setLoading(false)
        return
      }

      if (user) {
        const ok = await canReport(user.id)
        if (!ok) {
          setMessage('⚠️ 오늘 최대 10건 제보를 완료했어요!')
          setLoading(false)
          return
        }
      }

      let image_url = null
      if (image) {
        const fileExt = image.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('deal-images')
          .upload(fileName, image)
        if (!uploadError) {
          const { data } = supabase.storage
            .from('deal-images')
            .getPublicUrl(fileName)
          image_url = data.publicUrl
        }
      }

      const { error } = await supabase.from('posts').insert({
        mall_name: mall,
        brand_name: selectedStores.join(', '),
        discount_rate: discount,
        image_url,
        agent_id: user?.id || null,
      })

      if (error) throw error

      if (user) {
        await addReward(user.id)
        setMessage('✅ 제보 완료! +$0.10 적립됐어요 🎉')
      } else {
        setMessage('✅ Deal reported!')
      }

    } catch (err) {
      setMessage('❌ 오류: ' + err.message)
    }
    setLoading(false)
  }

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', fontFamily: 'Noto Sans KR, sans-serif', color: '#e4e1e9', paddingBottom: 40 }}>

      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid #1e1e24' }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#e4e1e9', fontSize: 20, cursor: 'pointer' }}>←</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>🕵️</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Report a Deal</span>
        </div>
        <div style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #00ff9d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🛡️</div>
      </header>

      <div style={{ padding: '16px' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,255,157,0.1)', border: '1px solid rgba(0,255,157,0.3)', borderRadius: 8, padding: '8px 12px', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12 }}>📍</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#00ff9d' }}>
              {location ? `GPS Verified · Leesburg Outlets (3m)` : 'Getting GPS...'}
            </span>
          </div>
          <span style={{ fontSize: 11, color: '#00ff9d', fontWeight: 700 }}>0</span>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 10, fontWeight: 700, color: '#555', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Mall Location</label>
          <div onClick={() => setMallOpen(!mallOpen)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#1a1a1f', borderRadius: 10, border: '1px solid #2a2a30', cursor: 'pointer' }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{mall}</span>
            <span style={{ color: '#555', fontSize: 18 }}>{mallOpen ? '∧' : '∨'}</span>
          </div>
          {mallOpen && (
            <div style={{ background: '#1a1a1f', borderRadius: 10, border: '1px solid #2a2a30', marginTop: 4, overflow: 'hidden' }}>
              {MALLS.map(m => (
                <div key={m} onClick={() => { setMall(m); setMallOpen(false) }}
                  style={{ padding: '12px 16px', cursor: 'pointer', color: m === mall ? '#00ff9d' : '#e4e1e9', fontSize: 14, borderBottom: '1px solid #2a2a30' }}>
                  {m}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 10, fontWeight: 700, color: '#555', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Target Store</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {STORES.map(store => {
              const selected = selectedStores.includes(store.name)
              return (
                <div key={store.name} onClick={() => toggleStore(store.name)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: selected ? 'rgba(0,255,157,0.08)' : '#1a1a1f', borderRadius: 10, border: `1px solid ${selected ? 'rgba(0,255,157,0.4)' : '#2a2a30'}`, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${selected ? '#00ff9d' : '#555'}`, background: selected ? '#00ff9d' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#000' }}>
                      {selected && '✓'}
                    </div>
                    <span style={{ fontSize: 14, color: selected ? '#fff' : '#aaa', fontWeight: selected ? 700 : 400 }}>{store.name}</span>
                  </div>
                  {store.status === 'ACTIVE' && (
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#00ff9d', background: 'rgba(0,255,157,0.1)', padding: '3px 8px', borderRadius: 4 }}>ACTIVE</span>
                  )}
                  {store.status && store.status !== 'ACTIVE' && (
                    <span style={{ fontSize: 10, color: '#888' }}>{store.status}</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 10, fontWeight: 700, color: '#555', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Visual Intel</label>
          <div style={{ position: 'relative', border: '1px dashed #2a2a30', borderRadius: 12, padding: '32px 16px', textAlign: 'center', background: '#1a1a1f', cursor: 'pointer' }}>
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
            {image ? (
              <div>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
                <div style={{ fontSize: 12, color: '#00ff9d' }}>{image.name}</div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
                <div style={{ fontSize: 14, color: '#555', fontWeight: 600 }}>Tap to take photo</div>
                <div style={{ fontSize: 11, color: '#333', marginTop: 4 }}>JPG · PNG · Max 10MB</div>
              </div>
            )}
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 10, fontWeight: 700, color: '#555', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Discount Details</label>
          <div style={{ position: 'relative' }}>
            <input
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="e.g. 50% Off clearance wall"
              style={{ width: '100%', padding: '12px 40px 12px 14px', borderRadius: 10, border: '1px solid #2a2a30', background: '#1a1a1f', color: '#e4e1e9', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
            <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🎙️</span>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: '100%', height: 52, background: loading ? '#1a1a1f' : '#00ff9d', color: '#000', fontSize: 15, fontWeight: 700, borderRadius: 12, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 8px 32px rgba(0,255,157,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {loading ? '⏳ Submitting...' : '⚡ Submit & Earn 10¢'}
        </button>

        {message && (
          <p style={{ marginTop: 16, textAlign: 'center', fontSize: 14, color: message.includes('✅') ? '#00ff9d' : '#ffab3d', fontWeight: 700 }}>{message}</p>
        )}

      </div>
    </div>
  )
}