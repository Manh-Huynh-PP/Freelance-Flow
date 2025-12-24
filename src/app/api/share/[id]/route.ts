import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/supabase-server';
import { deleteShare, updateShare } from '@/lib/supabase-storage';

export const runtime = 'nodejs';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id as string;
    const { id } = await params;
    
    await deleteShare(userId, id);
    
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('[Share Delete Error]', error);
    return NextResponse.json({ error: error.message || 'Failed to delete share' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id as string;
    const { id } = await params;
    const body = await req.json();
    
    const updated = await updateShare(userId, id, body);
    
    if (!updated) {
      return NextResponse.json({ error: 'Share not found' }, { status: 404 });
    }
    
    return NextResponse.json({ ok: true, item: updated });
  } catch (error: any) {
    console.error('[Share Update Error]', error);
    return NextResponse.json({ error: error.message || 'Failed to update share' }, { status: 500 });
  }
}
