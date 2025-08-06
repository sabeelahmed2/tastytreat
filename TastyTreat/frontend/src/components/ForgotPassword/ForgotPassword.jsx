import { useState } from 'react'
import './ForgotPassword.css'
import { assets } from '../../assets/assets.js'
import axios from 'axios'
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext.jsx'

const ForgotPassword = ({ setShowForgotPassword }) => {
    const { url } = useContext(StoreContext)
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleForgotPassword = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setMessage('')

        try {
            const response = await axios.post(`${url}/api/user/forgot-password`, { email })
            if (response.data.success) {
                setMessage(response.data.message || 'Password reset link has been sent to your email.')
                setEmail('')
            } else {
                setError(response.data.message || 'Failed to generate reset link')
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to generate reset link')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="forgot-password-popup">
            <form onSubmit={handleForgotPassword} className="forgot-password-container">
                <div className="forgot-password-title">
                    <h2>Forgot Password</h2>
                    <img onClick={() => setShowForgotPassword(false)} src={assets.cross_icon} alt="Close" />
                </div>
                <div className="forgot-password-inputs">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                {message && <p className="success-message" style={{ color: 'green', marginTop: '10px' }}>{message}</p>}
                {error && <p className="error-message" style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
                <p>
                    Remember your password? <span onClick={() => setShowForgotPassword(false)}>Back to login</span>
                </p>
            </form>
        </div>
    )
}

export default ForgotPassword
