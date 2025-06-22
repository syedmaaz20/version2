import { supabase } from '@/lib/supabase';

interface ImageUpdateResult {
  success: boolean;
  profileImageUrl?: string;
  bannerImageUrl?: string;
  error?: string;
}

interface ImageUpdateOptions {
  userId: string;
  profileImage?: File;
  bannerImage?: File;
}

/**
 * Handles student profile and banner image updates with proper cleanup
 * Ensures one-student-one-image policy by deleting old images before uploading new ones
 */
export const updateStudentImages = async ({
  userId,
  profileImage,
  bannerImage
}: ImageUpdateOptions): Promise<ImageUpdateResult> => {
  try {
    const results: ImageUpdateResult = { success: false };

    // Handle profile image update
    if (profileImage) {
      const profileResult = await updateSingleImage({
        userId,
        file: profileImage,
        bucketName: 'profile-pictures',
        filePrefix: 'profile'
      });

      if (!profileResult.success) {
        return {
          success: false,
          error: `Profile image update failed: ${profileResult.error}`
        };
      }

      results.profileImageUrl = profileResult.imageUrl;
    }

    // Handle banner image update
    if (bannerImage) {
      const bannerResult = await updateSingleImage({
        userId,
        file: bannerImage,
        bucketName: 'banner-images',
        filePrefix: 'banner'
      });

      if (!bannerResult.success) {
        return {
          success: false,
          error: `Banner image update failed: ${bannerResult.error}`
        };
      }

      results.bannerImageUrl = bannerResult.imageUrl;
    }

    return {
      success: true,
      profileImageUrl: results.profileImageUrl,
      bannerImageUrl: results.bannerImageUrl
    };

  } catch (error) {
    console.error('Error in updateStudentImages:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

interface SingleImageUpdateOptions {
  userId: string;
  file: File;
  bucketName: string;
  filePrefix: string;
}

interface SingleImageUpdateResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

/**
 * Updates a single image (profile or banner) with proper cleanup
 */
const updateSingleImage = async ({
  userId,
  file,
  bucketName,
  filePrefix
}: SingleImageUpdateOptions): Promise<SingleImageUpdateResult> => {
  try {
    // Step 1: Validate file
    const validationResult = validateImageFile(file, bucketName);
    if (!validationResult.valid) {
      return {
        success: false,
        error: validationResult.error
      };
    }

    // Step 2: Check for existing images and delete them
    const cleanupResult = await cleanupExistingImages(userId, bucketName);
    if (!cleanupResult.success) {
      console.warn(`Cleanup warning for ${bucketName}:`, cleanupResult.error);
      // Continue with upload even if cleanup fails (non-critical)
    }

    // Step 3: Upload new image
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${filePrefix}-${Date.now()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Step 4: Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    if (!urlData.publicUrl) {
      throw new Error('Failed to get public URL for uploaded image');
    }

    return {
      success: true,
      imageUrl: urlData.publicUrl
    };

  } catch (error) {
    console.error(`Error updating ${filePrefix} image:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Validates image file based on bucket requirements
 */
const validateImageFile = (file: File, bucketName: string): { valid: boolean; error?: string } => {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please select a JPEG, PNG, or WebP image.'
    };
  }

  // Check file size based on bucket
  const maxSize = bucketName === 'profile-pictures' ? 5 * 1024 * 1024 : 10 * 1024 * 1024; // 5MB for profile, 10MB for banner
  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    return {
      valid: false,
      error: `File too large. Maximum size is ${maxSizeMB}MB.`
    };
  }

  return { valid: true };
};

/**
 * Cleans up existing images for a user in a specific bucket
 */
const cleanupExistingImages = async (
  userId: string, 
  bucketName: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // List all files in the user's folder
    const { data: files, error: listError } = await supabase.storage
      .from(bucketName)
      .list(userId, {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (listError) {
      throw new Error(`Failed to list existing files: ${listError.message}`);
    }

    if (!files || files.length === 0) {
      // No existing files to clean up
      return { success: true };
    }

    // Delete all existing files
    const filePaths = files.map(file => `${userId}/${file.name}`);
    
    const { error: deleteError } = await supabase.storage
      .from(bucketName)
      .remove(filePaths);

    if (deleteError) {
      throw new Error(`Failed to delete existing files: ${deleteError.message}`);
    }

    console.log(`Successfully cleaned up ${filePaths.length} existing files from ${bucketName}`);
    return { success: true };

  } catch (error) {
    console.error(`Error cleaning up existing images in ${bucketName}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown cleanup error'
    };
  }
};

/**
 * Utility function to get current image URLs for a user
 */
export const getCurrentImageUrls = async (userId: string): Promise<{
  profileImageUrl?: string;
  bannerImageUrl?: string;
}> => {
  const results: { profileImageUrl?: string; bannerImageUrl?: string } = {};

  try {
    // Get profile image
    const { data: profileFiles } = await supabase.storage
      .from('profile-pictures')
      .list(userId, { limit: 1, sortBy: { column: 'created_at', order: 'desc' } });

    if (profileFiles && profileFiles.length > 0) {
      const { data: profileUrl } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(`${userId}/${profileFiles[0].name}`);
      results.profileImageUrl = profileUrl.publicUrl;
    }

    // Get banner image
    const { data: bannerFiles } = await supabase.storage
      .from('banner-images')
      .list(userId, { limit: 1, sortBy: { column: 'created_at', order: 'desc' } });

    if (bannerFiles && bannerFiles.length > 0) {
      const { data: bannerUrl } = supabase.storage
        .from('banner-images')
        .getPublicUrl(`${userId}/${bannerFiles[0].name}`);
      results.bannerImageUrl = bannerUrl.publicUrl;
    }

  } catch (error) {
    console.error('Error getting current image URLs:', error);
  }

  return results;
};