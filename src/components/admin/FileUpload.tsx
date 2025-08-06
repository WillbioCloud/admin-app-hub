import React, { useState, useRef } from 'react';
import { Upload, X, Wand2, Loader2, Image as ImageIcon, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { removeBackground, loadImage } from '@/lib/backgroundRemoval';

interface FileUploadProps {
  onFileUploaded: (url: string) => void;
  acceptedTypes: string[];
  bucketId: string;
  maxSize: number;
  label: string;
  description?: string;
  showBackgroundRemoval?: boolean;
  currentValue?: string;
}

export default function FileUpload({
  onFileUploaded,
  acceptedTypes,
  bucketId,
  maxSize,
  label,
  description,
  showBackgroundRemoval = false,
  currentValue
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [removingBackground, setRemovingBackground] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentValue || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isVideo = (file: File) => file.type.startsWith('video/');
  const isImage = (file: File) => file.type.startsWith('image/');

  const handleFile = async (file: File) => {
    if (!file) return;

    // Validar tipo de arquivo
    if (!acceptedTypes.includes(file.type)) {
      toast.error(`Tipo de arquivo não suportado. Aceitos: ${acceptedTypes.join(', ')}`);
      return;
    }

    // Validar tamanho
    if (file.size > maxSize) {
      toast.error(`Arquivo muito grande. Máximo: ${(maxSize / 1024 / 1024).toFixed(1)}MB`);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload para o Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucketId)
        .upload(filePath, file);

      if (error) throw error;

      // Simular progresso para UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 100);

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from(bucketId)
        .getPublicUrl(data.path);

      setPreviewUrl(publicUrl);
      onFileUploaded(publicUrl);
      toast.success('Arquivo enviado com sucesso!');

    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error('Erro ao enviar arquivo');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleBackgroundRemoval = async () => {
    if (!fileInputRef.current?.files?.[0]) {
      toast.error('Selecione uma imagem primeiro');
      return;
    }

    const file = fileInputRef.current.files[0];
    
    if (!isImage(file)) {
      toast.error('Remoção de fundo funciona apenas com imagens');
      return;
    }

    setRemovingBackground(true);
    
    try {
      const imageElement = await loadImage(file);
      const processedBlob = await removeBackground(imageElement);
      
      // Criar novo arquivo com fundo removido
      const processedFile = new File([processedBlob], `removed-bg-${file.name}`, {
        type: 'image/png'
      });

      await handleFile(processedFile);
      toast.success('Fundo removido com sucesso!');
      
    } catch (error) {
      console.error('Erro na remoção de fundo:', error);
      toast.error('Erro ao remover fundo da imagem');
    } finally {
      setRemovingBackground(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const removeFile = () => {
    setPreviewUrl(null);
    onFileUploaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">{label}</label>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      
      {previewUrl ? (
        <div className="relative">
          <div className="border rounded-lg p-4 bg-muted/50">
            {previewUrl.includes('.mp4') || previewUrl.includes('.mov') || previewUrl.includes('.avi') ? (
              <div className="flex items-center gap-3">
                <Video className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Vídeo carregado</p>
                  <p className="text-xs text-muted-foreground">Clique para visualizar</p>
                </div>
              </div>
            ) : (
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="max-w-full h-32 object-contain rounded"
              />
            )}
          </div>
          <Button
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2"
            onClick={removeFile}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="hidden"
          />
          
          <div className="space-y-4">
            {uploading ? (
              <div className="space-y-2">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="text-sm text-muted-foreground">Enviando arquivo...</p>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    Arraste um arquivo aqui ou clique para selecionar
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Máximo: {(maxSize / 1024 / 1024).toFixed(1)}MB
                  </p>
                </div>
              </>
            )}
          </div>
          
          {!uploading && (
            <div className="flex gap-2 justify-center mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Selecionar Arquivo
              </Button>
              
              {showBackgroundRemoval && acceptedTypes.some(type => type.startsWith('image/')) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackgroundRemoval}
                  disabled={uploading || removingBackground}
                >
                  {removingBackground ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Wand2 className="h-4 w-4 mr-2" />
                  )}
                  Remover Fundo
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}