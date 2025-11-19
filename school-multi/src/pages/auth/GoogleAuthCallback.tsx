import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const GoogleAuthCallback: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // After Supabase processes the OAuth callback, redirect to home or dashboard
    navigate('/')
  }, [navigate])

  return <div>Processing Google authentication...</div>
}

export default GoogleAuthCallback
