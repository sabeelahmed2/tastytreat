import { assets } from '../../assets/assets'
import './AppDownload.css'

const AppDownload = () => {
  return (
    <div className='app-download' id='app-download'>
        <p>For Better Experience Download <br/>Tasty Treat App</p>
        <div className='app-download-platforms'>
            <a href="https://play.google.com/store/games?hl=en_IN" target="_blank" rel="noopener noreferrer">
                <img src={assets.play_store} alt="Google Play Store" />
            </a>
            <a href="https://www.apple.com/in/app-store/" target="_blank" rel="noopener noreferrer">
                <img src={assets.app_store} alt="Apple App Store" />
            </a>
        </div>
    </div>
  )
}

export default AppDownload