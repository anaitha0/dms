import { format, parseISO, isValid } from 'date-fns';

/**
 * Format a date with a specific format
 * @param {Date|string} date - The date to format
 * @param {string} formatString - The format string (defaults to 'MMM dd, yyyy')
 * @returns {string} The formatted date
 */
export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  if (!date) return '';
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsedDate)) return '';
    return format(parsedDate, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Format file size in bytes to a human-readable format
 * @param {number} bytes - The file size in bytes
 * @param {number} decimals - The number of decimal places
 * @returns {string} The formatted file size
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Truncate a string to a specified length
 * @param {string} str - The string to truncate
 * @param {number} maxLength - The maximum length
 * @returns {string} The truncated string
 */
export const truncateString = (str, maxLength = 50) => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
};

/**
 * Create a debounced function
 * @param {Function} func - The function to debounce
 * @param {number} wait - The debounce time in milliseconds
 * @returns {Function} The debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Generate a random ID
 * @param {number} length - The length of the ID
 * @returns {string} The random ID
 */
export const generateRandomId = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Extract file extension from file name
 * @param {string} filename - The file name
 * @returns {string} The file extension
 */
export const getFileExtension = (filename) => {
  if (!filename) return '';
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase();
};

/**
 * Get file type by extension
 * @param {string} extension - The file extension
 * @returns {string} The file type
 */
export const getFileType = (extension) => {
  switch (extension.toLowerCase()) {
    case 'pdf':
      return 'PDF';
    case 'doc':
    case 'docx':
      return 'DOCX';
    case 'xls':
    case 'xlsx':
      return 'XLS';
    case 'txt':
      return 'TXT';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return 'JPG';
    default:
      return 'Unknown';
  }
};

/**
 * Check if a string is a valid email
 * @param {string} email - The email to validate
 * @returns {boolean} True if email is valid
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Check if a string is empty
 * @param {string} str - The string to check
 * @returns {boolean} True if string is empty
 */
export const isEmpty = (str) => {
  return !str || str.trim().length === 0;
};

/**
 * Check if object is empty
 * @param {object} obj - The object to check
 * @returns {boolean} True if object is empty
 */
export const isEmptyObject = (obj) => {
  return Object.keys(obj).length === 0;
};