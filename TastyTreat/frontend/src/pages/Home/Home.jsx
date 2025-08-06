import { useState } from 'react'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu.jsx'
import Header from '../../components/Header/Header.jsx'
import './Home.css'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay.jsx'
import AppDownload from '../../components/AppDownload/AppDownload.jsx'

const Home = () => {

  const [category, setCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div>
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
        <ExploreMenu category={category} setCategory={setCategory}/>
        <FoodDisplay category={category} searchQuery={searchQuery}/>
        <AppDownload/>
    </div>
  )
}

export default Home
