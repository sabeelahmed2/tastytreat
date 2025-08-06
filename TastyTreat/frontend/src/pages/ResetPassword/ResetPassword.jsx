import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './ResetPassword.css'
import axios from 'axios'
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext.jsx'

const ResetPassword = () => {
    const { token } = useParams()
    const navigate = useNavigate()
    const { url } = useContext(StoreContext)
    
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [validToken, setValidToken] = useState(true)

    useEffect(() => {
        // Validate token on component mount
        const validateToken = async () => {
            try {
                console.log('Token from URL:', token);
                const response = await axios.post(`${url}/api/user/validate-reset-token`, { token })
                console.log('Validation response:', response.data);
                if (!response.data.valid) {
                    setValidToken(false)
                    setError('Invalid or expired reset link')
                }
            } catch (error) {
                setValidToken(false)
                setError('Invalid or expired reset link')
            }
        }
        
        if (token) {
            validateToken()
        }
    }, [token, url])

    const handleResetPassword = async (e) => {
        e.preventDefault()
        setError('')
        setMessage('')

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        setLoading(true)

        try {
            const response = await axios.post(`${url}/api/user/reset-password`, {
                token,
                newPassword
            })

            if (response.data.success) {
                setMessage('Password reset successful! Redirecting to login...')
                setTimeout(() => {
                    navigate('/')
                }, 2000)
            } else {
                setError(response.data.message || 'Failed to reset password')
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to reset password')
        } finally {
            setLoading(false)
        }
    }

    if (!validToken) {
        return (
            <div className="reset-password-container">
                <div className="reset-password-form">
                    <h2>Invalid Reset Link</h2>
                    <p>{error}</p>
                    <button onClick={() => navigate('/')} className="back-button">
                        Back to Home
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="reset-password-container">
            <form onSubmit={handleResetPassword} className="reset-password-form">
                <h2>Reset Password</h2>
                <div className="reset-password-inputs">
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>
        </div>
    )
}

export default ResetPassword
