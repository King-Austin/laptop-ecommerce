import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ImageUploaderProps {
    images: string[];
    onImagesChange: (urls: string[]) => void;
    maxImages?: number;
    bucketName?: string;
}

interface UploadProgress {
    [key: string]: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
    images,
    onImagesChange,
    maxImages = 4,
    bucketName = 'product-images'
}) => {
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = Array.from(e.dataTransfer.files);
        const imageFiles = files.filter(file => file.type.startsWith('image/'));

        if (imageFiles.length > 0) {
            await handleFiles(imageFiles);
        } else {
            toast.error('Please drop only image files');
        }
    };

    const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            await handleFiles(Array.from(files));
        }
    };

    const handleFiles = async (files: File[]) => {
        // Check if adding these files would exceed the limit
        const totalImages = images.length + files.length;
        if (totalImages > maxImages) {
            toast.error(`Maximum ${maxImages} images allowed. You can upload ${maxImages - images.length} more.`);
            return;
        }

        // Validate file types and sizes
        const validFiles = files.filter(file => {
            // Check file type
            if (!file.type.startsWith('image/')) {
                toast.error(`${file.name} is not an image file`);
                return false;
            }

            // Check file size (max 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                toast.error(`${file.name} is too large. Maximum size is 5MB`);
                return false;
            }

            return true;
        });

        if (validFiles.length === 0) return;

        setUploading(true);

        try {
            const uploadPromises = validFiles.map(file => uploadImage(file));
            const uploadedUrls = await Promise.all(uploadPromises);

            // Filter out any failed uploads (null values)
            const successfulUrls = uploadedUrls.filter(url => url !== null) as string[];

            if (successfulUrls.length > 0) {
                onImagesChange([...images, ...successfulUrls]);
                toast.success(`${successfulUrls.length} image(s) uploaded successfully`);
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload images');
        } finally {
            setUploading(false);
            setUploadProgress({});
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const uploadImage = async (file: File): Promise<string | null> => {
        try {
            // Generate unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${fileName}`;

            // Simulate upload progress for better UX
            setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from(bucketName)
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) {
                console.error('Supabase upload error:', error);
                toast.error(`Failed to upload ${file.name}`);
                return null;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from(bucketName)
                .getPublicUrl(filePath);

            setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));

            return publicUrl;
        } catch (error) {
            console.error('Upload error:', error);
            return null;
        }
    };

    const removeImage = async (index: number) => {
        const imageUrl = images[index];

        try {
            // Extract filename from URL
            const urlParts = imageUrl.split('/');
            const fileName = urlParts[urlParts.length - 1];

            // Delete from Supabase Storage (optional - uncomment if you want to delete files)
            // await supabase.storage.from(bucketName).remove([fileName]);

            const newImages = images.filter((_, i) => i !== index);
            onImagesChange(newImages);
            toast.success('Image removed');
        } catch (error) {
            console.error('Error removing image:', error);
            toast.error('Failed to remove image');
        }
    };

    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    const remainingSlots = maxImages - images.length;

    return (
        <Card>
            <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Product Images</h3>
                    <span className="text-sm text-muted-foreground">
                        {images.length}/{maxImages} images
                    </span>
                </div>

                {/* Upload Area */}
                {images.length < maxImages && (
                    <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                                ? 'border-primary bg-primary/5'
                                : 'border-muted-foreground/25 hover:border-primary/50'
                            } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileInput}
                            className="hidden"
                            disabled={uploading}
                        />

                        {uploading ? (
                            <div className="space-y-4">
                                <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
                                <p className="text-sm text-muted-foreground">Uploading images...</p>
                                {Object.entries(uploadProgress).map(([fileName, progress]) => (
                                    <div key={fileName} className="space-y-2">
                                        <p className="text-xs">{fileName}</p>
                                        <Progress value={progress} className="h-2" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">
                                        Drag and drop images here, or{' '}
                                        <button
                                            type="button"
                                            onClick={openFilePicker}
                                            className="text-primary hover:underline"
                                        >
                                            browse
                                        </button>
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        PNG, JPG, JPEG up to 5MB • {remainingSlots} slot{remainingSlots !== 1 ? 's' : ''} remaining
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={openFilePicker}
                                    className="mx-auto"
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Select Files
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* Maximum limit reached message */}
                {images.length >= maxImages && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                        <p className="text-sm font-medium text-orange-800">
                            ⚠️ Maximum limit reached
                        </p>
                        <p className="text-xs text-orange-700 mt-1">
                            Remove an image to upload a new one
                        </p>
                    </div>
                )}

                {/* Image Preview Grid */}
                {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {images.map((url, index) => (
                            <div key={index} className="relative group">
                                <div className="aspect-square rounded-lg border-2 border-muted overflow-hidden bg-muted">
                                    <img
                                        src={url}
                                        alt={`Product image ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Remove button */}
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-destructive/90"
                                >
                                    <X className="w-4 h-4" />
                                </button>

                                {/* Main image badge */}
                                {index === 0 && (
                                    <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
                                        Main Image
                                    </div>
                                )}

                                {/* Image number */}
                                <div className="absolute top-2 left-2 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded">
                                    {index + 1}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Helpful tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800 space-y-1">
                    <p className="font-medium">💡 Tips for great product photos:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Use good lighting and a clean background</li>
                        <li>Show laptop from multiple angles</li>
                        <li>Include close-ups of ports and keyboard</li>
                        <li>First image will be the main display image</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
};

export default ImageUploader;
