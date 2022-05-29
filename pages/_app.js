import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import UserProvider from '../context/user'
import '../styles/globals.css'
import { useRouter } from 'next/router'


function MyApp({ Component, pageProps }) {

  const router = useRouter()
  const [user, setUser] = useState(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async () => {
        checkUser()
      }
    )
    checkUser()
    return () => {
      authListener?.unsubscribe()
    };
  }, [])

  async function checkUser() {
    const user = supabase.auth.user()
    setUser(user)
    if(user) alert("Welcome!")
    else alert("Signed out")
  }

  function logout() {
    supabase.auth.signOut()
  }

  return (
    <UserProvider>
      <div>
        <nav className="p-6 border-b border-gray-300">
          <Link href="/main-page">
            <span className="button">Home</span>
          </Link>
          {
            user && (
              <div style={{display: 'inline'}}>
                <Link href="/create-post">
                  <span className="button">Create Post</span>
                 </Link>
                <Link href="/profile">
                  <span className="button">Profile</span>
                </Link>
                <Link href="/settings">
                  <span className="button">Settings</span>
                </Link>
                <Link href="/main-page">
                  <span className="button" onClick={logout}>Log Out</span>
                </Link>
              </div>
            )
          } 
          {
            !user && (
              <div style={{display: 'inline'}}>
                <Link href="/login">
                  <span className="button">Sign In</span>
                </Link>
                <Link href="/login">
                  <span className="button">Sign Up</span>
                </Link>
              </div>
            ) 
          }

        </nav>
        <div className="py-8 px-16">
          <Component {...pageProps} />
        </div>
      </div>
    </UserProvider>
  )
}

export default MyApp