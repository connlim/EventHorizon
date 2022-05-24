import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import { useUser, UserProvider } from '../context/user'


export default function Profile() {

    const { user } = useUser()

    const [userEmail, setEmail]= useState("null")

    useEffect(()=>{if(user!=null) setEmail(user.email)}, []);


    return (
      <div className="container" style={{ padding: '50px 0 100px 0' }}>
          <p>Signed in: {userEmail}</p>
      </div>
    )
}