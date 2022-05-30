// pages/create-post.js
import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../utils/supabaseClient'

const initialState = { username: '', content: '', lat: '0.000000', lon: '0.000000' }

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

    var latFloat = parseFloat(lat)
    var lonFloat = parseFloat(lon)

    const { data, error, status } = await supabase
        .from('posts')
        .insert([
            { text: content, 
              username: username,
              user_id: user.id,
              latitude: latFloat,
              longitude: lonFloat
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
  }
  return (
    <div>
        <h1 className="text-3xl font-semibold tracking-wide mt-6">Create new post</h1>
        <input
            onChange={onChange}
            name="content"
            placeholder="Your content"
            value={post.content}
            className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
        /> 
        <input
            onChange={onChange}
            name="lat"
            placeholder="Your latitude"
            value={post.lat}
            className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
        /> 
        <input
            onChange={onChange}
            name="lon"
            placeholder="Your longitude"
            value={post.lon}
            className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
        /> 

        <button
            type="button"
            className="mb-4 bg-green-600 text-white font-semibold px-8 py-2 rounded-lg"
            onClick={createNewPost}
        >Create Post</button>
    </div>
  )
}

export default CreatePost