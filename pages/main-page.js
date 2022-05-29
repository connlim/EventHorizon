import { useState, useEffect } from 'react'
import { useUser } from '../context/user'


export default function MainPage() {

  const { user } = useUser()

  const [userEmail, setEmail]= useState("null")

  useEffect(()=>{
    if(user!=null) setEmail(user.email)
    else setEmail("null")
  }, []);

  return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
        <div style={{ position: 'absolute', top: '-7px', right: '10px' }}>
          <p>Signed in: {userEmail}</p>
        </div>
        <div style={{ position: 'static', top: '10px', border: '1px solid white', 
                      width: '1200px', height: '600px', textAlign: 'center'}}>
          <p style={{ position: 'relative', top: '50%', transform: 'translate(0, -50%)', fontSize: 'x-large'}}>First post goes here.</p>
        </div>
        <div style={{ position: 'relative', top: '10px', border: '1px solid white', 
                      width: '1200px', height: '600px', textAlign: 'center'}}>
          <p style={{ position: 'relative', top: '50%', transform: 'translate(0, -50%)', fontSize: 'x-large'}}>Next post goes here.</p>
        </div>
        <button
                        className="button block primary"
                        onClick={() => console.log('hi')}
          >button</button>
    </div>
  )
}