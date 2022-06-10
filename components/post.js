import styles from "../styles/Post.module.css"
import { supabase } from '../utils/supabaseClient'
import { useState, useEffect } from "react"
import Popup from "reactjs-popup"
import Link from "next/link"
import Router from "next/router"
import { useUser } from '../context/user'

export default function Post({ idx, data }) {

    const user = useUser().user.id
    const [mediaUrl, setMediaUrl] = useState(null)

    useEffect(() => {
        if (data.media) downloadImage(data.media)
      }, [])
    
    // Convert timestamp to human readable time
    const timestampDate = new Date(data.createdAt)
    const date = timestampDate.toDateString()
    const time = timestampDate.toLocaleTimeString()

    // Truncate content to MAX_CONTENT_LENGTH
    const MAX_CONTENT_LENGTH = 1200
    let truncatedContent = String(data.text)
    truncatedContent = truncatedContent.length > MAX_CONTENT_LENGTH 
        ? truncatedContent.substring(0, MAX_CONTENT_LENGTH) + "..."
        : truncatedContent

    async function downloadImage(path) {
        try {
            const { data, error } = await supabase.storage.from('media').download(path)
            if (error) {
            throw error
            }
            console.log(data)
            const url = URL.createObjectURL(data)
            setMediaUrl(url)
            console.log(mediaUrl)
        } catch (error) {
            console.log('Error downloading image: ', error.message)
        }
    }

    async function deletePost(postID) {
        alert("Are you sure to delete this post?")
        try {
            let { data, error, status } = await supabase
                .from('posts')
                .delete()
                .match({ id: postID})
                .single()
    
            if (error) {
                throw error
            } 

            const deletedMedia = data.media

            if (data.media) {
                let { error, status } = await supabase
                    .storage
                    .from('media')
                    .remove([`folder/${deletedMedia}`])
                console.log(status)
                if (error) {
                    throw error
                } 
            }

            console.log(data)
            alert("Deleted successfully!")
            Router.reload(window.location.pathname)

        } catch (error) {
            alert(error.message)
        } 
    }

    return (
        <div key={idx} className={styles.container}>

            {   // DIsplay Media for the post
                data.media 
                    ? (<img src={mediaUrl} alt="Media" className={styles.media}/>) 
                    : <div className={styles.media}>Insert media here!</div>
            }

            <div className={styles.postDetails}>
                <div style={{display: "flex", marginBottom: "1rem"}}>
                    <header className={styles.header}>
                        <div className={styles.userName}>{data.username}</div>
                        <div className={styles.stamp}>{data.latitude}, {data.longitude}</div>
                        <div className={styles.stamp}>{date} {time}</div>
                    </header>
                    {   //Enable pop-up menu for the user who created the post 
                        user == data.user_id &&
                        <Popup trigger={<button className={styles.popupMenuButton}>M</button>} 
                            position='bottom center'>
                            <div className={styles.popupMenu}>
                                <Link 
                                    href={{pathname: `/modify-post`, query: {postID: data.id},}}
                                    as={`posts/edit/${data.id}`}>
                                        <button className={styles.popupMenuItem} 
                                            style={{borderRadius: "12px 12px 0px 0px"}}>Edit</button>
                                </Link>
                                <button className={styles.popupMenuItem} 
                                    style={{color: 'red', border: '1px solid white', borderRadius: "0px 0px 12px 12px"}}
                                    onClick={() => deletePost(data.id)}>
                                        Delete
                                </button>
                            </div>
                        </Popup>
                    }
                </div>

                {truncatedContent}

                <div className={styles.footer}>
                    <button className={styles.vote} style={{border: '1px solid orange'}}>-{data.downvotes}</button>
                    <p className={styles.score}>Score: {data.score}</p>
                    <button className={styles.vote} style={{border: '1px solid green'}}>+{data.upvotes}</button>
                </div>
            </div>
        </div>

    )
}