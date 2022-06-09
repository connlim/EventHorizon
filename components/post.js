import styles from "../styles/Post.module.css"
import { supabase } from '../utils/supabaseClient'
import { useState, useEffect } from "react"

export default function Post({ idx, data }) {

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

    return (
        <div key={idx} className={styles.container}>
            {data.media ? (<img
                src={mediaUrl}
                alt="Media"
                className={styles.media}
            />) : <div className={styles.media}>Insert media here!</div>}
            <div className={styles.postDetails}>
                <header className={styles.header}>
                    <div className={styles.userName}>{data.username}</div>
                    <div className={styles.stamp}>{data.latitude}, {data.longitude}</div>
                    <div className={styles.stamp}>{date} {time}</div>
                </header>
                    {truncatedContent}
                <div className={styles.footer}>
                    <button className={styles.vote} style={{border: "1px solid orange"}}>-{data.downvotes}</button>
                    <p className={styles.score}>Score: {data.score}</p>
                    <button className={styles.vote} style={{border: "1px solid green"}}>+{data.upvotes}</button>
                </div>
            </div>
        </div>

    )
}