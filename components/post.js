import styles from "../styles/Post.module.css"

export default function Post({ idx, data }) {
    
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

    return (
        <div key={idx} className={styles.container}>
            <div className={styles.media}>
                <p>Insert Photo Here!</p>
            </div>
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