import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/supabase-server';
import { uploadShare, generateShareId, ShareBlob, ShareRecord } from '@/lib/supabase-storage';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id as string;
    const body = await req.json();
    const { data, taskId } = body;
    
    if (!data || !data.kind) {
      return NextResponse.json({ error: 'Invalid share data' }, { status: 400 });
    }
    
    const shareId = generateShareId();
    const shareBlob: ShareBlob = {
      kind: data.kind,
      schemaVersion: data.schemaVersion || 1,
      data: data,
    };
    
    // Extract title from data
    let title = '';
    if (data.kind === 'quote' && data.task?.name) {
      title = data.task.name;
    } else if (data.kind === 'timeline' && data.task?.name) {
      title = data.task.name;
    } else if (data.kind === 'combined') {
      title = data.timeline?.task?.name || data.quote?.task?.name || '';
    }
    
    const record: ShareRecord = {
      id: shareId,
      userId,
      title,
      kind: data.kind,
      createdAt: new Date().toISOString(),
      expiresAt: null,
      viewCount: 0,
    };
    
    const { url } = await uploadShare(userId, shareId, shareBlob, record);
    
    return NextResponse.json({ ok: true, id: shareId, url });
  } catch (error: any) {
    console.error('[Share Create Error]', error);
    return NextResponse.json({ error: error.message || 'Failed to create share' }, { status: 500 });
  }
}
