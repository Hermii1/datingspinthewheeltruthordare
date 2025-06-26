import { NextResponse } from 'next/server'
import prisma from '../../../lib/db'

// GET /api/dare
export async function GET() {
  const dares = await prisma.dareQuestion.findMany()
  return NextResponse.json(dares)
}