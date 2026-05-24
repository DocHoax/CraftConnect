import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const categories = [
    { id: 'plumbing', name: 'Plumbing', icon: 'Droplets' },
    { id: 'electrical', name: 'Electrical', icon: 'Zap' },
    { id: 'carpentry', name: 'Carpentry', icon: 'Hammer' },
    { id: 'painting', name: 'Painting', icon: 'Paintbrush' },
  ]

  await Promise.all(categories.map((category) => prisma.category.upsert({
    where: { id: category.id },
    update: {
      name: category.name,
      icon: category.icon,
    },
    create: category,
  })))

  console.log('Seed complete')
  console.log(`Categories ensured: ${categories.length}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
