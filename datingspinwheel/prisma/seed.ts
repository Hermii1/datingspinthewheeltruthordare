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
        { question: "What's something you've never told anyone?", rating: "spicy" },
        { question: "What's your favorite childhood memory?", rating: "mild" },
        { question: "What's the last thing you Googled?", rating: "mild" },
        { question: "What's your guilty pleasure?", rating: "mild" },
        { question: "Have you ever lied to get out of trouble?", rating: "medium" },
        { question: "What's something you've done that you hope no one finds out about?", rating: "medium" },
        { question: "What's your wildest fantasy?", rating: "spicy" },
        { question: "What's the most inappropriate place you've been turned on?", rating: "spicy" }
      ],
      skipDuplicates: true
    })

    console.log('Seeding Dare challenges...')
    await prisma.dareQuestion.createMany({
      data: [
        { challenge: "Sing a song in a silly voice", rating: "mild" },
        { challenge: "Let someone style your hair", rating: "medium" },
        { challenge: "Eat a spoonful of hot sauce", rating: "spicy" },
        { challenge: "Give your partner a 1-minute shoulder massage", rating: "mild" },
        { challenge: "Whisper something sweet in your partner's ear", rating: "mild" },
        { challenge: "Slow dance together for 30 seconds", rating: "mild" },
        { challenge: "Feed each other a snack blindfolded", rating: "mild" },
        { challenge: "Recreate your first kiss", rating: "mild" },
        { challenge: "Exchange shirts for the next 10 minutes", rating: "mild" },
        { challenge: "Hold hands and stare into each other's eyes for 30 seconds without laughing", rating: "mild" },
        { challenge: "Describe what you first found attractive about your partner", rating: "mild" },
        { challenge: "Let your partner style your hair however they want", rating: "mild" },
        { challenge: "Sing a love song to each other", rating: "mild" },

        // Medium Dares
        { challenge: "Kiss your partner without using your hands", rating: "medium" },
        { challenge: "Give your partner a lap dance for 15 seconds", rating: "medium" },
        { challenge: "Wear your partner's clothes for the rest of the game", rating: "medium" },
        { challenge: "Whisper your fantasy in your partner's ear", rating: "medium" },
        { challenge: "Let your partner draw a temporary tattoo on you", rating: "medium" },
        { challenge: "Reenact a romantic movie scene together", rating: "medium" },
        { challenge: "Play '7 Minutes in Heaven' (hide in a closet together for 7 minutes)", rating: "medium" },
        { challenge: "Blindfold your partner and feed them something surprising", rating: "medium" },
        { challenge: "Describe your partner using only 3 sexy words", rating: "medium" },
        { challenge: "Let your partner control your phone for 5 minutes", rating: "medium" },

        // Spicy Dares
        { challenge: "Give your partner a sensual kiss on the neck", rating: "spicy" },
        { challenge: "Undo one piece of your partner's clothing with your teeth", rating: "spicy" },
        { challenge: "Let your partner handcuff you for the next round", rating: "spicy" },
        { challenge: "Exchange one secret fantasy you've never shared", rating: "spicy" },
        { challenge: "Take a body shot off your partner", rating: "spicy" },
        { challenge: "Play 'Strip Truth or Dare' (remove an item of clothing for every skipped turn)", rating: "spicy" },
        { challenge: "Recreate your hottest memory together", rating: "spicy" },
        { challenge: "Let your partner choose your underwear for tomorrow", rating: "spicy" },
        { challenge: "Whisper what you want to do to them later", rating: "spicy" },
        { challenge: "Agree to fulfill one request from your partner tonight", rating: "spicy" }
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