import { PrismaClient } from '../generated/prisma'

declare global {
  var prisma: PrismaClient | undefined
}

const prisma = global.prisma || new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['query', 'info', 'warn', 'error'] // Enable logging for debugging
})

if (process.env.NODE_ENV !== 'production') global.prisma = prisma

// Add connection cleanup handler
process.on('beforeExit', async () => {
  if (prisma) {
    await prisma.$disconnect()
  }
})

export default prisma