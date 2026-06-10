import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Login() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState('')

  const passwordValid = password.length >= 12 && /[A-Z]/.test(password) && /[!@#$%^&*]/.test(password)
  const canSubmit = isSignUp ? (passwordValid && password === confirmPassword && email) : (email && password)

  const handleAuth = async () => {
    setMessage('')
    if (isSignUp) {
      if (!passwordValid) { setMessage('❌ 비밀번호 조건을 확인해주세요.'); return }
      if (password !== confirmPassword) { setMessage('❌ 비밀번호가 일치하지 않아요.'); return }
      const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })
      if (error) setMessage('❌ ' + error.message)
      else setMessage('✅ 가입 완료! 이메일을 확인해주세요.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage('❌ 이메일 또는 비밀번호가 틀렸어요.')
      else setMessage('✅ 로그인 성공!')
    }
  }

  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    if (error) setMessage('❌ ' + error.message)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ fontSize: 60 }}>🕵️</div>
      <h1 style={{ color: '#00ff9d', fontSize: 32, fontWeight: 900, margin: '8px 0 4px' }}>SHOPSPY</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 40 }}>Earn while you shop. Real-time offline deal intel.</p>

      <div style={{ width: '100%', maxWidth: 400 }}>
        <button onClick={handleGoogle} style={{ width: '100%', padding: '16px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: 'pointer', marginBottom: 20 }}>
          G &nbsp; Continue with Google
        </button>

        <div style={{ textAlign: 'center', color: '#444', marginBottom: 20 }}>or</div>

        {isSignUp && (
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ width: '100%', padding: '16px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, marginBottom: 12, boxSizing: 'border-box' }}
          />
        )}

        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', padding: '16px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, marginBottom: 12, boxSizing: 'border-box' }}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', padding: '16px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, marginBottom: 8, boxSizing: 'border-box' }}
        />

        {isSignUp && (
          <>
            <div style={{ marginBottom: 12, paddingLeft: 4 }}>
              <p style={{ fontSize: 12, color: password.length >= 12 ? '#00ff9d' : '#666', margin: '2px 0' }}>
                {password.length >= 12 ? '✅' : '○'} 12자 이상
              </p>
              <p style={{ fontSize: 12, color: /[A-Z]/.test(password) ? '#00ff9d' : '#666', margin: '2px 0' }}>
                {/[A-Z]/.test(password) ? '✅' : '○'} 대문자 포함
              </p>
              <p style={{ fontSize: 12, color: /[!@#$%^&*]/.test(password) ? '#00ff9d' : '#666', margin: '2px 0' }}>
                {/[!@#$%^&*]/.test(password) ? '✅' : '○'} 특수문자 포함 (!@#$%^&*)
              </p>
            </div>
            <input
              type="password"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              style={{ width: '100%', padding: '16px', background: '#1a1a1a', color: '#fff', border: confirmPassword && password !== confirmPassword ? '1px solid #ff4444' : 'none', borderRadius: 12, fontSize: 16, marginBottom: 8, boxSizing: 'border-box' }}
            />
            {confirmPassword && password !== confirmPassword && (
              <p style={{ fontSize: 12, color: '#ff4444', marginBottom: 8, paddingLeft: 4 }}>비밀번호가 일치하지 않아요</p>
            )}
          </>
        )}

        <button
          onClick={handleAuth}
          disabled={!canSubmit}
          style={{ width: '100%', padding: '16px', background: canSubmit ? '#00ff9d' : '#333', color: canSubmit ? '#000' : '#666', border: 'none', borderRadius: 12, fontSize: 18, fontWeight: 700, cursor: canSubmit ? 'pointer' : 'not-allowed', marginTop: 8 }}>
          🚀 {isSignUp ? 'Start Mission' : 'Sign In'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#666', marginTop: 16, cursor: 'pointer' }}
          onClick={() => { setIsSignUp(!isSignUp); setMessage('') }}>
          {isSignUp ? '이미 계정이 있으신가요? Sign In' : '계정이 없으신가요? Sign Up'}
        </p>

        {message && (
          <p style={{ textAlign: 'center', fontSize: 13, color: message.includes('✅') ? '#00ff9d' : '#ff4444', marginTop: 12 }}>
            {message}
          </p>
        )}
      </div>
    </div>
  )
}