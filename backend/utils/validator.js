/**
 * Validate if a string is a properly formatted URL
 * @param {string} url - The URL to validate
 * @returns {boolean} True if URL is valid
 */
export function validateUrl(url) {
    try {
      // Must start with http:// or https://
      if (!url.match(/^https?:\/\//i)) {
        return false;
      }
      
      // Attempt to create URL object (this will throw if invalid)
      const urlObj = new URL(url);
      
      // Validate the hostname (must have at least one dot)
      if (!urlObj.hostname.includes('.')) {
        return false;
      }
      
      // Additional checks could be added here
      // - Restricted TLDs
      // - Blocked domains
      // - Character limits
      
      return true;
    } catch (e) {
      return false;
    }
  }
  
  /**
   * Validate an email address
   * @param {string} email - The email to validate
   * @returns {boolean} True if email is valid
   */
  export function validateEmail(email) {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  /**
   * Sanitize a string for safe use in HTML
   * @param {string} str - The string to sanitize
   * @returns {string} Sanitized string
   */
  export function sanitizeString(str) {
    if (typeof str !== 'string') {
      return '';
    }
    
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
  
  /**
   * Validate that a value is a non-empty string
   * @param {any} value - The value to check
   * @returns {boolean} True if value is a non-empty string
   */
  export function isNonEmptyString(value) {
    return typeof value === 'string' && value.trim() !== '';
  }
  
  /**
   * Check if a string is a valid date in ISO format
   * @param {string} dateStr - The date string to validate
   * @returns {boolean} True if string is a valid ISO date
   */
  export function isValidISODate(dateStr) {
    if (!dateStr) return false;
    
    const date = new Date(dateStr);
    return !isNaN(date.getTime()) && dateStr.includes('T');
  }