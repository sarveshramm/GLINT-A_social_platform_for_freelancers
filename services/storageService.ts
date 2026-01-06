
export const StorageService = {
    uploadFile: async (file: File, path: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Resize to max 800px
                    const MAX_SIZE = 800;
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

                    // Compress to JPEG 0.7
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    resolve(dataUrl);
                };
                img.onerror = (e) => reject(new Error("Failed to load image for compression"));
                if (typeof event.target?.result === 'string') {
                    img.src = event.target.result;
                } else {
                    reject(new Error("Invalid file read result"));
                }
            };
            reader.onerror = (e) => reject(e);
            reader.readAsDataURL(file);
        });
    }
};
