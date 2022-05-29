import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import { useUser } from '../context/user'
import Post from '../components/post'


export default function MainPage() {

  const { user } = useUser(true)

  const [userEmail, setEmail] = useState("null")
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState(null)

  useEffect(()=>{
    if(user!=null) setEmail(user.email)
    else setEmail("null")
    getAllPost()
  }, []);

  async function getAllPost() {
    try {
      setLoading(true)
      const user = supabase.auth.user()
      if(user!=null) setEmail(user.email)

      let { data, error, status } = await supabase
        .from('posts')
        .select(`*`)

      setPosts(data)
      // if (error && status !== 406) {
      //   throw error
      // }

      // if (data) {
      //   setUsername(data.username)
      //   setWebsite(data.website)
      //   setAvatarUrl(data.avatar_url)
      // }


    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  } 


  return (
    <div className="container" id="root" style={{ padding: '50px 0 100px 0' }}>
        <div style={{ position: 'absolute', top: '-7px', right: '10px' }}>
          <p>Signed in: {userEmail}</p>
        </div>
        <div style={{ position: 'static', top: '10px', border: '1px solid white', 
                      width: '1200px', height: '600px', textAlign: 'center'}}>
          <p style={{ position: 'relative', top: '50%', transform: 'translate(0, -50%)', fontSize: 'x-large'}}>First post goes here.</p>
        </div>
        {posts?.map((entry,idx) => (<Post data={entry} idx={idx}/>))}
    </div>
  )
}