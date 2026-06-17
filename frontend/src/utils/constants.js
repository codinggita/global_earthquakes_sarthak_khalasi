export const API_BASE_URL = '/api/v1';

export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 20,
};

export const MAGNITUDE_RANGES = {
  MINOR: { min: 0, max: 4.0, label: 'Minor/Light', color: '#22c55e' },
  MODERATE: { min: 4.0, max: 5.0, label: 'Moderate', color: '#eab308' },
  STRONG: { min: 5.0, max: 6.0, label: 'Strong', color: '#f97316' },
  MAJOR: { min: 6.0, max: 7.0, label: 'Major', color: '#ef4444' },
  GREAT: { min: 7.0, max: 10.0, label: 'Great', color: '#dc2626' },
};

export const ALERT_LEVELS = ['green', 'yellow', 'orange', 'red'];

export const ALERT_COLORS = {
  green: '#22c55e',
  yellow: '#eab308',
  orange: '#f97316',
  red: '#ef4444',
};

export const STATUS_OPTIONS = ['automatic', 'reviewed'];

export const FELT_INTENSITY_LABELS = {
  1: 'Not Felt',
  2: 'Weak',
  3: 'Weak',
  4: 'Light',
  5: 'Moderate',
  6: 'Strong',
  7: 'Very Strong',
  8: 'Severe',
  9: 'Violent',
  10: 'Extreme',
};

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  EARTHQUAKES: '/earthquakes',
  EARTHQUAKE_DETAIL: '/earthquakes/:id',
  REPORTS: '/reports',
  ANALYTICS: '/analytics',
  PROFILE: '/profile',
  SETTINGS: '/settings',
};

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};
