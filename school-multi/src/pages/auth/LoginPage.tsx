import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import GoogleAuthButton from '../../components/auth/GoogleAuthButton'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()

  const handleStaffLogin = (): void => {
    navigate('/auth/super-admin')
  }

  return (
    <div className="auth-landing">
      <div className="auth-landing__card">
        <div className="auth-landing__illustration">
          <div className="machine">
            <div className="machine__body">
              <div className="machine__eye" />
              <div className="machine__window" />
              <div className="machine__belt machine__belt--in">
                <span />
                <span />
                <span />
              </div>
              <div className="machine__belt machine__belt--out">
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className="machine__shapes">
              <div className="shape shape--circle" />
              <div className="shape shape--triangle" />
              <div className="shape shape--square" />
            </div>
          </div>
        </div>

        <div className="auth-landing__panel">
          <div className="auth-landing__top">
            <span>Don&apos;t have an account?</span>
            <a className="link" href="#">
              Sign up
            </a>
          </div>

          <div className="auth-landing__content">
            <span className="auth-landing__badge">👋 Welcome back</span>
            <h1>Sign in</h1>
            <p>Access your school portal and manage your classes seamlessly.</p>

            <div className="auth-landing__providers">
              <GoogleAuthButton fullWidth />
              <button type="button" disabled>
                <span>🍎</span> Apple ID
              </button>
            </div>

            <div className="auth-landing__divider">
              <span>or continue with email address</span>
            </div>

            <div className="auth-landing__fields">
              <button type="button" className="field" onClick={handleStaffLogin}>
                <span className="icon">✉️</span>
                <div>
                  <label>School email</label>
                  <p>Staff &amp; admin login</p>
                </div>
              </button>

              <button type="button" className="field" onClick={handleStaffLogin}>
                <span className="icon">🔒</span>
                <div>
                  <label>Password</label>
                  <p>Use your school credentials</p>
                </div>
              </button>
            </div>

            <button type="button" className="auth-landing__submit" onClick={handleStaffLogin}>
              Continue to staff login
            </button>

            <div className="auth-landing__super">
              <p>Need full platform access?</p>
              <Link to="/auth/super-admin">Login as Super Administrator →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage