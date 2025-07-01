// Product Recommendations Engine for Simply Online Australia
import { allProducts } from '../data/allProducts';

export class RecommendationEngine {
  constructor() {
    this.products = allProducts;
  }

  // Get recommendations based on current product
  getProductRecommendations(currentProductId, limit = 4) {
    const currentProduct = this.products.find(p => p.id === currentProductId);
    if (!currentProduct) return [];

    const recommendations = [];
    
    // 1. Same category products (highest priority)
    const sameCategoryProducts = this.products
      .filter(p => 
        p.id !== currentProductId && 
        p.category && 
        currentProduct.category &&
        p.category.some(cat => currentProduct.category.includes(cat))
      )
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 2);
    
    recommendations.push(...sameCategoryProducts);

    // 2. Complementary products (accessories for cameras, etc.)
    const complementaryProducts = this.getComplementaryProducts(currentProduct);
    recommendations.push(...complementaryProducts.slice(0, 1));

    // 3. Best sellers if we need more
    if (recommendations.length < limit) {
      const bestSellers = this.products
        .filter(p => 
          p.id !== currentProductId && 
          p.bestseller &&
          !recommendations.some(rec => rec.id === p.id)
        )
        .sort((a, b) => a.salesRank - b.salesRank)
        .slice(0, limit - recommendations.length);
      
      recommendations.push(...bestSellers);
    }

    // 4. Fill with highly rated products if still needed
    if (recommendations.length < limit) {
      const highRated = this.products
        .filter(p => 
          p.id !== currentProductId && 
          p.rating >= 4.5 &&
          !recommendations.some(rec => rec.id === p.id)
        )
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit - recommendations.length);
      
      recommendations.push(...highRated);
    }

    return recommendations.slice(0, limit);
  }

  // Get complementary products (accessories, upgrades, etc.)
  getComplementaryProducts(product) {
    const complementary = [];

    // If it's a camera, recommend accessories
    if (this.isCamera(product)) {
      const accessories = this.products.filter(p => 
        p.category && p.category.includes('accessories')
      );
      complementary.push(...accessories);
    }

    // If it's solar powered, recommend batteries
    if (product.category && product.category.includes('solar')) {
      const batteries = this.products.filter(p => 
        p.title.toLowerCase().includes('battery') ||
        p.title.toLowerCase().includes('batteries')
      );
      complementary.push(...batteries);
    }

    // If it's 4G, recommend solar router
    if (product.category && product.category.includes('4g')) {
      const routers = this.products.filter(p => 
        p.title.toLowerCase().includes('router') ||
        p.title.toLowerCase().includes('modem')
      );
      complementary.push(...routers);
    }

    return complementary.sort((a, b) => b.rating - a.rating);
  }

  // Check if product is a camera
  isCamera(product) {
    const cameraKeywords = ['camera', 'ptz', 'bullet', 'dome'];
    return cameraKeywords.some(keyword => 
      product.title.toLowerCase().includes(keyword)
    );
  }

  // Get recommendations based on user's browsing history
  getPersonalizedRecommendations(viewedProductIds = [], limit = 6) {
    if (viewedProductIds.length === 0) {
      return this.getBestSellers(limit);
    }

    const viewedProducts = this.products.filter(p => 
      viewedProductIds.includes(p.id)
    );

    // Analyze user preferences
    const userPreferences = this.analyzeUserPreferences(viewedProducts);
    
    // Get recommendations based on preferences
    const recommendations = this.products
      .filter(p => !viewedProductIds.includes(p.id))
      .map(product => ({
        ...product,
        score: this.calculateRecommendationScore(product, userPreferences)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return recommendations;
  }

  // Analyze user preferences from viewed products
  analyzeUserPreferences(viewedProducts) {
    const preferences = {
      categories: {},
      priceRange: { min: 0, max: Infinity },
      features: {},
      avgRating: 0
    };

    viewedProducts.forEach(product => {
      // Category preferences
      if (product.category) {
        product.category.forEach(cat => {
          preferences.categories[cat] = (preferences.categories[cat] || 0) + 1;
        });
      }

      // Price range preferences
      if (product.price < preferences.priceRange.max) {
        preferences.priceRange.max = Math.max(preferences.priceRange.max, product.price * 1.5);
      }
      if (product.price > preferences.priceRange.min) {
        preferences.priceRange.min = Math.min(preferences.priceRange.min, product.price * 0.5);
      }

      // Feature preferences
      if (product.features) {
        product.features.forEach(feature => {
          preferences.features[feature] = (preferences.features[feature] || 0) + 1;
        });
      }
    });

    // Calculate average rating preference
    preferences.avgRating = viewedProducts.reduce((sum, p) => sum + p.rating, 0) / viewedProducts.length;

    return preferences;
  }

  // Calculate recommendation score for a product
  calculateRecommendationScore(product, preferences) {
    let score = 0;

    // Category match score (40% weight)
    if (product.category) {
      const categoryScore = product.category.reduce((sum, cat) => {
        return sum + (preferences.categories[cat] || 0);
      }, 0);
      score += categoryScore * 0.4;
    }

    // Price range score (20% weight)
    if (product.price >= preferences.priceRange.min && product.price <= preferences.priceRange.max) {
      score += 20 * 0.2;
    }

    // Rating score (25% weight)
    const ratingDiff = Math.abs(product.rating - preferences.avgRating);
    score += (5 - ratingDiff) * 0.25 * 10;

    // Feature match score (15% weight)
    if (product.features) {
      const featureScore = product.features.reduce((sum, feature) => {
        return sum + (preferences.features[feature] || 0);
      }, 0);
      score += featureScore * 0.15;
    }

    // Bestseller bonus
    if (product.bestseller) {
      score += 5;
    }

    // High rating bonus
    if (product.rating >= 4.5) {
      score += 3;
    }

    return score;
  }

  // Get trending products (best sellers)
  getBestSellers(limit = 6) {
    return this.products
      .filter(p => p.bestseller)
      .sort((a, b) => a.salesRank - b.salesRank)
      .slice(0, limit);
  }

  // Get products by price range
  getProductsByPriceRange(minPrice, maxPrice, limit = 6) {
    return this.products
      .filter(p => p.price >= minPrice && p.price <= maxPrice)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  // Get recently viewed products (from localStorage)
  getRecentlyViewed(limit = 4) {
    try {
      const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      return this.products
        .filter(p => viewed.includes(p.id))
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting recently viewed products:', error);
      return [];
    }
  }

  // Add product to recently viewed
  addToRecentlyViewed(productId) {
    try {
      const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      const updatedViewed = [productId, ...viewed.filter(id => id !== productId)].slice(0, 10);
      localStorage.setItem('recentlyViewed', JSON.stringify(updatedViewed));
    } catch (error) {
      console.error('Error adding to recently viewed:', error);
    }
  }

  // Get frequently bought together products
  getFrequentlyBoughtTogether(productId, limit = 3) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return [];

    // This would normally come from purchase data
    // For now, we'll simulate based on product logic
    const recommendations = [];

    // If buying a camera, suggest accessories
    if (this.isCamera(product)) {
      const accessories = this.products.filter(p => 
        p.category && p.category.includes('accessories')
      ).slice(0, 2);
      recommendations.push(...accessories);
    }

    // If buying solar camera, suggest extra batteries
    if (product.category && product.category.includes('solar')) {
      const batteries = this.products.filter(p => 
        p.title.toLowerCase().includes('batteries') &&
        p.id !== productId
      ).slice(0, 1);
      recommendations.push(...batteries);
    }

    return recommendations.slice(0, limit);
  }

  // Get products for specific use cases
  getProductsForUseCase(useCase, limit = 4) {
    const useCaseMap = {
      'remote-property': {
        categories: ['4g', 'solar'],
        keywords: ['4g', 'solar', 'remote']
      },
      'home-security': {
        categories: ['wifi', 'ac'],
        keywords: ['wifi', 'home', 'indoor']
      },
      'construction-site': {
        categories: ['4g', 'solar'],
        keywords: ['4g', 'construction', 'builder', 'zoom']
      },
      'farm-monitoring': {
        categories: ['4g', 'solar'],
        keywords: ['4g', 'solar', 'farm', 'cattle']
      }
    };

    const criteria = useCaseMap[useCase];
    if (!criteria) return [];

    return this.products
      .filter(product => {
        // Check categories
        const categoryMatch = criteria.categories.some(cat => 
          product.category && product.category.includes(cat)
        );

        // Check keywords in title or description
        const keywordMatch = criteria.keywords.some(keyword =>
          product.title.toLowerCase().includes(keyword) ||
          product.description.toLowerCase().includes(keyword)
        );

        return categoryMatch || keywordMatch;
      })
      .sort((a, b) => {
        // Prioritize bestsellers and high ratings
        if (a.bestseller && !b.bestseller) return -1;
        if (!a.bestseller && b.bestseller) return 1;
        return b.rating - a.rating;
      })
      .slice(0, limit);
  }

  // Get seasonal recommendations
  getSeasonalRecommendations(season = 'current', limit = 4) {
    const currentMonth = new Date().getMonth();
    let seasonalProducts = [];

    // Summer (Dec-Feb in Australia) - Solar cameras
    if (season === 'summer' || (currentMonth >= 11 || currentMonth <= 1)) {
      seasonalProducts = this.products.filter(p => 
        p.category && p.category.includes('solar')
      );
    }
    // Winter (Jun-Aug) - Indoor cameras and smart locks
    else if (season === 'winter' || (currentMonth >= 5 && currentMonth <= 7)) {
      seasonalProducts = this.products.filter(p => 
        (p.category && p.category.includes('indoor')) ||
        (p.category && p.category.includes('doorlock'))
      );
    }
    // Default to best sellers
    else {
      seasonalProducts = this.getBestSellers(limit * 2);
    }

    return seasonalProducts
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }
}

// Create singleton instance
export const recommendationEngine = new RecommendationEngine();

// Utility functions for components
export const getRecommendations = (productId, limit = 4) => {
  return recommendationEngine.getProductRecommendations(productId, limit);
};

export const getPersonalizedRecommendations = (viewedIds = [], limit = 6) => {
  return recommendationEngine.getPersonalizedRecommendations(viewedIds, limit);
};

export const addToRecentlyViewed = (productId) => {
  recommendationEngine.addToRecentlyViewed(productId);
};

export const getRecentlyViewed = (limit = 4) => {
  return recommendationEngine.getRecentlyViewed(limit);
};

export default recommendationEngine;