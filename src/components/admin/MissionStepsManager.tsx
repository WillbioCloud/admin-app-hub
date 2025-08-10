import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useMissionSteps, useCreateMissionStep, useUpdateMissionStep, useDeleteMissionStep, MissionStep } from '@/hooks/useMissionSteps';

interface MissionStepsManagerProps {
  missionId: string;
}

export function MissionStepsManager({ missionId }: MissionStepsManagerProps) {
  const { data: steps = [], refetch } = useMissionSteps(missionId);
  const createStep = useCreateMissionStep();
  const updateStep = useUpdateMissionStep();
  const deleteStep = useDeleteMissionStep();

  const [isCreating, setIsCreating] = useState(false);
  const [editingStep, setEditingStep] = useState<string | null>(null);
  const [newStep, setNewStep] = useState({
    title: '',
    description: '',
    completion_type: 'qr_code',
    completion_data: '',
    step_xp_reward: 10,
  });
  const [editData, setEditData] = useState<Partial<MissionStep>>({});

  const handleCreateStep = async () => {
    if (!newStep.title || !newStep.completion_data) return;

    await createStep.mutateAsync({
      mission_id: missionId,
      step_number: steps.length + 1,
      title: newStep.title,
      description: newStep.description,
      completion_type: newStep.completion_type,
      completion_data: newStep.completion_data,
      step_xp_reward: newStep.step_xp_reward,
    });

    setNewStep({
      title: '',
      description: '',
      completion_type: 'qr_code',
      completion_data: '',
      step_xp_reward: 10,
    });
    setIsCreating(false);
    refetch();
  };

  const handleEditStep = async (stepId: string) => {
    if (!editData.title || !editData.completion_data) return;

    await updateStep.mutateAsync({
      id: stepId,
      ...editData,
    });

    setEditingStep(null);
    setEditData({});
    refetch();
  };

  const handleDeleteStep = async (stepId: string) => {
    await deleteStep.mutateAsync({ id: stepId, missionId });
    refetch();
  };

  const startEditing = (step: MissionStep) => {
    setEditingStep(step.id);
    setEditData(step);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Passos da Missão ({steps.length})</CardTitle>
          <Button
            onClick={() => setIsCreating(true)}
            disabled={isCreating}
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Passo
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Lista de passos existentes */}
        {steps.map((step, index) => (
          <div key={step.id} className="border rounded-lg p-4">
            {editingStep === step.id ? (
              <div className="space-y-3">
                <div>
                  <Label>Título do Passo {step.step_number}</Label>
                  <Input
                    value={editData.title || ''}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    placeholder="Ex: Escanear QR Code na entrada"
                  />
                </div>
                <div>
                  <Label>Descrição</Label>
                  <Textarea
                    value={editData.description || ''}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    placeholder="Instruções para o usuário..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Tipo de Conclusão</Label>
                    <Select
                      value={editData.completion_type || 'qr_code'}
                      onValueChange={(value) => setEditData({ ...editData, completion_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="qr_code">QR Code</SelectItem>
                        <SelectItem value="code">Código</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>XP Recompensa</Label>
                    <Input
                      type="number"
                      value={editData.step_xp_reward || 0}
                      onChange={(e) => setEditData({ ...editData, step_xp_reward: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Dados de Conclusão</Label>
                  <Input
                    value={editData.completion_data || ''}
                    onChange={(e) => setEditData({ ...editData, completion_data: e.target.value })}
                    placeholder={editData.completion_type === 'qr_code' ? 'URL ou dados do QR' : 'Código secreto'}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleEditStep(step.id)} size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </Button>
                  <Button onClick={() => setEditingStep(null)} variant="outline" size="sm">
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">Passo {step.step_number}</Badge>
                    <Badge variant={step.completion_type === 'qr_code' ? 'default' : 'secondary'}>
                      {step.completion_type === 'qr_code' ? 'QR Code' : 'Código'}
                    </Badge>
                    <Badge variant="outline">{step.step_xp_reward} XP</Badge>
                  </div>
                  <h4 className="font-medium">{step.title}</h4>
                  {step.description && (
                    <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Dados: {step.completion_data}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => startEditing(step)} variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={() => handleDeleteStep(step.id)} 
                    variant="outline" 
                    size="sm"
                    className="hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Formulário para novo passo */}
        {isCreating && (
          <div className="border-2 border-dashed border-primary/20 rounded-lg p-4">
            <h4 className="font-medium mb-3">Novo Passo {steps.length + 1}</h4>
            <div className="space-y-3">
              <div>
                <Label>Título</Label>
                <Input
                  value={newStep.title}
                  onChange={(e) => setNewStep({ ...newStep, title: e.target.value })}
                  placeholder="Ex: Escanear QR Code na entrada"
                />
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea
                  value={newStep.description}
                  onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
                  placeholder="Instruções para o usuário..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tipo de Conclusão</Label>
                  <Select
                    value={newStep.completion_type}
                    onValueChange={(value) => setNewStep({ ...newStep, completion_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="qr_code">QR Code</SelectItem>
                      <SelectItem value="code">Código</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>XP Recompensa</Label>
                  <Input
                    type="number"
                    value={newStep.step_xp_reward}
                    onChange={(e) => setNewStep({ ...newStep, step_xp_reward: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <Label>Dados de Conclusão</Label>
                <Input
                  value={newStep.completion_data}
                  onChange={(e) => setNewStep({ ...newStep, completion_data: e.target.value })}
                  placeholder={newStep.completion_type === 'qr_code' ? 'URL ou dados do QR' : 'Código secreto'}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateStep} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Criar Passo
                </Button>
                <Button onClick={() => setIsCreating(false)} variant="outline" size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}

        {steps.length === 0 && !isCreating && (
          <div className="text-center text-muted-foreground py-8">
            <p>Nenhum passo configurado para esta missão.</p>
            <p className="text-sm">Adicione passos para criar uma experiência mais envolvente!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}