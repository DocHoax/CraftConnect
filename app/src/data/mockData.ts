export interface Artisan {
  id: string
  name: string
  category: string
  rating: number
  reviews: number
  location: string
  priceRange: string
  experience: number
  image: string
  description: string
  services: string[]
  availability: string[]
  verified: boolean
}

export interface Booking {
  id: string
  customerId: string
  artisanId: string
  artisanName: string
  service: string
  date: string
  time: string
  location: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  price: number
  notes?: string
}

export interface Review {
  id: string
  customerName: string
  artisanId: string
  rating: number
  comment: string
  date: string
}

export const categories = [
  { id: 'plumbing', name: 'Plumbing', icon: 'Droplets' },
  { id: 'electrical', name: 'Electrical', icon: 'Zap' },
  { id: 'carpentry', name: 'Carpentry', icon: 'Hammer' },
  { id: 'painting', name: 'Painting', icon: 'Paintbrush' },
  { id: 'cleaning', name: 'Cleaning', icon: 'Sparkles' },
  { id: 'hvac', name: 'HVAC', icon: 'Wind' },
  { id: 'appliances', name: 'Appliances', icon: 'Settings' },
  { id: 'landscaping', name: 'Landscaping', icon: 'TreePine' },
  { id: 'moving', name: 'Moving', icon: 'Truck' },
  { id: 'assembly', name: 'Assembly', icon: 'Wrench' },
  { id: 'tailoring', name: 'Tailoring', icon: 'Scissors' },
  { id: 'mobile-repair', name: 'Mobile Repair', icon: 'Smartphone' },
]

export const artisans: Artisan[] = [
  {
    id: '1',
    name: 'Maria Johnson',
    category: 'Electrical',
    rating: 4.9,
    reviews: 127,
    location: 'Downtown',
    priceRange: '$45-80/hr',
    experience: 8,
    image: '/images/artisan-1.jpg',
    description: 'Licensed electrician with 8+ years experience in residential and commercial wiring, panel upgrades, and troubleshooting.',
    services: ['Wiring', 'Panel Upgrades', 'Lighting Installation', 'Troubleshooting'],
    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    verified: true,
  },
  {
    id: '2',
    name: 'James Miller',
    category: 'Plumbing',
    rating: 4.8,
    reviews: 94,
    location: 'Midtown',
    priceRange: '$50-90/hr',
    experience: 12,
    image: '/images/artisan-2.jpg',
    description: 'Master plumber specializing in leak detection, pipe repair, and bathroom renovations.',
    services: ['Leak Repair', 'Pipe Installation', 'Drain Cleaning', 'Bathroom Renovation'],
    availability: ['Mon', 'Wed', 'Thu', 'Sat', 'Sun'],
    verified: true,
  },
  {
    id: '3',
    name: 'Aisha Williams',
    category: 'Carpentry',
    rating: 5.0,
    reviews: 63,
    location: 'Uptown',
    priceRange: '$55-100/hr',
    experience: 6,
    image: '/images/artisan-3.jpg',
    description: 'Skilled carpenter crafting custom furniture, cabinets, and home improvements with attention to detail.',
    services: ['Custom Furniture', 'Cabinetry', 'Deck Building', 'Home Repairs'],
    availability: ['Tue', 'Wed', 'Fri', 'Sat'],
    verified: true,
  },
  {
    id: '4',
    name: 'Leo Thompson',
    category: 'Painting',
    rating: 4.7,
    reviews: 156,
    location: 'Westside',
    priceRange: '$40-75/hr',
    experience: 15,
    image: '/images/artisan-4.jpg',
    description: 'Professional painter delivering flawless interior and exterior finishes for homes and businesses.',
    services: ['Interior Painting', 'Exterior Painting', 'Wallpaper', 'Staining'],
    availability: ['Mon', 'Tue', 'Thu', 'Fri', 'Sat'],
    verified: true,
  },
  {
    id: '5',
    name: 'David Chen',
    category: 'HVAC',
    rating: 4.9,
    reviews: 89,
    location: 'Eastside',
    priceRange: '$60-110/hr',
    experience: 10,
    image: '/images/artisan-5.jpg',
    description: 'HVAC technician providing installation, repair, and maintenance for all heating and cooling systems.',
    services: ['AC Installation', 'Heating Repair', 'Maintenance', 'Duct Cleaning'],
    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    verified: true,
  },
  {
    id: '6',
    name: 'Sarah Parker',
    category: 'Cleaning',
    rating: 4.8,
    reviews: 201,
    location: 'Downtown',
    priceRange: '$35-60/hr',
    experience: 5,
    image: '/images/artisan-6.jpg',
    description: 'Professional cleaner offering deep cleaning, regular maintenance, and move-in/move-out services.',
    services: ['Deep Cleaning', 'Regular Maintenance', 'Move-in/out', 'Office Cleaning'],
    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    verified: true,
  },
]

export const testimonials = [
  {
    id: '1',
    customerName: 'Amara K.',
    image: '/images/customer-1.jpg',
    rating: 5,
    comment: 'I booked a plumber at 8pm and the leak was fixed by morning. Super smooth experience from start to finish.',
    service: 'Plumbing Repair',
  },
  {
    id: '2',
    customerName: 'Jonas T.',
    image: '/images/customer-2.jpg',
    rating: 5,
    comment: 'Finally a platform where I can see reviews, pricing, and availability in one place. Highly recommended!',
    service: 'Electrical Work',
  },
]

export const faqs = [
  {
    question: 'How do I book an artisan?',
    answer: 'Simply search for the service you need, browse verified artisans, select your preferred date and time, and confirm your booking. You\'ll receive a confirmation email with all the details.',
  },
  {
    question: 'Can I reschedule or cancel a booking?',
    answer: 'Yes! You can reschedule or cancel your booking up to 24 hours before the scheduled appointment without any penalty. Just go to your dashboard and manage your bookings.',
  },
  {
    question: 'How is pricing calculated?',
    answer: 'Artisans set their own hourly rates or provide fixed quotes for specific jobs. You\'ll see the pricing upfront before confirming your booking. There are no hidden fees.',
  },
  {
    question: 'Are artisans verified?',
    answer: 'Absolutely. Every artisan on our platform undergoes identity verification, background checks, and skill validation. We also monitor reviews to ensure quality service.',
  },
  {
    question: 'What if something goes wrong?',
    answer: 'We have a dedicated support team available 24/7. If you\'re not satisfied with the service, we\'ll work with you and the artisan to resolve the issue or provide a refund.',
  },
]

export const howItWorks = [
  {
    step: 1,
    title: 'Tell us what you need',
    description: 'A repair, install, or project—describe it in seconds.',
    image: '/images/step-search.jpg',
  },
  {
    step: 2,
    title: 'Choose a time',
    description: 'Pick a slot that fits your calendar.',
    image: '/images/step-schedule.jpg',
  },
  {
    step: 3,
    title: 'We\'ll handle the rest',
    description: 'Verified artisan arrives, works, and wraps up cleanly.',
    image: '/images/step-done.jpg',
  },
]

export const pricingTiers = [
  {
    name: 'Small Fixes',
    price: 'From $45',
    description: 'Leaks, outlets, locks, mounting',
    examples: ['Fix a leaky faucet', 'Install light fixture', 'Repair door lock'],
  },
  {
    name: 'Standard Jobs',
    price: 'From $120',
    description: 'Installs, repairs, room painting',
    examples: ['Paint a room', 'Install ceiling fan', 'Repair drywall'],
  },
  {
    name: 'Projects',
    price: 'Custom Quote',
    description: 'Renovations, landscaping, builds',
    examples: ['Kitchen remodel', 'Deck construction', 'Full home renovation'],
  },
]