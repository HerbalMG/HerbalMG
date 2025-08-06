// Test script to verify API calls work
import { getBrands } from './lib/brandApi';
import { getMainCategories } from './lib/categoryApi';
import { getDiseases } from './lib/diseaseApi';

export const testAPIs = async () => {
  console.log('Testing API calls...');
  
  try {
    console.log('Testing brands API...');
    const brands = await getBrands();
    console.log('Brands result:', brands);
  } catch (error) {
    console.error('Brands API failed:', error);
  }
  
  try {
    console.log('Testing categories API...');
    const categories = await getMainCategories();
    console.log('Categories result:', categories);
  } catch (error) {
    console.error('Categories API failed:', error);
  }
  
  try {
    console.log('Testing diseases API...');
    const diseases = await getDiseases();
    console.log('Diseases result:', diseases);
  } catch (error) {
    console.error('Diseases API failed:', error);
  }
};

// Call this function from browser console: testAPIs()
window.testAPIs = testAPIs;