import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import MainPage from './main-page'
// import Auth from '../components/auth'
// import Account from '../components/account'

export default function Home() {
    const [session, setSession] = useState(null)

    useEffect(() => {
      setSession(supabase.auth.session())

      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })
    }, [])

    return (
      <div className="container" style={{ padding: '50px 0 100px 0' }}>
        <MainPage />
        {/* {!session ? <Auth /> : <Account key={session.user.id} session={session} />} */}
        {/* {!session ? <Auth /> : <UserHome key={session.user.id} session={session} />} */}
      </div>
    )
}