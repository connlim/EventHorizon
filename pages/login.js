import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import Auth from '../components/auth'

export default function Login() {
    const [session, setSession] = useState(null)

    useEffect(() => {
      setSession(supabase.auth.session())

      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })
    }, [])

    return (
        
      <div className="container" style={{ padding: '50px 0 100px 0' }}>
          <Auth />
      </div>
    )
}