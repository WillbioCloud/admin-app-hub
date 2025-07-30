
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { GamificationForm } from './GamificationForm';

interface Gamification {
  id?: string;
  title: string;
  description: string;
  type: 'qr_code' | 'code';
  completion_data: string;
  xp_reward: number;
  coin_reward: number;
  is_active: boolean;
  is_unique: boolean;
  loteamento_id: string;
  location_type: string;
  status?: string;
  created_at?: string;
}

interface GamificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gamification?: Gamification | null;
  onSubmit: (data: any) => void;
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

  const handleSubmit = (data: any) => {
    onSubmit(data);
    onOpenChange(false);
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
            description: gamification.description,
            type: gamification.type,
            completion_data: gamification.completion_data,
            xp_reward: gamification.xp_reward,
            coin_reward: gamification.coin_reward,
            is_active: gamification.is_active,
            is_unique: gamification.is_unique,
            loteamento_id: gamification.loteamento_id,
            location_type: gamification.location_type,
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
