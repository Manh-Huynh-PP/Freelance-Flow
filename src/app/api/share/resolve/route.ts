import { NextRequest, NextResponse } from 'next/server';
import { downloadShare } from '@/lib/supabase-storage';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Missing share ID' }, { status: 400 });
    }
    
    const shareData = await downloadShare(id);
    
    if (!shareData) {
      return NextResponse.json({ error: 'Share not found' }, { status: 404 });
    }
    
    return NextResponse.json(shareData);
  } catch (error: any) {
    console.error('[Share Resolve Error]', error);
    return NextResponse.json({ error: error.message || 'Failed to resolve share' }, { status: 500 });
  }
}
