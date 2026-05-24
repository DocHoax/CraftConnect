import { BookingStatus, PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const defaultPasswordHash = await bcrypt.hash('password123', 10)

  await prisma.payment.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.review.deleteMany()
  await prisma.artisanProfile.deleteMany()
  await prisma.user.deleteMany()
  await prisma.category.deleteMany()

  const categories = await Promise.all([
    prisma.category.create({ data: { id: 'plumbing', name: 'Plumbing', icon: 'Droplets' } }),
    prisma.category.create({ data: { id: 'electrical', name: 'Electrical', icon: 'Zap' } }),
    prisma.category.create({ data: { id: 'carpentry', name: 'Carpentry', icon: 'Hammer' } }),
    prisma.category.create({ data: { id: 'painting', name: 'Painting', icon: 'Paintbrush' } }),
  ])

  const customer = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'customer@example.com',
      passwordHash: defaultPasswordHash,
      role: Role.CUSTOMER,
    },
  })

  const artisanUser1 = await prisma.user.create({
    data: {
      name: 'Maria Johnson',
      email: 'maria@example.com',
      passwordHash: defaultPasswordHash,
      role: Role.ARTISAN,
    },
  })

  const artisanUser2 = await prisma.user.create({
    data: {
      name: 'James Miller',
      email: 'james@example.com',
      passwordHash: defaultPasswordHash,
      role: Role.ARTISAN,
    },
  })

  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: defaultPasswordHash,
      role: Role.ADMIN,
    },
  })

  const artisan1 = await prisma.artisanProfile.create({
    data: {
      userId: artisanUser1.id,
      categoryId: categories.find((c) => c.id === 'electrical')!.id,
      location: 'Downtown',
      priceMin: 45,
      priceMax: 80,
      experience: 8,
      image: '/images/artisan-1.jpg',
      description: 'Licensed electrician with residential and commercial experience.',
      verified: true,
      services: ['Wiring', 'Panel Upgrades', 'Lighting Installation', 'Troubleshooting'],
      availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      rating: 4.9,
      reviewsCount: 2,
    },
  })

  const artisan2 = await prisma.artisanProfile.create({
    data: {
      userId: artisanUser2.id,
      categoryId: categories.find((c) => c.id === 'plumbing')!.id,
      location: 'Midtown',
      priceMin: 50,
      priceMax: 90,
      experience: 12,
      image: '/images/artisan-2.jpg',
      description: 'Master plumber focused on repairs and renovations.',
      verified: true,
      services: ['Leak Repair', 'Pipe Installation', 'Drain Cleaning'],
      availability: ['Mon', 'Wed', 'Thu', 'Sat', 'Sun'],
      rating: 4.8,
      reviewsCount: 1,
    },
  })

  await prisma.review.createMany({
    data: [
      {
        customerId: customer.id,
        artisanId: artisan1.id,
        rating: 5,
        comment: 'Excellent work and very professional.',
      },
      {
        customerId: customer.id,
        artisanId: artisan1.id,
        rating: 4,
        comment: 'Great service, arrived on time.',
      },
      {
        customerId: customer.id,
        artisanId: artisan2.id,
        rating: 5,
        comment: 'Solved the leak quickly.',
      },
    ],
  })

  await prisma.booking.createMany({
    data: [
      {
        customerId: customer.id,
        artisanId: artisan1.id,
        service: 'Electrical Wiring Repair',
        date: '2026-03-20',
        time: '10:00 AM',
        location: '123 Main St, Downtown',
        notes: 'Check living room wiring',
        price: 120,
        status: BookingStatus.PENDING,
      },
      {
        customerId: customer.id,
        artisanId: artisan2.id,
        service: 'Leak Repair',
        date: '2026-03-18',
        time: '02:00 PM',
        location: '123 Main St, Downtown',
        price: 85,
        status: BookingStatus.CONFIRMED,
      },
      {
        customerId: customer.id,
        artisanId: artisan1.id,
        service: 'Lighting Installation',
        date: '2026-03-10',
        time: '11:00 AM',
        location: '123 Main St, Downtown',
        price: 95,
        status: BookingStatus.COMPLETED,
      },
    ],
  })

  console.log('Seed complete')
  console.log('Demo users:')
  console.log(`- customer@example.com / password123 (${customer.id})`)
  console.log(`- maria@example.com / password123 (${artisanUser1.id})`)
  console.log(`- admin@example.com / password123 (${adminUser.id})`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
