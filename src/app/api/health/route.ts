import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    return NextResponse.json({ status: 'error', error: 'db_unreachable' }, { status: 500 });
  }
}
