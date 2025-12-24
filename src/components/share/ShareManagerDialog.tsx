"use client";
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { i18n } from '@/lib/i18n';
import { useAuth } from '@/hooks/useAuth';
import { authFetch } from '@/lib/supabase-auth';
import { Link as LinkIcon, Copy, Trash2, ExternalLink } from 'lucide-react';

type ShareRecord = {
  id: string;
  title?: string;
  kind: string;
  createdAt: string;
  expiresAt?: string | null;
};

type Props = { open: boolean; onOpenChange: (v: boolean) => void };

export default function ShareManagerDialog({ open, onOpenChange }: Props) {
  const [loading, setLoading] = React.useState(false);
  const [items, setItems] = React.useState<ShareRecord[]>([]);
  const [error, setError] = React.useState<string>('');
  const [deletingId, setDeletingId] = React.useState<string>('');
  const { toast } = useToast();
  const { session } = useAuth();
  const T = i18n.vi;

  const load = async () => {
    setLoading(true);
    try {
      setError('');
      const res = await authFetch('/api/share/list', { cache: 'no-store', headers: { 'accept': 'application/json' } });
      const data = await res.json();
      if (!res.ok) {
        setItems([]);
        setError(data.error || 'Failed to load shares');
      } else {
        setItems(data.items || []);
      }
    } catch (e: any) {
      setError(e?.message || String(e));
    }
    setLoading(false);
  };

  React.useEffect(() => { if (open && session) load(); }, [open, session]);

  const copyLink = async (id: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/s/${id}`);
      toast({ title: T.linkCopied || 'Link copied' });
    } catch {}
  };

  const deleteShare = async (id: string) => {
    try {
      if (deletingId) return;
      setDeletingId(id);
      const res = await authFetch(`/api/share/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems(prev => prev.filter(x => x.id !== id));
        toast({ title: 'Đã xoá liên kết' });
      } else {
        toast({ variant: 'destructive', title: 'Không xoá được liên kết' });
      }
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Lỗi mạng' });
    }
    setDeletingId('');
  };

  if (!session) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{T.manageShares || 'Shared Links'}</DialogTitle>
            <DialogDescription>Đăng nhập để xem các liên kết đã chia sẻ</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LinkIcon className="w-5 h-5" />
            {T.manageShares || 'Shared Links'}
          </DialogTitle>
          <DialogDescription>Quản lý các liên kết chia sẻ công khai của bạn</DialogDescription>
        </DialogHeader>
        
        {loading && <div className="py-4 text-center text-muted-foreground">Đang tải...</div>}
        {error && <div className="py-4 text-center text-destructive">{error}</div>}
        
        {!loading && items.length === 0 && (
          <div className="py-8 text-center text-muted-foreground">
            Chưa có liên kết nào được chia sẻ
          </div>
        )}
        
        {!loading && items.length > 0 && (
          <div className="space-y-2">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-2 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{item.title || 'Untitled'}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.kind} • {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(`/s/${item.id}`, '_blank')}
                    title="Mở liên kết"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyLink(item.id)}
                    title="Sao chép liên kết"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteShare(item.id)}
                    disabled={deletingId === item.id}
                    title="Xoá liên kết"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
