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

  function getLongAndLat() {
    
  }

  async function getAllPost() {
    try {
      setLoading(true)
      const user = supabase.auth.user()
      if(user!=null) setEmail(user.email)

      const maxRadius = 0.1 //meters
      let position = await new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject))
      let { coords } = position
      const myLat = coords.latitude
      const myLon = coords.longitude


      // let { data, error, status } = await supabase
      //   .from('posts')
      //   .select(`*`)
      //   .lte('latitude', myLat + maxDiffLat)
      //   .gte('latitude', myLat - maxDiffLat)
      //   .lte('longitude', myLon + maxDiffLon)
      //   .gte('longitude', myLon - maxDiffLon)
      //   .order('createdAt', { ascending: false })

      let { data, error, status } = await supabase
        .rpc("get_position_within_radius_query", {myLat:myLat, myLon:myLon, r:maxRadius})

      if (error && status !== 406) {
        throw error
      }

      setPosts(data)


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
        {posts?.map((entry,idx) => (<Post data={entry} idx={idx}/>))}
    </div>
  )
}