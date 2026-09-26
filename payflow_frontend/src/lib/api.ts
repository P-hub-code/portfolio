const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    let errorMessage = 'Une erreur est survenue lors de la requête.';
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = Array.isArray(errorData.message) ? errorData.message.join(', ') : errorData.message;
      }
    } catch {
      // JSON parsing failed, use fallback
    }
    throw new Error(errorMessage);
  }
  
  // Si ce n'est pas du JSON (ex: 204 No Content), on retourne null
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return null;
};
