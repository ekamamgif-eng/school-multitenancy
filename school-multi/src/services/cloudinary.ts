import { CloudinaryUploadResult } from '../types'

export const uploadToCloudinary = async (file: File): Promise<CloudinaryUploadResult> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  // Validation
  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary environment variables not set')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  formData.append('cloud_name', cloudName)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Upload failed: ${error}`)
  }

  return response.json()
}

export const validateFile = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
  const maxSize = 10 * 1024 * 1024 // 10MB

  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload JPG, PNG, or PDF.')
  }

  if (file.size > maxSize) {
    throw new Error('File too large. Maximum size is 10MB.')
  }

  return true
}