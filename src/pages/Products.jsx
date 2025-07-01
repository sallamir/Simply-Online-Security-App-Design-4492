import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { allProducts, getProductsSortedByBestsellers, getProductsByCategory } from '../data/allProducts';

const { FiSearch, FiFilter, FiExternalLink, FiSignal, FiWifi, FiSun, FiZap, FiHome, FiGrid, FiStar, FiLoader, FiLock, FiPackage, FiHeart } = FiIcons;

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('bestseller');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  const categories = [
    { id: 'all', name: 'All Products', icon: FiGrid },
    { id: '4g', name: '4G Cameras', icon: FiSignal },
    { id: 'wifi', name: 'WiFi Cameras', icon: FiWifi },
    { id: 'solar', name: 'Solar Powered', icon: FiSun },
    { id: 'ac', name: 'AC Powered', icon: FiZap },
    { id: 'indoor', name: 'Indoor Cameras', icon: FiHome },
    { id: 'doorlock', name: 'Smart Locks', icon: FiLock },
    { id: 'accessories', name: 'Accessories', icon: FiPackage },
  ];

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || 
                             (product.category && product.category.includes(selectedCategory));
      
      return matchesSearch && matchesCategory;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'bestseller':
          if (a.bestseller && !b.bestseller) return -1;
          if (!a.bestseller && b.bestseller) return 1;
          return a.salesRank - b.salesRank;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return a.salesRank - b.salesRank;
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, sortBy]);

  const categoriesWithCounts = categories.map(cat => ({
    ...cat,
    count: cat.id === 'all' ? allProducts.length : allProducts.filter(p => p.category && p.category.includes(cat.id)).length
  }));

  const openProductWebsite = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const formatPrice = (price) => {
    return `$${price?.toFixed(0)}`;
  };

  // Helper function to get correct pricing display
  const getPricing = (product) => {
    if (product.originalPrice && product.originalPrice > product.price) {
      // Product is on sale - show current price as main, original as crossed out
      return {
        currentPrice: product.price,
        originalPrice: product.originalPrice,
        isOnSale: true,
        savings: product.originalPrice - product.price
      };
    } else {
      // No sale - just show the price
      return {
        currentPrice: product.price,
        originalPrice: null,
        isOnSale: false,
        savings: 0
      };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-4 py-6 space-y-6"
    >
      {/* Hero Section - Adidas Style */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 rounded-2xl p-8 text-white relative overflow-hidden"
      >
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Security Camera Collection</h1>
          <p className="text-primary-100 mb-4">Solar & 4G powered cameras for every need</p>
          <div className="flex items-center space-x-4 text-sm">
            <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">34+ Products</span>
            <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">Free Shipping</span>
            <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">Expert Support</span>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-5 rounded-full translate-y-12 -translate-x-12"></div>
      </motion.div>

      {/* Search Bar - Adidas Style */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        <SafeIcon icon={FiSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
        <input
          type="text"
          placeholder="Search for security cameras, accessories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-2 border-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-soft text-base transition-all duration-200 hover:shadow-medium"
        />
      </motion.div>

      {/* Filter Bar - Adidas Style */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-between bg-white rounded-xl p-4 shadow-soft border border-secondary-100"
      >
        <div className="flex items-center space-x-3">
          <SafeIcon icon={FiFilter} className="w-5 h-5 text-secondary-600" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="bestseller">Best Sellers</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
        <div className="text-sm text-secondary-600">
          {filteredAndSortedProducts.length} products
        </div>
      </motion.div>

      {/* Category Pills - Horizontal Scroll */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide"
      >
        {categoriesWithCounts.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex-shrink-0 flex items-center space-x-2 px-4 py-3 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              selectedCategory === category.id
                ? 'bg-primary-600 text-white shadow-medium'
                : 'bg-white text-secondary-600 border border-secondary-200 hover:bg-secondary-50 shadow-soft'
            }`}
          >
            <SafeIcon icon={category.icon} className="w-4 h-4" />
            <span>{category.name}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              selectedCategory === category.id ? 'bg-primary-500' : 'bg-secondary-200'
            }`}>
              {category.count}
            </span>
          </button>
        ))}
      </motion.div>

      {/* Product Grid - Adidas Style */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredAndSortedProducts.map((product, index) => {
          const pricing = getPricing(product);
          
          return (
            <motion.div
              key={product.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.05 * index }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
              onClick={() => openProductWebsite(product.url)}
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-strong transition-all duration-300 border border-secondary-100">
                {/* Product Image */}
                <div className="relative overflow-hidden bg-secondary-50">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = `https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&text=${encodeURIComponent(product.title)}`;
                    }}
                  />

                  {/* Floating Badges */}
                  <div className="absolute top-4 left-4 space-y-2">
                    {product.bestseller && (
                      <div className="bg-primary-600 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-medium flex items-center space-x-1">
                        <SafeIcon icon={FiStar} className="w-3 h-3" />
                        <span>Best Seller</span>
                      </div>
                    )}
                    {pricing.isOnSale && (
                      <div className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-medium">
                        Save ${pricing.savings.toFixed(0)}
                      </div>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white shadow-medium">
                    <SafeIcon icon={FiHeart} className="w-5 h-5 text-secondary-600" />
                  </button>

                  {/* Quick View Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <button className="bg-white text-primary-600 px-6 py-3 rounded-full font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-strong hover:bg-primary-600 hover:text-white">
                      Quick View
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  {/* Price - CORRECTED: Show current price large, original crossed out */}
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-2xl font-bold text-secondary-900">
                      {formatPrice(pricing.currentPrice)}
                    </span>
                    {pricing.isOnSale && pricing.originalPrice && (
                      <span className="text-lg text-secondary-500 line-through">
                        {formatPrice(pricing.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-secondary-900 text-lg mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {product.title}
                  </h3>

                  {/* Rating & Sales Rank */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <SafeIcon
                          key={i}
                          icon={FiStar}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-secondary-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-secondary-600 ml-1">
                        ({product.reviews})
                      </span>
                    </div>
                    {product.bestseller && (
                      <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full font-medium">
                        #{product.salesRank}
                      </span>
                    )}
                  </div>

                  {/* Key Features */}
                  <div className="mb-4">
                    <div className="space-y-1">
                      {product.features.slice(0, 2).map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                          <span className="text-sm text-secondary-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Category Tags */}
                  {product.category && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.category.slice(0, 2).map((cat, catIndex) => {
                        const categoryInfo = categoriesWithCounts.find(c => c.id === cat);
                        return (
                          <span
                            key={catIndex}
                            className="text-xs bg-secondary-100 text-secondary-700 px-2 py-1 rounded-lg font-medium"
                          >
                            {categoryInfo?.name || cat}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* CTA Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openProductWebsite(product.url);
                    }}
                    className="w-full bg-primary-600 text-white py-3 rounded-xl font-medium hover:bg-primary-700 transition-all duration-200 shadow-soft hover:shadow-medium flex items-center justify-center space-x-2"
                  >
                    <span>View Details</span>
                    <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* No Results */}
      {filteredAndSortedProducts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <SafeIcon icon={FiSearch} className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-secondary-900 mb-2">No products found</h3>
          <p className="text-secondary-600 mb-6">Try adjusting your search or filter criteria</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
            className="bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors"
          >
            Clear all filters
          </button>
        </motion.div>
      )}

      {/* Footer CTA */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-2xl p-6 text-center border border-secondary-200"
      >
        <div className="flex items-center justify-center space-x-2 mb-2">
          <img
            src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751365731047-Logo.png"
            alt="Simply Online"
            className="w-6 h-6 object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <p className="text-sm text-secondary-700 font-semibold">
            Official Simply Online Products
          </p>
        </div>
        <p className="text-xs text-secondary-600 mb-4">
          All {allProducts.length} products link directly to our website. Free shipping Australia-wide on orders over $100.
        </p>
        <a
          href="https://simplyonline.com.au"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-soft"
        >
          <span>Visit Our Store</span>
          <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
        </a>
      </motion.div>
    </motion.div>
  );
};

export default Products;