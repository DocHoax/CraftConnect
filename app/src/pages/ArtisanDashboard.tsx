import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Calendar, Clock, MapPin, Star, Settings, 
  LogOut, CheckCircle, XCircle, DollarSign, TrendingUp,
  Briefcase, Menu, X, Home, Search, User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navigation from '@/components/Navigation'
import type { User as UserType } from '@/App'
import { useArtisanBookings } from '@/features/bookings/hooks'
import { updateBookingStatus } from '@/features/bookings/bookings-api'

interface ArtisanDashboardProps {
  user: UserType | null
  logout: () => void
}

export default function ArtisanDashboard({ user, logout }: ArtisanDashboardProps) {
  const [activeTab, setActiveTab] = useState<'requests' | 'schedule' | 'earnings' | 'profile'>('requests')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [actionBookingId, setActionBookingId] = useState<string | null>(null)
  const [actionError, setActionError] = useState('')

  const {
    data: artisanBookings,
    isLoading: bookingsLoading,
    error: bookingsError,
    refresh,
  } = useArtisanBookings(user?.id)

  const jobRequests = useMemo(
    () => artisanBookings.filter((booking) => booking.status === 'pending'),
    [artisanBookings],
  )

  const confirmedJobs = useMemo(
    () => artisanBookings.filter((booking) => booking.status === 'confirmed'),
    [artisanBookings],
  )

  const completedJobs = useMemo(
    () => artisanBookings.filter((booking) => booking.status === 'completed'),
    [artisanBookings],
  )

  const weeklySchedule = [
    { day: 'Mon', slots: ['09:00 AM', '11:00 AM', '02:00 PM'] },
    { day: 'Tue', slots: ['10:00 AM', '01:00 PM', '03:00 PM'] },
    { day: 'Wed', slots: ['09:00 AM', '02:00 PM'] },
    { day: 'Thu', slots: ['11:00 AM', '03:00 PM'] },
    { day: 'Fri', slots: ['09:00 AM', '01:00 PM', '04:00 PM'] },
    { day: 'Sat', slots: ['10:00 AM'] },
    { day: 'Sun', slots: [] },
  ]

  const navItems = [
    { id: 'requests', label: 'Job Requests', icon: Briefcase, badge: jobRequests.length },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'profile', label: 'Profile', icon: Settings },
  ]

  const handleUpdateBookingStatus = async (bookingId: string, status: 'confirmed' | 'cancelled' | 'completed') => {
    setActionError('')
    setActionBookingId(bookingId)

    const updatedBooking = await updateBookingStatus(bookingId, status)

    if (!updatedBooking) {
      setActionError('Unable to update booking status right now')
      setActionBookingId(null)
      return
    }

    refresh()
    setActionBookingId(null)
  }

  const getCustomerLabel = (customerId: string) => `Customer #${customerId}`

  const earnings = {
    thisMonth: completedJobs.reduce((total, booking) => total + booking.price, 0),
    lastMonth: 0,
    totalJobs: completedJobs.length,
    rating: 4.9,
    pendingPayout: confirmedJobs.reduce((total, booking) => total + booking.price, 0),
  }

  return (
    <div className="min-h-screen bg-[#F6F4F2] pb-20 lg:pb-0">
      <Navigation user={user} logout={logout} />

      <div className="pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E9E1D6] overflow-hidden">
                  <img src="/images/artisan-1.jpg" alt={user?.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="font-semibold text-[#2B1E1A] text-sm">{user?.name}</h2>
                  <p className="text-xs text-[#6E5F57]">Electrician</p>
                </div>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-white shadow-sm"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="lg:hidden bg-white rounded-2xl p-4 shadow-lg mb-4">
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as typeof activeTab)
                        setMobileMenuOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                        activeTab === item.id ? 'bg-[#E4A14F]/10 text-[#E4A14F]' : 'text-[#6E5F57] hover:bg-[#F6F4F2]'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                      {item.badge && (
                        <span className="ml-auto w-5 h-5 rounded-full bg-[#E4A14F] text-white text-xs flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                  <div className="pt-2 border-t border-[#2B1E1A]/10">
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </div>
                </nav>
              </div>
            )}

            {/* Sidebar - Desktop */}
            <div className="hidden lg:block lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-2xl sm:rounded-[28px] p-4 sm:p-6 shadow-[0_18px_40px_rgba(43,30,26,0.08)] sticky top-24">
                <div className="text-center mb-4 sm:mb-6">
                  <div className="w-16 h-16 sm:w-20 mx-auto rounded-full bg-[#E9E1D6] overflow-hidden mb-2 sm:mb-3">
                    <img src="/images/artisan-1.jpg" alt={user?.name} className="w-full h-full object-cover" />
                  </div>
                  <h2 className="font-semibold text-[#2B1E1A] text-sm sm:text-base">{user?.name}</h2>
                  <p className="text-xs sm:text-sm text-[#6E5F57]">Electrician</p>
                  <div className="flex items-center justify-center gap-1 mt-1 sm:mt-2">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-[#E4A14F] text-[#E4A14F]" />
                    <span className="text-xs sm:text-sm font-medium text-[#2B1E1A]">4.9</span>
                    <span className="text-xs text-[#6E5F57]">(127 reviews)</span>
                  </div>
                </div>

                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as typeof activeTab)}
                      className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-colors text-sm ${
                        activeTab === item.id ? 'bg-[#E4A14F]/10 text-[#E4A14F]' : 'text-[#6E5F57] hover:bg-[#F6F4F2]'
                      }`}
                    >
                      <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      {item.label}
                      {item.badge && (
                        <span className="ml-auto w-5 h-5 rounded-full bg-[#E4A14F] text-white text-xs flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                  <div className="pt-3 sm:pt-4 border-t border-[#2B1E1A]/10">
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors text-sm"
                    >
                      <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                      Logout
                    </button>
                  </div>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {activeTab === 'requests' && (
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-[#2B1E1A] mb-4 sm:mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Job Requests
                  </h1>

                  {/* Pending Requests */}
                  <div className="mb-6 sm:mb-8">
                    <h2 className="text-base sm:text-lg font-semibold text-[#2B1E1A] mb-3 sm:mb-4">Pending Requests</h2>
                    <div className="space-y-3 sm:space-y-4">
                      {bookingsError && <p className="text-sm text-red-600">{bookingsError}</p>}
                      {actionError && <p className="text-sm text-red-600">{actionError}</p>}
                      {bookingsLoading && jobRequests.length === 0 && (
                        <div className="bg-white rounded-xl sm:rounded-[28px] p-4 sm:p-6 shadow-[0_18px_40px_rgba(43,30,26,0.08)]">
                          <p className="text-sm text-[#6E5F57]">Loading requests...</p>
                        </div>
                      )}
                      {!bookingsLoading && jobRequests.length === 0 && !bookingsError && (
                        <div className="bg-white rounded-xl sm:rounded-[28px] p-4 sm:p-6 shadow-[0_18px_40px_rgba(43,30,26,0.08)]">
                          <p className="text-sm text-[#6E5F57]">No pending job requests.</p>
                        </div>
                      )}
                      {jobRequests.map((job) => (
                        <div key={job.id} className="bg-white rounded-xl sm:rounded-[28px] p-4 sm:p-6 shadow-[0_18px_40px_rgba(43,30,26,0.08)]">
                          <div className="flex flex-col gap-3 sm:gap-4">
                            <div>
                              <h3 className="font-semibold text-[#2B1E1A] text-sm sm:text-base">{job.service}</h3>
                              <p className="text-xs sm:text-sm text-[#6E5F57]">Requested by {getCustomerLabel(job.customerId)}</p>
                              <div className="flex flex-wrap gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-[#6E5F57]">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                  {job.date}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                  {job.time}
                                </span>
                                <span className="flex items-center gap-1 hidden sm:flex">
                                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                                  {job.location}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                              <span className="font-semibold text-[#E4A14F] text-sm sm:text-base">~${job.price}</span>
                              <div className="flex gap-2 w-full sm:w-auto">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-full text-red-600 border-red-200 hover:bg-red-50 text-xs flex-1 sm:flex-none"
                                  onClick={() => void handleUpdateBookingStatus(job.id, 'cancelled')}
                                  disabled={actionBookingId === job.id}
                                >
                                  <XCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                  {actionBookingId === job.id ? 'Saving...' : 'Decline'}
                                </Button>
                                <Button
                                  size="sm"
                                  className="rounded-full bg-[#E4A14F] hover:bg-[#d09045] text-white text-xs flex-1 sm:flex-none"
                                  onClick={() => void handleUpdateBookingStatus(job.id, 'confirmed')}
                                  disabled={actionBookingId === job.id}
                                >
                                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                  {actionBookingId === job.id ? 'Saving...' : 'Accept'}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Confirmed Jobs */}
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-[#2B1E1A] mb-3 sm:mb-4">Confirmed Jobs</h2>
                    <div className="space-y-3 sm:space-y-4">
                      {!bookingsLoading && confirmedJobs.length === 0 && !bookingsError && (
                        <div className="bg-white rounded-xl sm:rounded-[28px] p-4 sm:p-6 shadow-[0_18px_40px_rgba(43,30,26,0.08)]">
                          <p className="text-sm text-[#6E5F57]">No confirmed jobs yet.</p>
                        </div>
                      )}
                      {confirmedJobs.map((job) => (
                        <div key={job.id} className="bg-white rounded-xl sm:rounded-[28px] p-4 sm:p-6 shadow-[0_18px_40px_rgba(43,30,26,0.08)]">
                          <div className="flex flex-col gap-3 sm:gap-4">
                            <div>
                              <h3 className="font-semibold text-[#2B1E1A] text-sm sm:text-base">{job.service}</h3>
                              <p className="text-xs sm:text-sm text-[#6E5F57]">For {getCustomerLabel(job.customerId)}</p>
                              <div className="flex flex-wrap gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-[#6E5F57]">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                  {job.date}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                  {job.time}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                              <span className="font-semibold text-[#E4A14F] text-sm sm:text-base">${job.price}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-full text-xs w-full sm:w-auto"
                                onClick={() => void handleUpdateBookingStatus(job.id, 'completed')}
                                disabled={actionBookingId === job.id}
                              >
                                {actionBookingId === job.id ? 'Saving...' : 'Mark Complete'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'schedule' && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <h1 className="text-xl sm:text-2xl font-bold text-[#2B1E1A]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      My Schedule
                    </h1>
                    <Button className="bg-[#E4A14F] hover:bg-[#d09045] text-white rounded-full text-sm w-full sm:w-auto">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Availability
                    </Button>
                  </div>

                  <div className="bg-white rounded-xl sm:rounded-[28px] p-4 sm:p-6 shadow-[0_18px_40px_rgba(43,30,26,0.08)] overflow-x-auto">
                    <div className="grid grid-cols-7 gap-1 sm:gap-2 min-w-[500px]">
                      {weeklySchedule.map((day) => (
                        <div key={day.day} className="text-center">
                          <div className="font-semibold text-[#2B1E1A] mb-1 sm:mb-2 text-xs sm:text-sm">{day.day}</div>
                          <div className="space-y-1">
                            {day.slots.length > 0 ? (
                              day.slots.map((slot, i) => (
                                <div key={i} className="p-1 sm:p-2 rounded-lg bg-[#E4A14F]/10 text-[#E4A14F] text-[10px] sm:text-xs">
                                  {slot}
                                </div>
                              ))
                            ) : (
                              <div className="p-1 sm:p-2 rounded-lg bg-[#F6F4F2] text-[#6E5F57] text-[10px] sm:text-xs">
                                Off
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'earnings' && (
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-[#2B1E1A] mb-4 sm:mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Earnings
                  </h1>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div className="bg-white rounded-xl sm:rounded-[28px] p-4 sm:p-6 shadow-[0_18px_40px_rgba(43,30,26,0.08)]">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#E4A14F]/10 flex items-center justify-center">
                          <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-[#E4A14F]" />
                        </div>
                        <span className="text-xs sm:text-sm text-[#6E5F57]">This Month</span>
                      </div>
                      <p className="text-xl sm:text-2xl font-bold text-[#2B1E1A]">${earnings.thisMonth}</p>
                    </div>
                    <div className="bg-white rounded-xl sm:rounded-[28px] p-4 sm:p-6 shadow-[0_18px_40px_rgba(43,30,26,0.08)]">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#E4A14F]/10 flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#E4A14F]" />
                        </div>
                        <span className="text-xs sm:text-sm text-[#6E5F57]">Last Month</span>
                      </div>
                      <p className="text-xl sm:text-2xl font-bold text-[#2B1E1A]">${earnings.lastMonth}</p>
                    </div>
                    <div className="bg-white rounded-xl sm:rounded-[28px] p-4 sm:p-6 shadow-[0_18px_40px_rgba(43,30,26,0.08)]">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#E4A14F]/10 flex items-center justify-center">
                          <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-[#E4A14F]" />
                        </div>
                        <span className="text-xs sm:text-sm text-[#6E5F57]">Total Jobs</span>
                      </div>
                      <p className="text-xl sm:text-2xl font-bold text-[#2B1E1A]">{earnings.totalJobs}</p>
                    </div>
                    <div className="bg-white rounded-xl sm:rounded-[28px] p-4 sm:p-6 shadow-[0_18px_40px_rgba(43,30,26,0.08)]">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#E4A14F]/10 flex items-center justify-center">
                          <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-[#E4A14F]" />
                        </div>
                        <span className="text-xs sm:text-sm text-[#6E5F57]">Pending</span>
                      </div>
                      <p className="text-xl sm:text-2xl font-bold text-[#2B1E1A]">${earnings.pendingPayout}</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl sm:rounded-[28px] p-4 sm:p-6 shadow-[0_18px_40px_rgba(43,30,26,0.08)]">
                    <h3 className="font-semibold text-[#2B1E1A] mb-3 sm:mb-4 text-sm sm:text-base">Recent Transactions</h3>
                    <div className="space-y-2 sm:space-y-3">
                      {[
                        { id: 'TXN123', customer: 'John Smith', amount: 120, date: '2026-03-10', status: 'completed' },
                        { id: 'TXN122', customer: 'Emily Davis', amount: 85, date: '2026-03-08', status: 'completed' },
                        { id: 'TXN121', customer: 'Michael Brown', amount: 350, date: '2026-03-05', status: 'pending' },
                      ].map((txn) => (
                        <div key={txn.id} className="flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl bg-[#F6F4F2]">
                          <div>
                            <p className="font-medium text-[#2B1E1A] text-sm">{txn.customer}</p>
                            <p className="text-xs text-[#6E5F57]">{txn.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-[#2B1E1A] text-sm">+${txn.amount}</p>
                            <span className={`text-[10px] sm:text-xs ${txn.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                              {txn.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-[#2B1E1A] mb-4 sm:mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Profile Settings
                  </h1>

                  <div className="bg-white rounded-xl sm:rounded-[28px] p-4 sm:p-6 shadow-[0_18px_40px_rgba(43,30,26,0.08)]">
                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-[#2B1E1A] mb-1.5 sm:mb-2">Full Name</label>
                        <input
                          type="text"
                          defaultValue={user?.name}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-[#2B1E1A]/10 bg-white text-sm text-[#2B1E1A] focus:outline-none focus:ring-2 focus:ring-[#E4A14F]/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#2B1E1A] mb-1.5 sm:mb-2">Email</label>
                        <input
                          type="email"
                          defaultValue={user?.email}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-[#2B1E1A]/10 bg-white text-sm text-[#2B1E1A] focus:outline-none focus:ring-2 focus:ring-[#E4A14F]/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#2B1E1A] mb-1.5 sm:mb-2">Phone</label>
                        <input
                          type="tel"
                          defaultValue="+1 (555) 000-0000"
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-[#2B1E1A]/10 bg-white text-sm text-[#2B1E1A] focus:outline-none focus:ring-2 focus:ring-[#E4A14F]/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#2B1E1A] mb-1.5 sm:mb-2">Service Category</label>
                        <input
                          type="text"
                          defaultValue="Electrical"
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-[#2B1E1A]/10 bg-white text-sm text-[#2B1E1A] focus:outline-none focus:ring-2 focus:ring-[#E4A14F]/50"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-[#2B1E1A] mb-1.5 sm:mb-2">Service Description</label>
                        <textarea
                          defaultValue="Licensed electrician with 8+ years experience in residential and commercial wiring, panel upgrades, and troubleshooting."
                          rows={3}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-[#2B1E1A]/10 bg-white text-sm text-[#2B1E1A] focus:outline-none focus:ring-2 focus:ring-[#E4A14F]/50 resize-none"
                        />
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-6 flex justify-end">
                      <Button className="bg-[#E4A14F] hover:bg-[#d09045] text-white rounded-full px-6 sm:px-8 text-sm sm:text-base">
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E9E1D6] px-2 py-1 z-40 lg:hidden safe-area-bottom">
        <div className="flex justify-around items-center">
          <Link to="/" className="flex flex-col items-center p-2 text-[#6E5F57] hover:text-[#E4A14F]">
            <Home className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Home</span>
          </Link>
          <Link to="/search" className="flex flex-col items-center p-2 text-[#6E5F57] hover:text-[#E4A14F]">
            <Search className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Search</span>
          </Link>
          <button 
            onClick={() => setActiveTab('requests')}
            className={`flex flex-col items-center p-2 ${activeTab === 'requests' ? 'text-[#E4A14F]' : 'text-[#6E5F57]'}`}
          >
            <Briefcase className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Jobs</span>
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center p-2 ${activeTab === 'profile' ? 'text-[#E4A14F]' : 'text-[#6E5F57]'}`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Profile</span>
          </button>
        </div>
      </div>
    </div>
  )
}