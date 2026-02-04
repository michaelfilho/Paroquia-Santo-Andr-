import { useState, useRef } from 'react';
import { Upload, X, CheckCircle } from 'lucide-react';
import { uploadAPI } from '../src/services/api';

interface ImageUploadProps {
  onImageUrlChange: (url: string) => void;
  currentImageUrl?: string;
  label?: string;
}

export function ImageUpload({ onImageUrlChange, currentImageUrl, label = 'Upload de Imagem' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(currentImageUrl || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Apenas imagens são permitidas (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem não pode ter mais de 5MB');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const result = await uploadAPI.uploadImage(file);
      setUploadedUrl(result.imageUrl);
      onImageUrlChange(result.imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer upload');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    setUploadedUrl(null);
    onImageUrlChange('');
    setError(null);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
        />
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full flex items-center justify-center space-x-2 border-2 border-dashed border-amber-300 rounded-lg p-4 hover:bg-amber-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload className="w-5 h-5 text-amber-600" />
          <span className="text-amber-700 font-medium">
            {isUploading ? 'Enviando...' : 'Clique para selecionar uma imagem'}
          </span>
        </button>
      </div>

      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <X className="w-5 h-5 text-red-600" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {uploadedUrl && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm text-green-700">Imagem carregada com sucesso!</span>
          </div>
          <div className="relative w-full h-40 rounded-lg overflow-hidden border border-amber-200">
            <img 
              src={uploadedUrl} 
              alt="Preview" 
              className="w-full h-full object-cover"
              onError={() => {
                console.error('Erro ao carregar imagem:', uploadedUrl);
                setError(`Erro ao carregar imagem. URL: ${uploadedUrl}`);
              }}
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
