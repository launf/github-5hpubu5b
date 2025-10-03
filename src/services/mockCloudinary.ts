// Mock Cloudinary service for image uploads
export interface UploadResponse {
  imageUrl: string;
  imagePublicId: string;
}

export const mockCloudinaryUpload = async (file: File): Promise<UploadResponse> => {
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Create a local URL for preview
  const imageUrl = URL.createObjectURL(file);
  
  // Generate a mock public ID
  const imagePublicId = `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  return {
    imageUrl,
    imagePublicId
  };
};

export const mockCloudinaryDelete = async (publicId: string): Promise<boolean> => {
  // Simulate delete delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log(`Deleted image with public ID: ${publicId}`);
  return true;
};
