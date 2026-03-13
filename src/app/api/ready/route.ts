import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';

export async function GET() {
  try {
    await prisma.plan.count();
    return NextResponse.json({ ready: true });
  } catch (error) {
    return NextResponse.json({ ready: false, error: 'migrations_not_run' }, { status: 500 });
  }
}
