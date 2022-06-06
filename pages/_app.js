import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import UserProvider from '../context/user'
import '../styles/globals.css'
import { useRouter } from 'next/router'


function MyApp({ Component, pageProps }) {

  const router = useRouter()
  const [user, setUser] = useState(null);

  const initialPos = {lat: '0.000000', lon: '0.000000' }
  const [currPos, setCurrPos] = useState(initialPos) 

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async () => {
        checkUser()
      }
    )

    checkUser()

    if(!navigator.geolocation) {
      alert("Your browser does not support geolocation, which is an essential feature of Event Horizon. To continue, \
        please use a different browser!")
      return (<div>
        <p>Error!</p>
      </div>)
    }

    const watchID = navigator.geolocation.watchPosition((position) => {
      setCurrPos({ ...currPos, lat:position.coords.latitude, lon:position.coords.longitude, });
      console.log(position)
    })
  
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
        <nav className="p-6 border-b border-gray-300" style={{alignItems: "center", display: "flex", justifyContent: "space-between"}}>
          <span>
            <Link href="/main-page">
              <span className="button">Home</span>
            </Link>
            {
              user && (
                <span>
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
          <span style={{display: "inline-block"}}>
              Lat:{currPos.lat} Lon:{currPos.lon}
          </span>
        </nav>
        <div className="py-8 px-16">
          <Component {...pageProps} />
        </div>
      </div>
    </UserProvider>
  )
}

export default MyApp