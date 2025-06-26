import { PrismaClient } from '../src/generated/prisma'

// Initialize with explicit connection settings
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

async function main() {
  try {
    console.log('Resetting database connection...')
    await prisma.$executeRaw`DEALLOCATE ALL` // Clear any prepared statements

    console.log('Clearing existing data...')
    await prisma.$transaction([
      prisma.truthQuestion.deleteMany(),
      prisma.dareQuestion.deleteMany()
    ])

    console.log('Seeding Truth questions...')
    await prisma.truthQuestion.createMany({
      data: [
        { question: "What's your most embarrassing moment?", rating: "medium" },
        { question: "Have you ever lied to get out of trouble?", rating: "mild" },
        { question: "What's something you've never told anyone?", rating: "spicy" }
      ],
      skipDuplicates: true
    })

    console.log('Seeding Dare challenges...')
    await prisma.dareQuestion.createMany({
      data: [
        { challenge: "Sing a song in a silly voice", rating: "mild" },
        { challenge: "Let someone style your hair", rating: "medium" },
        { challenge: "Eat a spoonful of hot sauce", rating: "spicy" }
      ],
      skipDuplicates: true
    })

    console.log('✅ Seeding completed successfully!')
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()