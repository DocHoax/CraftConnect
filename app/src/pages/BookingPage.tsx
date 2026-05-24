import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, MapPin, FileText, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navigation from '@/components/Navigation'
import type { User } from '@/App'
import type { Artisan } from '@/types/artisan'
import type { Booking } from '@/types/booking'
import { getArtisanById } from '@/features/artisans/artisans-api'
import { createBooking } from '@/features/bookings/bookings-api'

interface BookingPageProps {
  user: User | null
  logout: () => void
}

export default function BookingPage({ user, logout }: BookingPageProps) {
  const { artisanId } = useParams<{ artisanId: string }>()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [artisan, setArtisan] = useState<Artisan | null>(null)
  const [isLoadingArtisan, setIsLoadingArtisan] = useState(true)
  const [artisanError, setArtisanError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null)
  const [bookingData, setBookingData] = useState({
    service: '',
    date: '',
    time: '',
    location: '',
    notes: '',
  })

  useEffect(() => {
    if (!artisanId) {
      setArtisan(null)
      setIsLoadingArtisan(false)
      return
    }

    let isMounted = true
    setIsLoadingArtisan(true)
    setArtisanError('')

    const loadArtisan = async () => {
      try {
        const artisanData = await getArtisanById(artisanId)

        if (!isMounted) {
          return
        }

        if (!artisanData) {
          setArtisan(null)
          setArtisanError('Artisan not found')
          return
        }

        setArtisan(artisanData)
      } catch (error) {
        if (isMounted) {
          setArtisan(null)
          setArtisanError(error instanceof Error ? error.message : 'Unable to load artisan')
        }
      } finally {
        if (isMounted) {
          setIsLoadingArtisan(false)
        }
      }
    }

    void loadArtisan()

    return () => {
      isMounted = false
    }
  }, [artisanId])

  if (isLoadingArtisan) {
    return (
      <div className="min-h-screen bg-[#F6F4F2]">
        <Navigation user={user} logout={logout} />
        <div className="pt-24 pb-12 text-center">
          <h1 className="text-2xl font-bold text-[#2B1E1A]">Loading artisan...</h1>
        </div>
      </div>
    )
  }

  if (!artisan) {
    return (
      <div className="min-h-screen bg-[#F6F4F2]">
        <Navigation user={user} logout={logout} />
        <div className="pt-24 pb-12 text-center">
          <h1 className="text-2xl font-bold text-[#2B1E1A]">Artisan not found</h1>
          {artisanError && <p className="mt-2 text-sm text-red-600">{artisanError}</p>}
          <Link to="/search" className="mt-4 inline-block text-[#E4A14F]">
            Back to search
          </Link>
        </div>
      </div>
    )
  }

  const timeSlots = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ]

  const handleSubmit = async () => {
    if (!user || !artisan) {
      return
    }

    setSubmitError('')
    setIsSubmitting(true)

    try {
      const booking = await createBooking({
        customerId: user.id,
        artisanId: artisan.id,
        artisanName: artisan.name,
        service: bookingData.service,
        date: bookingData.date,
        time: bookingData.time,
        location: bookingData.location,
        notes: bookingData.notes || undefined,
      })

      setConfirmedBooking(booking)
      setIsSubmitting(false)
      setStep(3)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to confirm booking')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F4F2]">
      <Navigation user={user} logout={logout} />

      <div className="pt-20 pb-12">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="max-w-3xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-[#6E5F57] hover:text-[#2B1E1A] mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to profile
            </button>

            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= s ? 'bg-[#E4A14F] text-white' : 'bg-[#E9E1D6] text-[#6E5F57]'
                  }`}>
                    {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                  </div>
                  {s < 3 && (
                    <div className={`w-16 sm:w-24 h-1 mx-2 ${
                      step > s ? 'bg-[#E4A14F]' : 'bg-[#E9E1D6]'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            <div className="bg-white rounded-[28px] p-6 lg:p-8 shadow-[0_18px_40px_rgba(43,30,26,0.10)]">
              {step === 1 && (
                <div>
                  <h1 className="text-2xl font-bold text-[#2B1E1A] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Select Service
                  </h1>
                  <p className="text-[#6E5F57] mb-6">Choose the service you need from {artisan.name}</p>

                  <div className="space-y-3">
                    {artisan.services.map((service, index) => (
                      <label
                        key={index}
                        className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          bookingData.service === service
                            ? 'border-[#E4A14F] bg-[#E4A14F]/5'
                            : 'border-[#2B1E1A]/10 hover:border-[#2B1E1A]/20'
                        }`}
                      >
                        <input
                          type="radio"
                          name="service"
                          value={service}
                          checked={bookingData.service === service}
                          onChange={(e) => setBookingData({ ...bookingData, service: e.target.value })}
                          className="w-4 h-4 text-[#E4A14F] focus:ring-[#E4A14F]"
                        />
                        <span className="ml-3 text-[#2B1E1A]">{service}</span>
                      </label>
                    ))}
                  </div>

                  <div className="mt-8 flex justify-end">
                    <Button
                      onClick={() => setStep(2)}
                      disabled={!bookingData.service}
                      className="bg-[#E4A14F] hover:bg-[#d09045] text-white rounded-full px-8 disabled:opacity-50"
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h1 className="text-2xl font-bold text-[#2B1E1A] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Schedule Appointment
                  </h1>
                  <p className="text-[#6E5F57] mb-6">Choose your preferred date and time</p>

                  <div className="space-y-6">
                    {/* Date Selection */}
                    <div>
                      <label className="block text-sm font-medium text-[#2B1E1A] mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Select Date
                      </label>
                      <input
                        type="date"
                        value={bookingData.date}
                        onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 rounded-xl border border-[#2B1E1A]/10 bg-white text-[#2B1E1A] focus:outline-none focus:ring-2 focus:ring-[#E4A14F]/50"
                      />
                    </div>

                    {/* Time Selection */}
                    <div>
                      <label className="block text-sm font-medium text-[#2B1E1A] mb-2">
                        <Clock className="w-4 h-4 inline mr-2" />
                        Select Time
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => setBookingData({ ...bookingData, time })}
                            className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                              bookingData.time === time
                                ? 'bg-[#E4A14F] text-white'
                                : 'bg-[#F6F4F2] text-[#2B1E1A] hover:bg-[#E9E1D6]'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium text-[#2B1E1A] mb-2">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        Service Location
                      </label>
                      <input
                        type="text"
                        value={bookingData.location}
                        onChange={(e) => setBookingData({ ...bookingData, location: e.target.value })}
                        placeholder="Enter your address"
                        className="w-full px-4 py-3 rounded-xl border border-[#2B1E1A]/10 bg-white text-[#2B1E1A] placeholder:text-[#6E5F57]/50 focus:outline-none focus:ring-2 focus:ring-[#E4A14F]/50"
                      />
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-[#2B1E1A] mb-2">
                        <FileText className="w-4 h-4 inline mr-2" />
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        value={bookingData.notes}
                        onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                        placeholder="Describe any specific requirements..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-[#2B1E1A]/10 bg-white text-[#2B1E1A] placeholder:text-[#6E5F57]/50 focus:outline-none focus:ring-2 focus:ring-[#E4A14F]/50 resize-none"
                      />
                    </div>
                  </div>

                  {submitError && (
                    <p className="mt-4 text-sm text-red-600">{submitError}</p>
                  )}

                  <div className="mt-8 flex justify-between">
                    <Button
                      onClick={() => setStep(1)}
                      variant="outline"
                      className="rounded-full px-8 border-[#2B1E1A]/20"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={!bookingData.date || !bookingData.time || !bookingData.location || isSubmitting}
                      className="bg-[#E4A14F] hover:bg-[#d09045] text-white rounded-full px-8 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-50 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h1 className="text-2xl font-bold text-[#2B1E1A] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Booking Confirmed!
                  </h1>
                  <p className="text-[#6E5F57] mb-6">
                    Your appointment has been scheduled successfully.
                  </p>

                  <div className="bg-[#F6F4F2] rounded-2xl p-6 mb-6 text-left">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-[#6E5F57]">Booking ID</p>
                        <p className="font-semibold text-[#2B1E1A]">{confirmedBooking?.id ?? '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#6E5F57]">Artisan</p>
                        <p className="font-semibold text-[#2B1E1A]">{artisan.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#6E5F57]">Service</p>
                        <p className="font-semibold text-[#2B1E1A]">{confirmedBooking?.service ?? bookingData.service}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#6E5F57]">Date & Time</p>
                        <p className="font-semibold text-[#2B1E1A]">{confirmedBooking ? `${confirmedBooking.date} at ${confirmedBooking.time}` : `${bookingData.date} at ${bookingData.time}`}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/dashboard">
                      <Button className="bg-[#E4A14F] hover:bg-[#d09045] text-white rounded-full px-8">
                        View My Bookings
                      </Button>
                    </Link>
                    <Link to={`/payment/${confirmedBooking?.id ?? ''}`}>
                      <Button variant="outline" className="rounded-full px-8 border-[#2B1E1A]/20">
                        Proceed to Payment
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}