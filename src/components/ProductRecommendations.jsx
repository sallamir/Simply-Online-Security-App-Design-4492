import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { recommendationEngine } from '../lib/recommendations';

const { FiStar, FiExternalLink, FiHeart, FiShoppingCart, FiTrendingUp, FiEye, FiUsers, FiZap } = FiIcons;

const ProductRecommendations = ({
  currentProductId = null,
  type = 'related', // 'related', 'personalized', 'trending', 'recently-viewed'
  title = 'Recommended Products',
  limit = 4,
  showTitle = true,
  className = ''
}) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      let products = [];

      try {
        switch (type) {
          case 'related':
            if (currentProductId) {
              products = recommendationEngine.getProductRecommendations(currentProductId, limit);
            }
            break;
          case 'personalized':
            const viewedIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
            products = recommendationEngine.getPersonalizedRecommendations(viewedIds, limit);
            break;
          case 'trending':
            products = recommendationEngine.getBestSellers(limit);
            break;
          case 'recently-viewed':
            products = recommendationEngine.getRecentlyViewed(limit);
            break;
          case 'frequently-bought-together':
            if (currentProductId) {
              products = recommendationEngine.getFrequentlyBoughtTogether(currentProductId, limit);
            }
            break;
          case 'seasonal':
            products = recommendationEngine.getSeasonalRecommendations('current', limit);
            break;
          default:
            products = recommendationEngine.getBestSellers(limit);
        }

        setRecommendations(products);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentProductId, type, limit]);

  const handleProductClick = (product) => {
    // Add to recently viewed
    recommendationEngine.addToRecentlyViewed(product.id);
    // Open product page
    window.open(product.url, '_blank', 'noopener,noreferrer');
  };

  const formatPrice = (price) => {
    return `$${price?.toFixed(0)}`;
  };

  // FIXED: Correct pricing logic with better handling
  const getPricing = (product) => {
    // Check if originalPrice exists and is higher than current price
    if (product.originalPrice && product.originalPrice > product.price) {
      return {
        currentPrice: product.price,
        originalPrice: product.originalPrice,
        isOnSale: true,
        savings: product.originalPrice - product.price
      };
    } else {
      // No sale - just show the current price
      return {
        currentPrice: product.price,
        originalPrice: null,
        isOnSale: false,
        savings: 0
      };
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'trending': return FiTrendingUp;
      case 'recently-viewed': return FiEye;
      case 'personalized': return FiUsers;
      case 'frequently-bought-together': return FiShoppingCart;
      case 'seasonal': return FiZap;
      default: return FiStar;
    }
  };

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-secondary-200 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="bg-secondary-100 rounded-xl h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${className}`}
    >
      {showTitle && (
        <div className="flex items-center space-x-2 mb-4">
          <SafeIcon icon={getTypeIcon()} className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-secondary-900">{title}</h3>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {recommendations.map((product, index) => {
          const pricing = getPricing(product);
          
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="group cursor-pointer"
              onClick={() => handleProductClick(product)}
            >
              <div className="bg-white rounded-xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 border border-secondary-100">
                {/* Product Image */}
                <div className="relative overflow-hidden bg-secondary-50">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = `https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop&text=${encodeURIComponent(product.title)}`;
                    }}
                  />

                  {/* Badges */}
                  <div className="absolute top-2 left-2 space-y-1">
                    {product.bestseller && (
                      <div className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full font-bold shadow-medium">
                        Best Seller
                      </div>
                    )}
                    {pricing.isOnSale && (
                      <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        Save ${pricing.savings.toFixed(0)}
                      </div>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add wishlist logic here
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white shadow-medium"
                  >
                    <SafeIcon icon={FiHeart} className="w-4 h-4 text-secondary-600" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  {/* FIXED: Price Display - Show both prices correctly */}
                  <div className="flex items-baseline space-x-2 mb-2">
                    <span className="text-lg font-bold text-secondary-900">
                      {formatPrice(pricing.currentPrice)}
                    </span>
                    {pricing.isOnSale && pricing.originalPrice && (
                      <span className="text-sm text-secondary-500 line-through">
                        {formatPrice(pricing.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h4 className="font-medium text-secondary-900 text-sm mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {product.title}
                  </h4>

                  {/* Rating */}
                  <div className="flex items-center space-x-1 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <SafeIcon
                          key={i}
                          icon={FiStar}
                          className={`w-3 h-3 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-secondary-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-secondary-600">
                      ({product.reviews})
                    </span>
                  </div>

                  {/* Quick View Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(product);
                    }}
                    className="w-full bg-primary-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-soft flex items-center justify-center space-x-1"
                  >
                    <span>View Details</span>
                    <SafeIcon icon={FiExternalLink} className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* View All Button for larger recommendation sets */}
      {type === 'personalized' && recommendations.length >= limit && (
        <div className="text-center mt-6">
          <button
            onClick={() => window.location.href = '/#/products'}
            className="text-primary-600 font-medium hover:text-primary-700 transition-colors"
          >
            View All Products →
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ProductRecommendations;