import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, Loader2, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { mockCloudinaryUpload } from '@/services/mockCloudinary';

interface ImageUploadProps {
  currentImageUrl?: string;
  userName: string;
  onUploadComplete: (imageUrl: string, publicId: string) => void;
  disabled?: boolean;
}

const ImageUpload = ({ currentImageUrl, userName, onUploadComplete, disabled }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File',
        description: 'Please select an image file',
        variant: 'destructive'
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Image must be less than 5MB',
        variant: 'destructive'
      });
      return;
    }

    setIsUploading(true);

    try {
      // Show immediate preview
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);

      // Simulate upload to Cloudinary
      const result = await mockCloudinaryUpload(file);
      
      onUploadComplete(result.imageUrl, result.imagePublicId);
      
      toast({
        title: 'Upload Successful',
        description: 'Your profile picture has been updated'
      });
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive'
      });
      setPreviewUrl(currentImageUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(undefined);
    onUploadComplete('', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getInitials = () => {
    return userName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="w-32 h-32">
          <AvatarImage src={previewUrl} alt={userName} />
          <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
        </Avatar>
        
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {previewUrl && !isUploading && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 rounded-full h-8 w-8"
            onClick={handleRemoveImage}
            disabled={disabled}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
        >
          <Upload className="w-4 h-4 mr-2" />
          {previewUrl ? 'Change Picture' : 'Upload Picture'}
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      <p className="text-xs text-muted-foreground text-center max-w-xs">
        Recommended: Square image, at least 400x400px. Max size: 5MB
      </p>
    </div>
  );
};

export default ImageUpload;
