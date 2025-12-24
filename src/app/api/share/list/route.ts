import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/supabase-server';
import { listShares } from '@/lib/supabase-storage';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id as string;
    const items = await listShares(userId);
    
    return NextResponse.json({ ok: true, items });
  } catch (error: any) {
    console.error('[Share List Error]', error);
    return NextResponse.json({ error: error.message || 'Failed to list shares' }, { status: 500 });
  }
}
