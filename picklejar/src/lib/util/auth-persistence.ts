// Authentication persistence utility
export const AUTH_KEYS = {
  USER: {
    ACCESS_TOKEN: "accessToken",
    REFRESH_TOKEN: "refreshToken",
    USER_DATA: "user",
  },
  ADMIN: {
    ACCESS_TOKEN: "adminAccessToken",
    REFRESH_TOKEN: "adminRefreshToken",
    USER_DATA: "adminUser",
  },
} as const;

// Safe localStorage access
export const getLocalStorage = (key: string): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
  return null;
};

export const setLocalStorage = (key: string, value: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value);
  }
};

export const removeLocalStorage = (key: string): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};

// Check if user is authenticated
export const isUserAuthenticated = (): boolean => {
  const token = getLocalStorage(AUTH_KEYS.USER.ACCESS_TOKEN);
  const user = getLocalStorage(AUTH_KEYS.USER.USER_DATA);
  return !!(token && user);
};

// Check if admin is authenticated
export const isAdminAuthenticated = (): boolean => {
  const token = getLocalStorage(AUTH_KEYS.ADMIN.ACCESS_TOKEN);
  const admin = getLocalStorage(AUTH_KEYS.ADMIN.USER_DATA);
  return !!(token && admin);
};

// Get current user data
export const getCurrentUser = () => {
  const userData = getLocalStorage(AUTH_KEYS.USER.USER_DATA);
  return userData ? JSON.parse(userData) : null;
};

// Get current admin data
export const getCurrentAdmin = () => {
  const adminData = getLocalStorage(AUTH_KEYS.ADMIN.USER_DATA);
  return adminData ? JSON.parse(adminData) : null;
};

// Clear all authentication data
export const clearAllAuth = () => {
  Object.values(AUTH_KEYS.USER).forEach((key) => removeLocalStorage(key));
  Object.values(AUTH_KEYS.ADMIN).forEach((key) => removeLocalStorage(key));
};

// Clear user authentication only
export const clearUserAuth = () => {
  Object.values(AUTH_KEYS.USER).forEach((key) => removeLocalStorage(key));
};

// Clear admin authentication only
export const clearAdminAuth = () => {
  Object.values(AUTH_KEYS.ADMIN).forEach((key) => removeLocalStorage(key));
};
