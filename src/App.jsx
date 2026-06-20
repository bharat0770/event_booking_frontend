import { Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/homePage'
import EventDetails from './pages/eventDetailsPage'
import EventListPage from './pages/eventListPage'
import LoginPage from './pages/loginPage'
import ConfirmBookingPage from './pages/confirmBooking'
import { Toaster } from 'react-hot-toast'
import RegisterPage from './pages/registerPage'
import NavBar from './compnents/NavBar'



function App() {


  return (
    <>
      <NavBar />
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/event/list" element={<EventListPage />} />
        <Route path='/event/:id' element={<EventDetails />} />

        <Route path='/booking/confirm/:reservationId/:eventId' element={<ConfirmBookingPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />

      </Routes>
    </>
  )
}

export default App