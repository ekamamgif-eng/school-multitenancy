import React from 'react'
import { uploadToCloudinary } from '../services/cloudinary'

const TestCloudinary = () => {
  const handleTestUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    try {
      console.log('Uploading to Cloudinary...')
      const result = await uploadToCloudinary(file)
      console.log('✅ Upload success:', result)
      console.log('📁 File URL:', result.secure_url)
    } catch (error) {
      console.error('❌ Upload failed:', error)
    }
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>Test Cloudinary Upload</h3>
      <input type="file" onChange={handleTestUpload} />
      <p>Check browser console untuk results</p>
    </div>
  )
}

export default TestCloudinary