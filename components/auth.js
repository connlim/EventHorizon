import { useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import { useRouter } from 'next/router'

export default function Auth() {

  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (email, password) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signIn({ email, password })
      if (error) throw error
      router.push('/main-page')
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
      // alert('Check your email for the login link!')
      alert("Sign up successful! Please Set up your account")
      router.push('/settings')
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="row flex flex-center">
      <div className="col-6 form-widget">
        <h1 className="header">Event Horizon</h1>
        <p className="description">Sign in or Sign up with your email below</p>
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
            style={{marginTop: '3%'}}
          />
        </div>
        <div>
          <button
            onClick={(e) => {
              e.preventDefault()
              handleLogin(email, password)
            }}
            className="button primary"
            disabled={loading}
            style={{width: '45%', marginRight:'5%', marginTop: '3%'}}
          >
            <span>{loading ? 'Loading' : 'Sign In'}</span>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault()
              handleSignUp(email, password)
            }}
            className="button primary"
            disabled={loading}
            style={{width: '45%', marginLeft:'5%'}}
          >
            <span>{loading ? 'Loading' : 'Sign Up'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}