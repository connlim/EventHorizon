import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import Avatar from './avatar'

export default function Account({ session }) {
    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState(null)
    const [bio, setBio] = useState(null)
    const [avatar_url, setAvatarUrl] = useState(null)
    const [userEmail, setEmail]= useState("null")

    console.log(session)

    useEffect(() => {
        getProfile()
    }, [session])

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

    async function updateProfile({ username, bio, avatar_url }) {
        try {
        setLoading(true)
        const user = supabase.auth.user()

        const updates = {
            id: user.id,
            username,
            bio,
            avatar_url,
            updated_at: new Date(),
        }

        let { error } = await supabase.from('profiles').upsert(updates, {
            returning: 'minimal', // Don't return the value after inserting
        })

        if (error) {
            throw error
        }
        } catch (error) {
        alert(error.message)
        } finally {
        setLoading(false)
        }
    }

    return (
        <div className="container" style={{ padding: '50px 0 100px 0' }}>
            <div className="form-widget">
                <div>
                    <Avatar
                    url={avatar_url}
                    size={150}
                    onUpload={(url) => {
                        setAvatarUrl(url)
                        updateProfile({ username, bio, avatar_url: url })
                    }}
                    /> 
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                    <input id="email" type="text" value={userEmail} disabled />
                </div>
                <div>
                    <label htmlFor="username">Name</label>
                    <input
                        id="username"
                        type="text"
                        value={username || ''}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="bio">Bio</label>
                    <textarea
                        id="bio"
                        type="bio"
                        value={bio || ''}
                        onChange={(e) => setBio(e.target.value)}
                        style={{marginBottom: '1%', backgroundColor: 'black', 
                                width: '100%', height: '5rem'}}
                    />
                </div>

                <div>
                    <button
                        className="button block primary"
                        onClick={() => updateProfile({ username, bio, avatar_url })}
                        disabled={loading}
                    >
                    {loading ? 'Loading ...' : 'Update'}
                    </button>
                </div>

            </div>
        </div>
        
    )
}
