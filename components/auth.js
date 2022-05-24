import { useState } from 'react'
import { supabase } from '../utils/supabaseClient'

export default function Auth() {

  
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (email, password) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signIn({ email, password })
      if (error) throw error
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (email, password) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      alert('Check your email for the login link!')
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="row flex flex-center">
      <div className="col-6 form-widget">
        <h1 className="header">Supabase + Next.js</h1>
        <p className="description">Sign in via magic link with your email below</p>
        <div>
          <input
            className="inputField"
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        <input
            className="inputField"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button
            onClick={(e) => {
              e.preventDefault()
              handleLogin(email, password)
            }}
            className="Sign In block"
            disabled={loading}
          >
            <span>{loading ? 'Loading' : 'Sign In'}</span>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault()
              handleSignUp(email, password)
            }}
            className="Sign Up block"
            disabled={loading}
          >
            <span>{loading ? 'Loading' : 'Sign Up'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}