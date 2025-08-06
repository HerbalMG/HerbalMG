/**
 * Generate a URL-friendly slug from a name
 * @param {string} name - The name to convert to slug
 * @returns {string} - URL-friendly slug
 */
function generateSlug(name) {
  if (!name) return '';
  
  return name
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Convert slug back to a searchable name format
 * @param {string} slug - The slug to convert
 * @returns {string} - Name format for database search
 */
function slugToName(slug) {
  if (!slug) return '';
  
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Check if a string is a valid slug format
 * @param {string} str - String to check
 * @returns {boolean} - True if it's a slug format
 */
function isSlugFormat(str) {
  return /^[a-z0-9-]+$/.test(str) && !str.includes(' ');
}

/**
 * Check if a string is numeric (ID format)
 * @param {string} str - String to check
 * @returns {boolean} - True if it's numeric
 */
function isNumericId(str) {
  return /^\d+$/.test(str);
}

module.exports = {
  generateSlug,
  slugToName,
  isSlugFormat,
  isNumericId
};
