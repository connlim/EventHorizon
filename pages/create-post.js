// pages/create-post.js
import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../utils/supabaseClient'

const initialState = { username: '', content: '', lat: 0.000000, lon: 0.000000 }

function CreatePost() {
  const [post, setPost] = useState(initialState)
  let { username, content, lat, lon } = post
  const router = useRouter()


  function onChange(e) {
    setPost(() => ({ ...post, [e.target.name]: e.target.value,}))
  }

  
  async function createNewPost() {
    if (!content) return
    
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
              longitude: position.coords.longitude
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
        <h1 className="text-3xl font-semibold tracking-wide mt-6"
            style={{
              textAlign: "center"
            }}>Create new post</h1>
        <textarea
            onChange={onChange}
            name="content"
            placeholder="Your content"
            value={post.content}
            // className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
            style={{
              border: "1px solid white",
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
              backgroundColor: "black",
              height: "640px",
              width: "1300px"
            }}
        /> 
        <button
            type="button"
            className="mb-4 bg-green-600 text-white font-semibold px-8 py-2 rounded-lg"
            onClick={createNewPost}
            style={{
              border: "1px solid white",
              display: "block",
              marginTop: "2rem",
              marginLeft: "auto",
              marginRight: "auto",
              backgroundColor: "black",
            }}
        >Create Post</button>
        <button
            type="button"
            className="mb-4 bg-green-600 text-white font-semibold px-8 py-2 rounded-lg"
            style={{
              border: "1px solid white",
              display: "block",
              marginTop: "1rem",
              marginLeft: "auto",
              marginRight: "auto",
              backgroundColor: "black",
            }}
            onClick={() => {
              navigator.permissions.query({name: 'geolocation'})
                .then((result) => {
                  if(result.state == 'granted') {
                    navigator.geolocation.getCurrentPosition((position) => {
                      setPost(() => ({ ...post, lat: position.coords.latitude, lon: position.coords.longitude}))
                      console.log(post.lat + ", " + post.lon)
                    }, (error) => console.log("Error due to " + error))
                  } else {
                    console.log('Browser location services disabled', navigator);
                  }
                })
              }
            }
        >Test Location</button>
    </div>
  )
}

export default CreatePost