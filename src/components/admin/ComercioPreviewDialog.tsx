import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ComercioPreview } from './ComercioPreview';
import { Comercio } from '@/hooks/useComercios';

interface ComercioPreviewDialogProps {
  comercio: Comercio | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ComercioPreviewDialog({ comercio, open, onOpenChange }: ComercioPreviewDialogProps) {
  if (!comercio) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Visualizar Comércio: {comercio.nome}</DialogTitle>
        </DialogHeader>
        <ComercioPreview comercio={comercio} />
      </DialogContent>
    </Dialog>
  );
}