import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'

export default function Media({ url, size, onUpload }) {
  const [mediaUrl, setMediaUrl] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (url) downloadImage(url)
  }, [url])

  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage.from('media').download(path)
      if (error) {
        throw error
      }
      console.log(data)
      const url = URL.createObjectURL(data)
      setMediaUrl(url)
    } catch (error) {
      console.log('Error downloading image: ', error.message)
    }
  }


  async function uploadMedia(event) {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      let { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      onUpload(filePath)
    } catch (error) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{display:'block'}}>
      {mediaUrl ? (
        <img
          src={mediaUrl}
          alt="Media"
          className="avatar image"
          style={{ height: '640px', width: '640px' }}
        />
      ) : (
        <div className="avatar no-image" style={{ height: 640, width: 640 }} />
      )}
      <div style={{ width: size, margin: '2px auto 0px auto' }}>
        <label className="button primary block" htmlFor="single">
          {uploading ? 'Uploading ...' : 'Upload'}
        </label>
        <input
          style={{
            visibility: 'hidden',
            position: 'absolute',
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadMedia}
          disabled={uploading}
        />
      </div>
    </div>
  )
}