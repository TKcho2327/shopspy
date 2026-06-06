import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Login() {
  const navigate = useNavigate()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agentName, setAgentName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleAuth = async () => {
    if (!email || !password) {
      setMessage('이메일과 비밀번호를 입력해주세요')
      return
    }
    setLoading(true)
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { agent_name: agentName || 'Agent_' + Math.random().toString(36).slice(2, 7) } }
        })
        if (error) throw error
        setMessage('✅ 가입 완료! 이메일을 확인해주세요')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        navigate('/')
      }
    } catch (err) {
      setMessage('❌ ' + err.message)
    }
    setLoading(false)
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' })
  }

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', fontFamily: 'Noto Sans KR, sans-serif', color: '#e4e1e9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>

      {/* 로고 */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🕵️</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#00e38b', margin: 0 }}>SHOPSPY</h1>
        <p style={{ fontSize: 13, color: '#555', marginTop: 6 }}>Earn while you shop. Real-time offline deal intel.</p>
      </div>

      <div style={{ width: '100%', maxWidth: 400 }}>

        {/* 구글 로그인 */}
        <button onClick={handleGoogle} style={{ width: '100%', padding: '14px', background: '#1a1a1f', border: '1px solid #2a2a30', borderRadius: 12, color: '#e4e1e9', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>G</span> Continue with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
          <div style={{ flex: 1, height: 1, background: '#2a2a30' }} />
          <span style={{ fontSize: 12, color: '#555' }}>or</span>
          <div style={{ flex: 1, height: 1, background: '#2a2a30' }} />
        </div>

        {/* Agent Name (회원가입시만) */}
        {isSignUp && (
          <div style={{ marginBottom: 12 }}>
            <input
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="Agent Name (예: Agent_Fairfax)"
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #2a2a30', background: '#1a1a1f', color: '#e4e1e9', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        )}

        {/* 이메일 */}
        <div style={{ marginBottom: 12 }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일"
            style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #2a2a30', background: '#1a1a1f', color: '#e4e1e9', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        {/* 비밀번호 */}
        <div style={{ marginBottom: 20 }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #2a2a30', background: '#1a1a1f', color: '#e4e1e9', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        {/* 버튼 */}
        <button onClick={handleAuth} disabled={loading}
          style={{ width: '100%', height: 52, background: '#00ff9d', color: '#000', fontSize: 15, fontWeight: 700, borderRadius: 12, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 8px 32px rgba(0,255,157,0.3)', marginBottom: 16 }}>
          {loading ? '처리 중...' : isSignUp ? '🚀 Start Mission' : '🔓 Sign In'}
        </button>

        {/* 전환 */}
        <p style={{ textAlign: 'center', fontSize: 13, color: '#555', cursor: 'pointer' }}
          onClick={() => { setIsSignUp(!isSignUp); setMessage('') }}>
          {isSignUp ? '이미 계정이 있으신가요? Sign In' : '계정이 없으신가요? Sign Up'}
        </p>

        {message && (
          <p style={{ textAlign: 'center', fontSize: 13, color: message.includes('✅') ? '#00ff9d' : '#ffab3d', marginTop: 12, fontWeight: 700 }}>
            {message}
          </p>
        )}
      </div>
    </div>
  )
}