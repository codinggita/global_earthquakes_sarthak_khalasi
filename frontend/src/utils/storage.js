// ============================================
// localStorage utilities (persistent)
// ============================================

export const getToken = () => {
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
};

export const setToken = (token) => {
  try {
    localStorage.setItem('token', token);
  } catch (e) {
    console.error('Failed to save token:', e);
  }
};

export const removeToken = () => {
  try {
    localStorage.removeItem('token');
  } catch (e) {
    console.error('Failed to remove token:', e);
  }
};

export const getTheme = () => {
  try {
    return localStorage.getItem('theme') || 'light';
  } catch {
    return 'light';
  }
};

export const setTheme = (theme) => {
  try {
    localStorage.setItem('theme', theme);
  } catch (e) {
    console.error('Failed to save theme:', e);
  }
};

export const getUserSession = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const setUserSession = (user) => {
  try {
    localStorage.setItem('user', JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save user session:', e);
  }
};

export const removeUserSession = () => {
  try {
    localStorage.removeItem('user');
  } catch (e) {
    console.error('Failed to remove user session:', e);
  }
};

export const clearAuth = () => {
  removeToken();
  removeUserSession();
};

// ============================================
// sessionStorage utilities (temporary)
// ============================================

export const setTempFilters = (filters) => {
  try {
    sessionStorage.setItem('tempFilters', JSON.stringify(filters));
  } catch (e) {
    console.error('Failed to save filters:', e);
  }
};

export const getTempFilters = () => {
  try {
    const filters = sessionStorage.getItem('tempFilters');
    return filters ? JSON.parse(filters) : null;
  } catch {
    return null;
  }
};

export const setFormProgress = (formId, data) => {
  try {
    sessionStorage.setItem(`form_${formId}`, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save form progress:', e);
  }
};

export const getFormProgress = (formId) => {
  try {
    const data = sessionStorage.getItem(`form_${formId}`);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const clearFormProgress = (formId) => {
  try {
    sessionStorage.removeItem(`form_${formId}`);
  } catch (e) {
    console.error('Failed to clear form progress:', e);
  }
};
