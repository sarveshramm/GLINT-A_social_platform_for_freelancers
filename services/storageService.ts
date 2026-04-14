
import { supabase } from './supabaseClient';

export const StorageService = {
    uploadFile: async (file: File, path: string): Promise<string> => {
        // Generate unique filename
        const ext = file.name.split('.').pop() || 'jpg';
        const fileName = `${path}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;

        try {
            // Try Supabase Storage first
            const { data, error } = await supabase.storage
                .from('glint-uploads')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: true,
                });

            if (error) {
                console.warn('Supabase Storage upload failed, using fallback:', error.message);
                return StorageService.compressToDataUrl(file);
            }

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('glint-uploads')
                .getPublicUrl(data.path);

            return urlData.publicUrl;
        } catch (err) {
            console.warn('Storage upload exception, using fallback:', err);
            return StorageService.compressToDataUrl(file);
        }
    },

    /**
     * Fallback: Compress image to data URL and store in DB directly
     * Works even without Supabase Storage configured
     */
    compressToDataUrl: (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            // For video files, just read as data URL (no compression)
            if (file.type.startsWith('video/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (typeof e.target?.result === 'string') {
                        resolve(e.target.result);
                    } else {
                        reject(new Error('Failed to read video file'));
                    }
                };
                reader.onerror = () => reject(new Error('Failed to read file'));
                reader.readAsDataURL(file);
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Resize to max 1200px for better quality
                    const MAX_SIZE = 1200;
                    if (width > height) {
                        if (width > MAX_SIZE) {
                            height *= MAX_SIZE / width;
                            width = MAX_SIZE;
                        }
                    } else {
                        if (height > MAX_SIZE) {
                            width *= MAX_SIZE / height;
                            height = MAX_SIZE;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error("Could not get canvas context"));
                        return;
                    }
                    ctx.drawImage(img, 0, 0, width, height);

                    // Compress to JPEG 0.8 quality
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                    resolve(dataUrl);
                };
                img.onerror = () => reject(new Error("Failed to load image for compression"));
                if (typeof event.target?.result === 'string') {
                    img.src = event.target.result;
                } else {
                    reject(new Error("Invalid file read result"));
                }
            };
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsDataURL(file);
        });
    }
};
