import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Upload, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ProfilePhotoUploadProps {
  currentPhoto?: string;
  onPhotoChange: (photoUrl: string) => void;
  userName: string;
}

export const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({
  currentPhoto,
  onPhotoChange,
  userName
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(currentPhoto || '');

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      // Simular upload (você pode implementar upload real para Supabase Storage)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Para demonstração, usar URL de placeholder
      const newPhotoUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${userName}`;
      setPhotoUrl(newPhotoUrl);
      onPhotoChange(newPhotoUrl);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Foto de Perfil</CardTitle>
        <CardDescription>
          Atualize sua foto de perfil para personalizar sua conta
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-6">
          <Avatar className="w-24 h-24">
            <AvatarImage src={photoUrl} alt={userName} />
            <AvatarFallback className="text-lg font-bold">
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              JPG, PNG ou GIF. Máximo 5MB.
            </div>
            <div className="flex gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden"
                id="photo-upload"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('photo-upload')?.click()}
                disabled={isUploading}
                className="flex items-center gap-2"
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {isUploading ? 'Enviando...' : 'Escolher Arquivo'}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setPhotoUrl('');
                  onPhotoChange('');
                }}
                disabled={isUploading || !photoUrl}
              >
                Remover
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};