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

type Props = { open: boolean; onOpenChange: (v: boolean) => void; language?: string };

export default function ShareManagerDialog({ open, onOpenChange, language = 'vi' }: Props) {
  const [loading, setLoading] = React.useState(false);
  const [items, setItems] = React.useState<ShareRecord[]>([]);
  const [error, setError] = React.useState<string>('');
  const [deletingId, setDeletingId] = React.useState<string>('');
  const { toast } = useToast();
  const { session } = useAuth();
  const T = React.useMemo(() => (i18n as any)[language] || i18n.en, [language]);

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

  // Only depend on session existence (boolean), not reference identity
  const hasSession = !!session;
  React.useEffect(() => { if (open && hasSession) load(); }, [open, hasSession]);

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
        toast({ title: T.shareDeleted || 'Share deleted' });
      } else {
        toast({ variant: 'destructive', title: T.shareDeleteFailed || 'Failed to delete share' });
      }
    } catch (e: any) {
      toast({ variant: 'destructive', title: T.networkError || 'Network error' });
    }
    setDeletingId('');
  };

  if (!session) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{T.manageShares || 'Shared Links'}</DialogTitle>
            <DialogDescription>{T.loginToViewShares || 'Login to view shared links'}</DialogDescription>
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
          <DialogDescription>{T.manageSharesDesc || 'Manage your public shared links'}</DialogDescription>
        </DialogHeader>
        
        {loading && <div className="py-4 text-center text-muted-foreground">{T.loading || 'Loading...'}</div>}
        {error && <div className="py-4 text-center text-destructive">{error}</div>}
        
        {!loading && items.length === 0 && (
          <div className="py-8 text-center text-muted-foreground">
            {T.noSharesYet || 'No shared links yet'}
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
