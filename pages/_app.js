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
  }

  function logout() {
    supabase.auth.signOut()
  }


  return (
    <UserProvider>
      <div>
        <nav className="p-6 border-b border-gray-300" style={{alignItems: "center", display: "flex", justifyContent: "space-between"}}>
          <span>
            <Link href="/main-page">
              <span className="button">Home</span>
            </Link>
            {
              user && (
                <span>
                  <Link href="/modify-post" as="posts/create">
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
                </span>
              )
            } 
            {
              !user && (
                <span>
                  <Link href="/login">
                    <span className="button">Sign In</span>
                  </Link>
                  <Link href="/login">
                    <span className="button">Sign Up</span>
                  </Link>
                </span>
              ) 
            }
          </span>
          <button
            type="button"
            className="mb-4 bg-green-600 text-white font-semibold px-8 py-2 rounded-lg"
            onClick={() => {
              if(!navigator) { alert("No navigator service available") }
              else {
                navigator.geolocation.getCurrentPosition((loc) => {
                  alert("Latitude: " + loc.coords.latitude + ", Longitude: " + loc.coords.longitude)
                })
              }
            }}
          >Show My Position</button>
        </nav>
        <div className="py-8 px-16">
          <Component {...pageProps} />
        </div>
      </div>
    </UserProvider>
  )
}

export default MyApp