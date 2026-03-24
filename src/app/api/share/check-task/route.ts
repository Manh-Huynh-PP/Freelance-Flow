import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/supabase-server';
import { findShareByTaskId } from '@/lib/supabase-storage';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const taskId = req.nextUrl.searchParams.get('taskId');
    if (!taskId) {
      return NextResponse.json({ error: 'taskId is required' }, { status: 400 });
    }

    const userId = session.user.id as string;
    const existingShare = await findShareByTaskId(userId, taskId);

    return NextResponse.json({ ok: true, existingShare: existingShare || null });
  } catch (error: any) {
    console.error('[Share Check Task Error]', error);
    return NextResponse.json({ error: error.message || 'Failed to check share' }, { status: 500 });
  }
}
