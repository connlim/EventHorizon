import { useState, useEffect } from 'react'
import { useUser } from '../context/user'


export default function Profile() {

    const { user } = useUser()

    const [userEmail, setEmail]= useState("null")

    useEffect(()=>{if(user!=null) setEmail(user.email)}, []);

    return (
      <div className="container" style={{ padding: '50px 0 100px 0' }}>
          <div style={{ position: 'static', top: '10px', border: '1px solid white', 
                        width: '1200px', height: '600px', textAlign: 'center'}}>
            <p style={{ position: 'relative', top: '50%', transform: 'translate(0, -50%)', fontSize: 'x-large'}}>User's own post goes here.</p>
          </div>
          <div style={{ position: 'relative', top: '10px', border: '1px solid white', 
                        width: '1200px', height: '600px', textAlign: 'center'}}>
            <p style={{ position: 'relative', top: '50%', transform: 'translate(0, -50%)', fontSize: 'x-large'}}>User's next post goes here.</p>
          </div>
          <button>
            Get Post
          </button>
      </div>
    )
}