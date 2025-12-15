// Get the base URL for the API
const getBaseURL = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  // Remove '/api' from the end to get the base server URL
  return apiUrl.replace('/api', '');
};

// Construct full avatar URL
export const getAvatarUrl = (avatarPath) => {
  if (!avatarPath) return null;
  
  // If it's already a full URL, return as is
  if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
    return avatarPath;
  }
  
  // If it's a relative path, construct the full URL
  const baseUrl = getBaseURL();
  return `${baseUrl}${avatarPath}`;
};

// Get default avatar URL
export const getDefaultAvatar = () => {
  return '/src/assets/images/profile/user-1.jpg';
};