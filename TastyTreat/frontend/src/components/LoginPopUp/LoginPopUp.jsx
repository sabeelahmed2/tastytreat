/* eslint-disable react/prop-types */
import { useContext, useState } from 'react'
import './LoginPopUp.css'
import {assets} from '../../assets/assets.js'
import { StoreContext } from '../../context/StoreContext.jsx'
import axios from 'axios'

const LoginPopUp = ({setShowLogin, setShowForgotPassword}) => {

    const {url, setToken} = useContext(StoreContext)

    const [currState, setCurrState] = useState("Login")

    const [data, setData] = useState({
        name:"",
        email: "",
        password: "",
    })

    const [errorMessage, setErrorMessage] = useState("")

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData(data=>({...data, [name]: value}))
        setErrorMessage("")
    }

    const onLogin = async (event) => {
        event.preventDefault()
        let newUrl = url;
        if (currState==="Login") {
            newUrl += "/api/user/login"
        }
        else {
            newUrl += "/api/user/register"
        }

        try {
            const response = await axios.post(newUrl, data)
            console.log("Login response:", response.data)

            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token)
                setShowLogin(false)
                setErrorMessage("")
            }
            else {
                console.log("Setting error message:", response.data.message)
                setErrorMessage(response.data.message)
            }
        } catch (error) {
            console.error("Login API error:", error)
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message)
            } else {
                setErrorMessage("Login failed. Please try again.")
            }
        }
    }

  return (
    <div className='login-popup'>
        <form onSubmit={onLogin} className='login-popup-container'>
            <div className='login-popup-title'>
                <h2>{currState}</h2>
                <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt=''/>
            </div>
            <div className='login-popup-inputs'>
                {currState==="Login"?<></>:<input name='name' onChange={onChangeHandler} value={data.name} type='text' placeholder='Your  name' required/>}
                <input name='email' onChange={onChangeHandler} value={data.email} type='email' placeholder='Your email' required/>
                <input name='password' onChange={onChangeHandler} value={data.password} type='password' placeholder='Password' required/>
            </div>
            {errorMessage && <p className="error-message" style={{color: 'red', marginTop: '10px'}}>{errorMessage}</p>}
            <button type='submit'>{currState==="Sign Up"?"Create account":"Login"}</button>
            {currState === "Login" && (
                <p className="forgot-password-link">
                    <span onClick={() => {
                        setShowLogin(false);
                        setShowForgotPassword(true);
                    }}>Forgot password?</span>
                </p>
            )}
            <div className='login-popup-condition'>
                <input type='checkbox' required/>
                <p>By continuing, I agree to the terms of use and privacy policy.</p>
            </div>
            {currState==="Login"
            ?<p>Create a new account? <span onClick={()=>setCurrState("Sign Up")}>Click here</span></p>
            :<p>Already have an account? <span onClick={()=>setCurrState("Login")}>Login here</span></p>}
        </form>
    </div>
  )
}

export default LoginPopUp
