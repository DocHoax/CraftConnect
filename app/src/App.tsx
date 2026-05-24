import type { ReactNode } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { useAuth } from '@/features/auth/AuthProvider'
import type { UserRole } from '@/types/auth'

// Pages
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import CustomerDashboard from './pages/CustomerDashboard'
import ArtisanDashboard from './pages/ArtisanDashboard'
import AdminPanel from './pages/AdminPanel'
import SearchArtisans from './pages/SearchArtisans'
import ArtisanProfile from './pages/ArtisanProfile'
import BookingPage from './pages/BookingPage'
import PaymentPage from './pages/PaymentPage'
import ContactPage from './pages/ContactPage'
import HelpPage from './pages/HelpPage'

export type { User, UserRole } from '@/types/auth'

function getDefaultRouteForRole(role: UserRole): string {
  switch (role) {
    case 'customer':
      return '/dashboard'
    case 'artisan':
      return '/artisan-dashboard'
    case 'admin':
      return '/admin'
    default:
      return '/'
  }
}

function App() {
  const { user, isLoading, logout } = useAuth()
  const handleLogout = () => {
    void logout()
  }

  // Protected route component
  const ProtectedRoute = ({ children, allowedRoles }: { children: ReactNode; allowedRoles: UserRole[] }) => {
    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    if (!user) return <Navigate to="/login" />
    if (!allowedRoles.includes(user.role)) return <Navigate to="/" />
    return <>{children}</>
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage user={user} logout={handleLogout} />} />
        <Route path="/login" element={user ? <Navigate to={getDefaultRouteForRole(user.role)} /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to={getDefaultRouteForRole(user.role)} /> : <SignUp />} />
        <Route path="/contact" element={<ContactPage user={user} logout={handleLogout} />} />
        <Route path="/help" element={<HelpPage user={user} logout={handleLogout} />} />
        
        {/* Search & Booking (Public but enhanced when logged in) */}
        <Route path="/search" element={<SearchArtisans user={user} logout={handleLogout} />} />
        <Route path="/artisan/:id" element={<ArtisanProfile user={user} logout={handleLogout} />} />
        
        {/* Protected Customer Routes */}
        <Route 
          path="/booking/:artisanId" 
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <BookingPage user={user} logout={handleLogout} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/payment/:bookingId" 
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <PaymentPage user={user} logout={handleLogout} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerDashboard user={user} logout={handleLogout} />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected Artisan Routes */}
        <Route 
          path="/artisan-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['artisan']}>
              <ArtisanDashboard user={user} logout={handleLogout} />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPanel user={user} logout={handleLogout} />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App