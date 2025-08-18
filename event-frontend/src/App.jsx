import React from 'react'
import Login from './components/Login'
import { Navigate, Route, Routes } from 'react-router-dom'
import Signup from './components/Signup'
import UserDashboard from './components/UserDashboard'
import AdminDashboard from './components/AdminDashboard'
import ControllerDashboard from './components/ControllerDashboard'
import EventForm from './components/EventForm'
import PrivateRoutes from './components/PrivateRoutes'
import BookingForm from './components/BookingForm'
import Payment from './components/Payment'
import Main from './components/Main'
import Success from './components/Success'
import MyEvents from './components/MyEvents'
import Contact from './components/Contact'
import Notifications from './components/Notifications'
import AdminMessages from './components/AdminMessages'
import About from './components/About'
import PublicContact from './components/PublicContact'
import EventAttendees from './components/EventAttendees'
import ResetPassword from './components/ResetPassword'

const App = () => {
  return (
    <Routes>
      {/* Public routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Main child={<Login />} />}/>
        <Route path="/signup" element={<Main child={<Signup />} />}/> 
        <Route path="/public-contact" element={<Main child={<PublicContact />} />} /> 
        <Route path="/about" element={<Main child={<About />} />} /> 
        <Route path="/reset-password/:token" element={<Main child={<ResetPassword />} />} /> 


        {/* User routes */}
        <Route element={<PrivateRoutes allowedRoles={['user']} />}>
          <Route path="/user-dashboard" element={<Main child={<UserDashboard />} />}/>
          <Route path="/booking-form/:eventId" element={<Main child={<BookingForm />} />}/>
          <Route path="/book-event/:eventId" element={<Main child={<BookingForm />} />}/>
          <Route path="/payment/:eventId" element={<Main child={<Payment />} />}/>
          <Route path="/success" element={<Main child={<Success />} />}/>
          <Route path="/my-bookings" element={<Main child={<MyEvents />} />} />
          <Route path="/contact" element={<Main child={<Contact />} />} />
        <Route path="/notifications" element={<Main child={<Notifications />} />} />


        </Route>
        {/* Admin-protected routes */}
        <Route element={<PrivateRoutes allowedRoles={['admin']} />}>
          <Route path="/admin-dashboard" element={<Main child={<AdminDashboard />} />}/>
          <Route path="/events/create" element={<Main child={<EventForm />} />}/>
          <Route path="/events/:id/edit" element={<Main child={<EventForm />} />}/>
          <Route path="/admin-messages" element={<Main child={<AdminMessages />} />} />

        </Route>

      {/* Controller-protected routes */}
        <Route element={<PrivateRoutes allowedRoles={['controller']} />}>
          <Route path="/controller-dashboard" element={<Main child={<ControllerDashboard />} />}/>
          <Route path="/controller/notifications" element={<Main child={<Notifications />} />} />
          <Route path="/controller/event/:eventId/attendees" element={<Main child={<EventAttendees />} />} />

        </Route>
         {/* Catch-all fallback */}
         <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
 
  )
}

export default App