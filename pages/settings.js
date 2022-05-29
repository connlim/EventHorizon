import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import Avatar from '../components/avatar'
import UserProvider from '../context/user'

export default function Account({ session }) {
    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState(null)
    const [website, setWebsite] = useState(null)
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
            .select(`username, website, avatar_url`)
            .eq('id', user.id)
            .single()

        if (error && status !== 406) {
            throw error
        }

        if (data) {
            setUsername(data.username)
            setWebsite(data.website)
            setAvatarUrl(data.avatar_url)
        }
        } catch (error) {
        alert(error.message)
        } finally {
        setLoading(false)
        }
    }

    async function updateProfile({ username, website, avatar_url }) {
        try {
        setLoading(true)
        const user = supabase.auth.user()

        const updates = {
            id: user.id,
            username,
            website,
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
                        updateProfile({ username, website, avatar_url: url })
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
                    <label htmlFor="website">Website</label>
                    <input
                    id="website"
                    type="website"
                    value={website || ''}
                    onChange={(e) => setWebsite(e.target.value)}
                    />
                </div>

                <div>
                    <button
                        className="button block primary"
                        onClick={() => updateProfile({ username, website, avatar_url })}
                        disabled={loading}
                    >
                    {loading ? 'Loading ...' : 'Update'}
                    </button>
                </div>

            </div>
        </div>
        
    )
}
