import { useMemo, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CreditCard, CheckCircle, Lock, Building2, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navigation from '@/components/Navigation'
import type { User } from '@/App'
import { useBookingDetails } from '@/features/bookings/hooks'
import { updateBookingStatus } from '@/features/bookings/bookings-api'

interface PaymentPageProps {
  user: User | null
  logout: () => void
}

export default function PaymentPage({ user, logout }: PaymentPageProps) {
  const { bookingId } = useParams<{ bookingId: string }>()
  const navigate = useNavigate()
  const { data: booking, isLoading, error } = useBookingDetails(bookingId)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'mobile'>('card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [transactionId, setTransactionId] = useState('')
  const [paymentError, setPaymentError] = useState('')
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  })

  const serviceFee = booking?.price ?? 0
  const platformFee = useMemo(() => (serviceFee > 0 ? Math.max(5, Math.round(serviceFee * 0.07)) : 0), [serviceFee])
  const total = serviceFee + platformFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!booking) {
      setPaymentError('Booking details are unavailable')
      return
    }

    setPaymentError('')
    setIsProcessing(true)
    const currentBookingId = booking.id
    
    // Simulate payment processing
    setTimeout(() => {
      void (async () => {
        const updatedBooking = await updateBookingStatus(currentBookingId, 'confirmed')

        if (!updatedBooking) {
          setPaymentError('Payment was processed but booking status could not be updated. Please contact support.')
          setIsProcessing(false)
          return
        }

        setTransactionId(`TXN${Math.random().toString(36).slice(2, 14).toUpperCase()}`)
        setIsProcessing(false)
        setIsComplete(true)
      })()
    }, 2000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F6F4F2]">
        <Navigation user={user} logout={logout} />
        <div className="pt-24 pb-12 text-center">
          <h1 className="text-2xl font-bold text-[#2B1E1A]">Loading booking...</h1>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#F6F4F2]">
        <Navigation user={user} logout={logout} />
        <div className="pt-24 pb-12 text-center">
          <h1 className="text-2xl font-bold text-[#2B1E1A]">Booking not found</h1>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <Link to="/dashboard" className="mt-4 inline-block text-[#E4A14F]">
            Back to dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-[#F6F4F2]">
        <Navigation user={user} logout={logout} />
        <div className="pt-24 pb-12">
          <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="max-w-md mx-auto text-center">
              <div className="bg-white rounded-[28px] p-8 shadow-[0_18px_40px_rgba(43,30,26,0.10)]">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold text-[#2B1E1A] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Payment Successful!
                </h1>
                <p className="text-[#6E5F57] mb-6">
                  Your payment has been processed successfully. A confirmation email has been sent.
                </p>
                <div className="bg-[#F6F4F2] rounded-2xl p-4 mb-6">
                  <p className="text-sm text-[#6E5F57]">Transaction ID</p>
                  <p className="font-semibold text-[#2B1E1A]">{transactionId}</p>
                </div>
                <Link to="/dashboard">
                  <Button className="w-full bg-[#E4A14F] hover:bg-[#d09045] text-white rounded-full py-6">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F6F4F2]">
      <Navigation user={user} logout={logout} />

      <div className="pt-20 pb-12">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="max-w-2xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-[#6E5F57] hover:text-[#2B1E1A] mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>

            <div className="bg-white rounded-[28px] p-6 lg:p-8 shadow-[0_18px_40px_rgba(43,30,26,0.10)]">
              <h1 className="text-2xl font-bold text-[#2B1E1A] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Complete Payment
              </h1>
              <p className="text-[#6E5F57] mb-6">
                Booking ID: {booking.id}
              </p>

              {/* Order Summary */}
              <div className="bg-[#F6F4F2] rounded-2xl p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#6E5F57]">Service Fee</span>
                  <span className="text-[#2B1E1A]">${serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#6E5F57]">Platform Fee</span>
                  <span className="text-[#2B1E1A]">${platformFee.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#2B1E1A]/10">
                  <span className="font-semibold text-[#2B1E1A]">Total</span>
                  <span className="font-bold text-xl text-[#E4A14F]">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#2B1E1A] mb-3">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-[#E4A14F] bg-[#E4A14F]/5'
                        : 'border-[#2B1E1A]/10 hover:border-[#2B1E1A]/20'
                    }`}
                  >
                    <CreditCard className="w-6 h-6 mb-2 text-[#E4A14F]" />
                    <span className="text-sm text-[#2B1E1A]">Card</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('bank')}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'bank'
                        ? 'border-[#E4A14F] bg-[#E4A14F]/5'
                        : 'border-[#2B1E1A]/10 hover:border-[#2B1E1A]/20'
                    }`}
                  >
                    <Building2 className="w-6 h-6 mb-2 text-[#E4A14F]" />
                    <span className="text-sm text-[#2B1E1A]">Bank</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('mobile')}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'mobile'
                        ? 'border-[#E4A14F] bg-[#E4A14F]/5'
                        : 'border-[#2B1E1A]/10 hover:border-[#2B1E1A]/20'
                    }`}
                  >
                    <Smartphone className="w-6 h-6 mb-2 text-[#E4A14F]" />
                    <span className="text-sm text-[#2B1E1A]">Mobile</span>
                  </button>
                </div>
              </div>

              {/* Payment Form */}
              <form onSubmit={handleSubmit}>
                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#2B1E1A] mb-2">
                        Card Number
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6E5F57]" />
                        <input
                          type="text"
                          value={cardData.number}
                          onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                          placeholder="1234 5678 9012 3456"
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#2B1E1A]/10 bg-white text-[#2B1E1A] placeholder:text-[#6E5F57]/50 focus:outline-none focus:ring-2 focus:ring-[#E4A14F]/50"
                          maxLength={19}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2B1E1A] mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardData.name}
                        onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl border border-[#2B1E1A]/10 bg-white text-[#2B1E1A] placeholder:text-[#6E5F57]/50 focus:outline-none focus:ring-2 focus:ring-[#E4A14F]/50"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#2B1E1A] mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={cardData.expiry}
                          onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 rounded-xl border border-[#2B1E1A]/10 bg-white text-[#2B1E1A] placeholder:text-[#6E5F57]/50 focus:outline-none focus:ring-2 focus:ring-[#E4A14F]/50"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#2B1E1A] mb-2">
                          CVV
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6E5F57]" />
                          <input
                            type="password"
                            value={cardData.cvv}
                            onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                            placeholder="123"
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#2B1E1A]/10 bg-white text-[#2B1E1A] placeholder:text-[#6E5F57]/50 focus:outline-none focus:ring-2 focus:ring-[#E4A14F]/50"
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'bank' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#2B1E1A] mb-2">
                        Bank Account Number
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your account number"
                        className="w-full px-4 py-3 rounded-xl border border-[#2B1E1A]/10 bg-white text-[#2B1E1A] placeholder:text-[#6E5F57]/50 focus:outline-none focus:ring-2 focus:ring-[#E4A14F]/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2B1E1A] mb-2">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        placeholder="Select your bank"
                        className="w-full px-4 py-3 rounded-xl border border-[#2B1E1A]/10 bg-white text-[#2B1E1A] placeholder:text-[#6E5F57]/50 focus:outline-none focus:ring-2 focus:ring-[#E4A14F]/50"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'mobile' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#2B1E1A] mb-2">
                        Mobile Payment Provider
                      </label>
                      <select className="w-full px-4 py-3 rounded-xl border border-[#2B1E1A]/10 bg-white text-[#2B1E1A] focus:outline-none focus:ring-2 focus:ring-[#E4A14F]/50">
                        <option>Select provider</option>
                        <option>Apple Pay</option>
                        <option>Google Pay</option>
                        <option>PayPal</option>
                        <option>Venmo</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2B1E1A] mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-3 rounded-xl border border-[#2B1E1A]/10 bg-white text-[#2B1E1A] placeholder:text-[#6E5F57]/50 focus:outline-none focus:ring-2 focus:ring-[#E4A14F]/50"
                      />
                    </div>
                  </div>
                )}

                <div className="mt-8">
                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-[#E4A14F] hover:bg-[#d09045] text-white rounded-full py-6 text-base font-medium disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Pay ${total.toFixed(2)} Securely
                      </span>
                    )}
                  </Button>
                </div>

                {paymentError && (
                  <p className="mt-4 text-center text-xs text-red-600">{paymentError}</p>
                )}

                <p className="mt-4 text-center text-xs text-[#6E5F57]">
                  <Lock className="w-3 h-3 inline mr-1" />
                  Your payment information is encrypted and secure
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}