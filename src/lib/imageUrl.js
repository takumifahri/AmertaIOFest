export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    const storageUrl = process.env.NEXT_PUBLIC_API_STORAGE_URL;

    // Jika sudah full URL, return as is
    if (imagePath.startsWith('http')) {
        return imagePath;
    }

    // Jika relative path, gabung dengan storage URL
    return `${storageUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};