import { MAGNITUDE_RANGES, ALERT_COLORS, FELT_INTENSITY_LABELS } from './constants';

/**
 * Format a date string or Date object to a readable format.
 */
export const formatDate = (date, options = {}) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';

  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  };

  return d.toLocaleDateString('en-US', defaultOptions);
};

/**
 * Format a date to relative time (e.g., "2 hours ago").
 */
export const formatRelativeTime = (date) => {
  if (!date) return 'N/A';
  const now = new Date();
  const d = new Date(date);
  const diffMs = now - d;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date, { hour: undefined, minute: undefined });
};

/**
 * Format magnitude with color classification.
 */
export const formatMagnitude = (mag) => {
  if (mag === null || mag === undefined) return { value: 'N/A', color: '#94a3b8' };

  const num = parseFloat(mag);
  let color = '#94a3b8';

  if (num >= 7.0) color = MAGNITUDE_RANGES.GREAT.color;
  else if (num >= 6.0) color = MAGNITUDE_RANGES.MAJOR.color;
  else if (num >= 5.0) color = MAGNITUDE_RANGES.STRONG.color;
  else if (num >= 4.0) color = MAGNITUDE_RANGES.MODERATE.color;
  else color = MAGNITUDE_RANGES.MINOR.color;

  return { value: num.toFixed(1), color };
};

/**
 * Get magnitude classification label.
 */
export const getMagnitudeLabel = (mag) => {
  const num = parseFloat(mag);
  if (num >= 7.0) return 'Great';
  if (num >= 6.0) return 'Major';
  if (num >= 5.0) return 'Strong';
  if (num >= 4.0) return 'Moderate';
  return 'Minor';
};

/**
 * Get alert level color.
 */
export const getAlertColor = (alert) => {
  return ALERT_COLORS[alert] || '#94a3b8';
};

/**
 * Format coordinates [longitude, latitude, depth] to readable string.
 */
export const formatCoordinates = (coords) => {
  if (!coords || !Array.isArray(coords) || coords.length < 2) return 'N/A';

  const [lng, lat, depth] = coords;
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';

  let result = `${Math.abs(lat).toFixed(3)}°${latDir}, ${Math.abs(lng).toFixed(3)}°${lngDir}`;
  if (depth !== undefined && depth !== null) {
    result += ` · ${depth.toFixed(1)} km deep`;
  }
  return result;
};

/**
 * Format large numbers with K/M suffix.
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

/**
 * Get felt intensity label.
 */
export const getIntensityLabel = (intensity) => {
  return FELT_INTENSITY_LABELS[intensity] || 'Unknown';
};

/**
 * Truncate text with ellipsis.
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get month name from month number.
 */
export const getMonthName = (monthNumber) => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return months[(monthNumber - 1) % 12] || 'Unknown';
};
