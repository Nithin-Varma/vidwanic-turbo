// Utility function to convert Google Drive sharing link to direct image URL
export function convertGoogleDriveUrl(url: string): string {
  if (!url) return url;
  
  // Check if it's already a direct image URL
  if (url.includes('lh3.googleusercontent.com') || url.includes('drive.google.com/uc')) {
    return url;
  }
  
  // Extract file ID from Google Drive sharing URL
  const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
  if (fileIdMatch) {
    const fileId = fileIdMatch[1];
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }
  
  // If it's already a direct URL, return as is
  return url;
}

// Utility function to check if URL is a Google Drive link
export function isGoogleDriveUrl(url: string): boolean {
  return url.includes('drive.google.com') || url.includes('docs.google.com');
}
