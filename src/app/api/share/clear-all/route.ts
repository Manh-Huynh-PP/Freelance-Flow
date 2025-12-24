import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/supabase-server';
import { deleteAllShares } from '@/lib/supabase-storage';

export const runtime = 'nodejs';

export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id as string;
        const success = await deleteAllShares(userId);

        if (success) {
            return NextResponse.json({ ok: true });
        } else {
            return NextResponse.json({ error: 'Failed to delete shares' }, { status: 500 });
        }
    } catch (error: any) {
        console.error('[Share Clear Error]', error);
        return NextResponse.json({ error: error.message || 'Failed to clear shares' }, { status: 500 });
    }
}
