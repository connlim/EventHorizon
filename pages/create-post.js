// pages/create-post.js
import { useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { supabase } from '../utils/supabaseClient'
import { getDomainLocale } from 'next/dist/shared/lib/router/router'

const initialState = { title: '', content: '' }

function CreatePost() {
  const [post, setPost] = useState(initialState)
  const { title, content } = post
  const router = useRouter()
  function onChange(e) {
    setPost(() => ({ ...post, [e.target.name]: e.target.value }))
  }
  async function createNewPost() {
    if (!title || !content) return
    const user = supabase.auth.user()
    console.log(user.id)
    const id = 1
    post.id = id
    const { data, error, status } = await supabase
        .from('posts')
        .insert([
            { title, content, user_id: user.id}
        ])
        .single()
    router.push(`/posts/${data.id}`)
  }
  return (
    <div>
        <h1 className="text-3xl font-semibold tracking-wide mt-6">Create new post</h1>
        <input
            onChange={onChange}
            name="title"
            placeholder="Title"
            value={post.title}
            className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
        /> 
        <input
            onChange={onChange}
            name="content"
            placeholder="Your content"
            value={post.content}
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