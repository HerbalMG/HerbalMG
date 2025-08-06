/**
 * Utility functions for creating and handling slugs
 */

/**
 * Create a URL-friendly slug from a string
 * @param {string} text - The text to convert to slug
 * @returns {string} - URL-friendly slug
 */
export const createSlug = (text) => {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove special characters except hyphens
    .replace(/[^\w\-]+/g, '')
    // Replace multiple hyphens with single hyphen
    .replace(/\-\-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

/**
 * Convert slug back to readable text
 * @param {string} slug - The slug to convert
 * @returns {string} - Readable text
 */
export const slugToText = (slug) => {
  if (!slug) return '';
  
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Create brand slug with prefix
 * @param {string} brandName - Brand name
 * @param {number} brandId - Brand ID (optional)
 * @returns {string} - Brand slug
 */
export const createBrandSlug = (brandName, brandId = null) => {
  const baseSlug = createSlug(brandName);
  return brandId ? `${baseSlug}-${brandId}` : baseSlug;
};

/**
 * Create category slug with prefix
 * @param {string} categoryName - Category name
 * @param {number} categoryId - Category ID (optional)
 * @returns {string} - Category slug
 */
export const createCategorySlug = (categoryName, categoryId = null) => {
  const baseSlug = createSlug(categoryName);
  return categoryId ? `${baseSlug}-${categoryId}` : baseSlug;
};

/**
 * Create disease slug with prefix
 * @param {string} diseaseName - Disease name
 * @param {number} diseaseId - Disease ID (optional)
 * @returns {string} - Disease slug
 */
export const createDiseaseSlug = (diseaseName, diseaseId = null) => {
  const baseSlug = createSlug(diseaseName);
  return diseaseId ? `${baseSlug}-${diseaseId}` : baseSlug;
};

/**
 * Create product slug with prefix
 * @param {string} productName - Product name
 * @param {number} productId - Product ID (optional)
 * @returns {string} - Product slug
 */
export const createProductSlug = (productName, productId = null) => {
  const baseSlug = createSlug(productName);
  return productId ? `${baseSlug}-${productId}` : baseSlug;
};

/**
 * Extract ID from slug (if it exists)
 * @param {string} slug - The slug containing ID
 * @returns {number|null} - Extracted ID or null
 */
export const extractIdFromSlug = (slug) => {
  if (!slug) return null;
  
  const parts = slug.split('-');
  const lastPart = parts[parts.length - 1];
  const id = parseInt(lastPart, 10);
  
  return !isNaN(id) ? id : null;
};

/**
 * Remove ID from slug to get clean slug
 * @param {string} slug - The slug with ID
 * @returns {string} - Clean slug without ID
 */
export const removeIdFromSlug = (slug) => {
  if (!slug) return '';
  
  const id = extractIdFromSlug(slug);
  if (id) {
    return slug.replace(`-${id}`, '');
  }
  return slug;
};

/**
 * Generate SEO-friendly URLs for different entity types
 */
export const generateUrls = {
  brand: (brandName, brandSlug) => `/brand/${brandSlug || createSlug(brandName)}`,
  category: (categoryName, categorySlug) => `/category/${categorySlug || createSlug(categoryName)}`,
  disease: (diseaseName, diseaseSlug) => `/disease/${diseaseSlug || createSlug(diseaseName)}`,
  product: (productName, productSlug) => `/product/${productSlug || createSlug(productName)}`,
  subCategory: (parentCategory, subCategory, subCategorySlug) => 
    `/category/${createSlug(parentCategory)}/${subCategorySlug || createSlug(subCategory)}`,
};

/**
 * Validate slug format
 * @param {string} slug - Slug to validate
 * @returns {boolean} - Whether slug is valid
 */
export const isValidSlug = (slug) => {
  if (!slug) return false;
  
  // Check if slug contains only lowercase letters, numbers, and hyphens
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
};

/**
 * Create breadcrumb data from slug
 * @param {string} type - Entity type (brand, category, disease, product)
 * @param {string} slug - The slug
 * @param {string} name - Display name
 * @returns {Array} - Breadcrumb items
 */
export const createBreadcrumb = (type, slug, name) => {
  const breadcrumbs = [
    { label: 'Home', path: '/' }
  ];
  
  switch (type) {
    case 'brand':
      breadcrumbs.push(
        { label: 'Brands', path: '/brands' },
        { label: name, path: `/brand/${slug}` }
      );
      break;
    case 'category':
      breadcrumbs.push(
        { label: 'Categories', path: '/categories' },
        { label: name, path: `/category/${slug}` }
      );
      break;
    case 'disease':
      breadcrumbs.push(
        { label: 'Health Concerns', path: '/health-concerns' },
        { label: name, path: `/disease/${slug}` }
      );
      break;
    case 'main_category':
      breadcrumbs.push(
        { label: 'Health Concerns', path: '/health-concerns' },
        { label: name, path: `/health-concern/${slug}` }
      );
      break;
    case 'product':
      breadcrumbs.push(
        { label: 'Products', path: '/products' },
        { label: name, path: `/product/${slug}` }
      );
      break;
    default:
      breadcrumbs.push({ label: name, path: `/${type}/${slug}` });
  }
  
  return breadcrumbs;
};

/**
 * Search utilities for slug-based routing
 */
export const searchUtils = {
  /**
   * Find entity by slug
   * @param {Array} entities - Array of entities
   * @param {string} slug - Slug to search for
   * @returns {Object|null} - Found entity or null
   */
  findBySlug: (entities, slug) => {
    return entities.find(entity => {
      const entitySlug = entity.slug || createSlug(entity.name);
      const entitySlugWithId = createSlug(entity.name) + '-' + entity.id;
      return entitySlug === slug || entitySlugWithId === slug;
    }) || null;
  },
  
  /**
   * Filter entities by partial slug match
   * @param {Array} entities - Array of entities
   * @param {string} partialSlug - Partial slug to match
   * @returns {Array} - Matching entities
   */
  filterBySlug: (entities, partialSlug) => {
    return entities.filter(entity => {
      const entitySlug = entity.slug || createSlug(entity.name);
      return entitySlug.includes(partialSlug);
    });
  }
};

export default {
  createSlug,
  slugToText,
  createBrandSlug,
  createCategorySlug,
  createDiseaseSlug,
  createProductSlug,
  extractIdFromSlug,
  removeIdFromSlug,
  generateUrls,
  isValidSlug,
  createBreadcrumb,
  searchUtils
};