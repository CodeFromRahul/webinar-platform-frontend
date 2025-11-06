import { NextRequest, NextResponse } from 'next/server';
import { generateUserToken } from '@/lib/getstream';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Generate token valid for 1 hour
    const token = generateUserToken(userId, 3600);

    return NextResponse.json({ token, userId });
  } catch (error) {
    console.error('Failed to generate Stream token:', error);
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    );
  }
}
