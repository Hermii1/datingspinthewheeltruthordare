import { NextResponse } from 'next/server'
import prisma from '../../../lib/db'

// GET /api/truth
export async function GET() {
  const questions = await prisma.truthQuestion.findMany()
  return NextResponse.json(questions)
}

// POST /api/truth (example for adding questions)
export async function POST(request: Request) {
  const { question, rating } = await request.json()
  const newQuestion = await prisma.truthQuestion.create({
    data: { question, rating }
  })
  return NextResponse.json(newQuestion, { status: 201 })
}