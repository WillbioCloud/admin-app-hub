
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { GamificationForm } from './GamificationForm';
import { useCreateGamification, useUpdateGamification, Gamification } from '@/hooks/useGamifications';

interface GamificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gamification?: Gamification | null;
  onSubmit: () => void;
  userRole?: 'admin' | 'comerciante';
}

export function GamificationDialog({
  open,
  onOpenChange,
  gamification,
  onSubmit,
  userRole = 'comerciante'
}: GamificationDialogProps) {
  const isEditing = !!gamification;
  const createGamification = useCreateGamification();
  const updateGamification = useUpdateGamification();

  const handleSubmit = async (data: any) => {
    try {
      if (isEditing && gamification) {
        await updateGamification.mutateAsync({ id: gamification.id, data });
      } else {
        await createGamification.mutateAsync(data);
      }
      onSubmit();
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting gamification:', error);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar' : 'Criar Nova'} Gamificação
          </DialogTitle>
          <DialogDescription>
            {userRole === 'admin' 
              ? `${isEditing ? 'Edite' : 'Crie'} uma nova missão que será disponibilizada no aplicativo.`
              : `${isEditing ? 'Edite' : 'Preencha'} os dados da ${isEditing ? 'missão' : 'nova missão'}. ${!isEditing ? 'Ela será enviada para aprovação do administrador.' : ''}`
            }
          </DialogDescription>
        </DialogHeader>
        
        <GamificationForm
          defaultValues={gamification ? {
            title: gamification.title,
            description: gamification.description || '',
            type: gamification.type as "qr_code" | "code",
            completion_data: gamification.completion_data,
            xp_reward: gamification.xp_reward,
            coin_reward: gamification.coin_reward,
            is_active: gamification.is_active,
            is_unique: gamification.is_unique,
            loteamento_id: gamification.loteamento_id || '',
            location_type: gamification.location_type || '',
          } : undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEditing={isEditing}
          userRole={userRole}
        />
      </DialogContent>
    </Dialog>
  );
}
