import { Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/homePage'
import EventDetails from './pages/eventDetailsPage'
import EventListPage from './pages/eventListPage'
import LoginPage from './pages/loginPage'


const NavBar = () => {
  return <div className='bg-red-400 flex justify-between md:text-xl text-white md:px-10 lg:px-40 py-4'>
    <div>
      <a href="/">BookingTest</a>
      
    </div>
    <div className='flex gap-4 md:gap-10 justify-end items-center'>
      <p><a href="/">Home</a></p>
      <p><a href="/event/list">EventList</a></p>
      <p className='cursor-pointer' onClick={()=> {localStorage.removeItem("testUser"); window.location.href= "/login"}}>LogOut</p>
    </div>
  </div>
}
function App() {


  return (
    <>
      <NavBar/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/event/list" element={<EventListPage />} />
        <Route path='/event/:id' element={<EventDetails />} />
        <Route path='/login' element={<LoginPage />} />
      </Routes>
    </>
  )
}

export default App