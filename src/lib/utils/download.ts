import { browser } from '$app/environment';

export const downloadFile = async (filePath: string) => {
  if (!browser) return;

  try {
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = filePath;
    link.download = filePath.split('/').pop() || 'cv.pdf';
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  } catch (err) {
    console.error('Failed to download file:', err);
  }
};