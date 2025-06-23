import cloudinary from './cloudinary';

export const uploadBufferToCloudinary = async (buffer: Buffer, filename?: string) => {
    const base64 = buffer.toString('base64');
    const dataUri = `data:image/png;base64,${base64}`;

    try {
        const result = await cloudinary.uploader.upload(dataUri, {
            public_id: filename,
            folder: 'metaphor-images',
            resource_type: 'image',
        });
        return result.secure_url; // URL of uploaded image
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        throw new Error('Failed to upload image to Cloudinary');
    }
};
