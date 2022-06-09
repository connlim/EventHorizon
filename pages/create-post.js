// pages/create-post.js
import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../utils/supabaseClient'
import Media from '../components/media'

const initialState = { username: '', content: '', lat: 0.000000, lon: 0.000000, media: null }

function CreatePost() {

  const router = useRouter()
  const [post, setPost] = useState(initialState)
  const [media_url, setMediaUrl] = useState(null)
  let { username, content, lat, lon, media } = post


  function onChange(e) {
    setPost(() => ({ ...post, [e.target.name]: e.target.value,}))
  }

  
  async function createNewPost() {
    if (!content) {
      alert("Please include some content!")
      return
    }
    
    const user = supabase.auth.user()

    const { data: userInfo} = await supabase
      .from('profiles')
      .select(`username`)
      .single()

    if(!userInfo) {
      alert("Please set up your account first!")
      router.push("/settings")
      return;
    }
    username = userInfo.username

    if(!navigator) { 
      alert("No navigator service available")
      return
    } else {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { data, error, status } = await supabase
        .from('posts')
        .insert([
            { text: content, 
              username: username,
              user_id: user.id,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              media: media_url
            }
        ])
        .single()

        console.log(post)
        if(status == 201 && !error) {
          alert("Posted successfully!")
          router.push("/main-page")
        } else {
          alert(error)
        }
      })
    }

  }

  return (
    <div>
        <div style={{display: 'flex', marginTop: '2rem'}}>
          <div 
            style={{
              display:'flex',
              justifyContent: 'space-evenly',
              marginLeft: 'auto',
              marginRIght: '2rem'}}>
            <Media
              url={media_url}
              size={640}
              onUpload={(url) => {
                  setMediaUrl(url)
                  setPost(() => ({ ...post, media: url,}))
              }}
            /> 
          </div>

          <textarea
              onChange={onChange}
              name="content"
              placeholder="Your content"
              value={post.content}
              style={{
                border: '1px solid white',
                display: 'block',
                marginLeft: '12px',
                marginRight: 'auto',
                backgroundColor: 'black',
                height: '688px',
                width: '640px'
              }}
          /> 
        </div>
        
        <button
            type="button"
            className="mb-4 bg-green-600 text-white font-semibold px-8 py-2 rounded-lg"
            onClick={createNewPost}
            style={{
              border: '1px solid green',
              display: 'block',
              margin: '2rem auto 2rem auto',
              backgroundColor: 'green',
              width: '1292px',
              fontWeight: 'bold',
              fontSize: 'large'
            }}
        >Post it!</button>
    </div>
  )
}

export default CreatePost