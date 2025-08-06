/**
 * Generate hierarchical product URL based on available product data
 * @param {Object} product - Product object with slug, brand info, category info
 * @returns {string} - Hierarchical product URL
 */
export function generateProductUrl(product) {
  if (!product || !product.slug) {
    // Fallback to ID if no slug
    return `/product/${product?.id || ''}`;
  }

  // Priority order for hierarchical URLs:
  // 1. Health Concern (main category) -> /health-concern/{main_category_slug}/product/{product_slug}
  // 2. Category -> /category/{category_slug}/product/{product_slug}  
  // 3. Brand -> /brand/{brand_slug}/product/{product_slug}
  // 4. Default -> /product/{product_slug}

  // Check for main category (health concern)
  if (product.main_category_slug) {
    return `/health-concern/${product.main_category_slug}/product/${product.slug}`;
  }

  // Check for sub category
  if (product.sub_category_slug) {
    return `/category/${product.sub_category_slug}/product/${product.slug}`;
  }

  // Check for brand
  if (product.brand_slug) {
    return `/brand/${product.brand_slug}/product/${product.slug}`;
  }

  // Default fallback
  return `/product/${product.slug}`;
}

/**
 * Generate breadcrumb items for product page
 * @param {Object} product - Product object
 * @returns {Array} - Array of breadcrumb items
 */
export function generateProductBreadcrumbs(product) {
  const breadcrumbs = [
    { label: 'Home', path: '/' }
  ];

  if (!product) return breadcrumbs;

  // Add main category if available
  if (product.main_category_name && product.main_category_slug) {
    breadcrumbs.push(
      { label: 'Health Concerns', path: '/health-concerns' },
      { label: product.main_category_name, path: `/health-concern/${product.main_category_slug}` }
    );
  }
  // Add sub category if available
  else if (product.sub_category_name && product.sub_category_slug) {
    breadcrumbs.push(
      { label: 'Categories', path: '/categories' },
      { label: product.sub_category_name, path: `/category/${product.sub_category_slug}` }
    );
  }
  // Add brand if available
  else if (product.brand_name && product.brand_slug) {
    breadcrumbs.push(
      { label: 'Brands', path: '/brands' },
      { label: product.brand_name, path: `/brand/${product.brand_slug}` }
    );
  }

  // Add product
  breadcrumbs.push({
    label: product.name,
    path: generateProductUrl(product)
  });

  return breadcrumbs;
}