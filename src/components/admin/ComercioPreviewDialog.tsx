import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ComercioPreview } from './ComercioPreview';
import { Comercio } from '@/hooks/useComercios';
import { Edit, Save, X } from 'lucide-react';

interface ComercioPreviewDialogProps {
  comercio: Comercio | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: () => void;
}

export function ComercioPreviewDialog({ comercio, open, onOpenChange, onUpdate }: ComercioPreviewDialogProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (!comercio) return null;

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveSuccess = () => {
    setIsEditing(false);
    onUpdate?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>
              {isEditing ? 'Editar Comércio' : 'Visualizar Comércio'}: {comercio.nome}
            </DialogTitle>
            <div className="flex gap-2">
              <Button 
                variant={isEditing ? "destructive" : "outline"} 
                size="sm"
                onClick={handleEditToggle}
              >
                {isEditing ? (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogHeader>
        <ComercioPreview 
          comercio={comercio} 
          isEditing={isEditing}
          onSaveSuccess={handleSaveSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}