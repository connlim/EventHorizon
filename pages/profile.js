import { useState, useEffect } from 'react'
import { useUser } from '../context/user'
import { supabase } from '../utils/supabaseClient'
import Post from '../components/post'


export default function Profile() {

  const [username, setUsername] = useState(null)
  const [bio, setBio] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)

  async function getProfile() {
      try {
      setLoading(true)
      const user = supabase.auth.user()
      if(user!=null) setEmail(user.email)

      let { data, error, status } = await supabase
          .from('profiles')
          .select(`username, bio, avatar_url`)
          .eq('id', user.id)
          .single()

      if (error && status !== 406) {
          throw error
      }

      if (data) {
          setUsername(data.username)
          setBio(data.bio)
          setAvatarUrl(data.avatar_url)
      }
      } catch (error) {
      alert(error.message)
      } finally {
      setLoading(false)
      }
  }

  const { user } = useUser(true)

  const [userEmail, setEmail] = useState("null")
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState(null)

  useEffect(()=>{
    if(user!=null) setEmail(user.email)
    else setEmail("null")
    getAllPost()
    getProfile()
  }, []);

  async function getAllPost() {
    try {
      setLoading(true)
      const user = supabase.auth.user()
      if(user!=null) setEmail(user.email)

      let { data, error, status } = await supabase
        .from('posts')
        .select(`*`)
        .eq('user_id', user.id)

      setPosts(data)

    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  } 


  return (
    <div className="container" id="root" style={{ padding: '50px 0 100px 0' }}>
        <div>
          <p> User: {username}</p>
          <p> Email: {userEmail}</p>
          <p> Bio: {bio}</p> 
        </div>
        {posts?.map((entry,idx) => (<Post data={entry} idx={idx}/>))}
    </div>
  )
}