import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RewardForm } from './RewardForm';
import { useCreateReward, useUpdateReward, Reward } from '@/hooks/useRewards';
import { useCreateNotification } from '@/hooks/useNotifications';

interface RewardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingReward?: Reward | null;
}

export function RewardDialog({ open, onOpenChange, editingReward }: RewardDialogProps) {
  const createReward = useCreateReward();
  const updateReward = useUpdateReward();
  const createNotification = useCreateNotification();

  const handleSubmit = async (data: any) => {
    try {
      if (editingReward) {
        await updateReward.mutateAsync({
          id: editingReward.id,
          data,
        });
      } else {
        await createReward.mutateAsync(data);
        
        // Criar notificação para novo item na loja
        await createNotification.mutateAsync({
          title: 'Novo item na loja!',
          message: `A recompensa "${data.title}" está agora disponível na loja por ${data.coin_cost} moedas.`,
          type: 'novidade_comercio',
          user_id: null,
          metadata: {
            reward_id: data.id,
            action: 'new_reward',
          },
        });
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving reward:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingReward ? 'Editar Recompensa' : 'Nova Recompensa'}
          </DialogTitle>
        </DialogHeader>

        <RewardForm
          defaultValues={editingReward || undefined}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isEditing={!!editingReward}
        />
      </DialogContent>
    </Dialog>
  );
}