import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiStar, FiWifi, FiShield, FiCamera, FiHeart, FiShare, FiChevronDown, FiChevronUp, FiPlay, FiCheck, FiX, FiChevronRight } = FiIcons;

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [expandedSections, setExpandedSections] = useState(new Set(['overview']));

  // Mock data - in a real app, this would come from an API
  const product = {
    id: parseInt(id),
    name: 'SO-4K-DOME-PRO',
    title: '4K Ultra HD Dome Camera',
    description: 'Professional grade 4K dome camera with advanced night vision and weatherproof design. Perfect for both indoor and outdoor security monitoring with crystal clear video quality.',
    price: 299.99,
    originalPrice: 349.99,
    rating: 4.8,
    reviews: 156,
    inStock: true,
    category: 'Outdoor Cameras',
    isWireless: false,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1551808525-51a94da548ce?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=400&fit=crop'
    ],
    features: [
      '4K Ultra HD Recording',
      'Advanced Night Vision up to 100ft',
      'Weatherproof IP66 Rating',
      'Motion Detection with Smart Alerts',
      'Two-Way Audio Communication',
      'Mobile App Integration',
      'Cloud & Local Storage Options',
      'Easy Installation'
    ],
    specifications: {
      'Video Resolution': '4K (3840 x 2160) @ 30fps',
      'Night Vision': 'Up to 100ft with IR LEDs',
      'Weather Rating': 'IP66 Weatherproof',
      'Storage': 'Cloud & MicroSD (up to 256GB)',
      'Connectivity': 'Ethernet, WiFi 802.11n',
      'Power': '12V DC / PoE',
      'Viewing Angle': '110° Wide Angle Lens',
      'Audio': 'Built-in Microphone & Speaker',
      'Dimensions': '5.5" x 5.5" x 4.2"',
      'Weight': '2.1 lbs'
    },
    whatInBox: [
      '4K Dome Camera',
      'Mounting Bracket & Screws',
      'Ethernet Cable (10ft)',
      'Power Adapter',
      'Quick Start Guide',
      'Warranty Card'
    ],
    compatibleProducts: [
      {
        id: 6,
        name: 'SO-NVR-8CH-PRO',
        title: '8-Channel NVR System',
        price: 599.99,
        image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=200&h=150&fit=crop'
      }
    ],
    tutorials: [
      {
        id: 1,
        title: 'Setting Up Your Dome Camera',
        duration: '5:30',
        thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop'
      },
      {
        id: 3,
        title: 'Night Vision Optimization',
        duration: '6:45',
        thumbnail: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=300&h=200&fit=crop'
      }
    ]
  };

  const toggleSection = (section) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const savings = product.originalPrice ? product.originalPrice - product.price : 0;
  const discountPercent = product.originalPrice ? Math.round((savings / product.originalPrice) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-4 py-6 space-y-6"
    >
      {/* Image Gallery */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl overflow-hidden shadow-sm border border-secondary-200"
      >
        <div className="relative">
          <img
            src={product.images[selectedImage]}
            alt={product.title}
            className="w-full h-64 object-cover"
          />
          {product.originalPrice && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Save {discountPercent}%
            </div>
          )}
          <div className="absolute top-4 right-4 flex space-x-2">
            <button className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors">
              <SafeIcon icon={FiHeart} className="w-5 h-5 text-secondary-600" />
            </button>
            <button className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors">
              <SafeIcon icon={FiShare} className="w-5 h-5 text-secondary-600" />
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="flex space-x-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-16 h-12 rounded-lg border-2 overflow-hidden ${
                  selectedImage === index ? 'border-primary-600' : 'border-secondary-200'
                }`}
              >
                <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Product Info */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200"
      >
        <div className="space-y-4">
          {/* Title and Category */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded">
                {product.category}
              </span>
              {product.isWireless && (
                <div className="flex items-center space-x-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                  <SafeIcon icon={FiWifi} className="w-3 h-3" />
                  <span>Wireless</span>
                </div>
              )}
              <div className={`px-2 py-1 text-xs rounded ${
                product.inStock 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </div>
            </div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-1">{product.title}</h1>
            <p className="text-sm text-secondary-500">{product.name}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <SafeIcon
                  key={i}
                  icon={FiStar}
                  className={`w-5 h-5 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-secondary-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-secondary-600">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-3">
            <span className="text-3xl font-bold text-primary-600">
              ${product.price}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-secondary-500 line-through">
                  ${product.originalPrice}
                </span>
                <span className="px-2 py-1 bg-red-100 text-red-700 text-sm font-medium rounded">
                  Save ${savings.toFixed(0)}
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-secondary-700 leading-relaxed">{product.description}</p>

          {/* Key Features */}
          <div>
            <h3 className="font-semibold text-secondary-900 mb-2">Key Features</h3>
            <div className="grid grid-cols-1 gap-2">
              {product.features.slice(0, 4).map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-secondary-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col space-y-3 pt-4">
            <button className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors">
              Add to Cart - ${product.price}
            </button>
            <button className="w-full border border-secondary-300 text-secondary-700 py-3 rounded-lg font-medium hover:bg-secondary-50 transition-colors">
              Contact Sales Team
            </button>
          </div>
        </div>
      </motion.div>

      {/* Expandable Sections */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        {/* Overview Section */}
        <div className="bg-white rounded-xl border border-secondary-200 overflow-hidden">
          <button
            onClick={() => toggleSection('overview')}
            className="w-full px-6 py-4 text-left hover:bg-secondary-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-secondary-900">Complete Feature List</h3>
              <SafeIcon 
                icon={expandedSections.has('overview') ? FiChevronUp : FiChevronDown}
                className="w-5 h-5 text-secondary-500"
              />
            </div>
          </button>
          {expandedSections.has('overview') && (
            <div className="px-6 pb-6 border-t border-secondary-200">
              <div className="grid grid-cols-1 gap-2 pt-4">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-secondary-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Specifications Section */}
        <div className="bg-white rounded-xl border border-secondary-200 overflow-hidden">
          <button
            onClick={() => toggleSection('specs')}
            className="w-full px-6 py-4 text-left hover:bg-secondary-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-secondary-900">Technical Specifications</h3>
              <SafeIcon 
                icon={expandedSections.has('specs') ? FiChevronUp : FiChevronDown}
                className="w-5 h-5 text-secondary-500"
              />
            </div>
          </button>
          {expandedSections.has('specs') && (
            <div className="px-6 pb-6 border-t border-secondary-200">
              <div className="space-y-3 pt-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-start">
                    <span className="text-sm font-medium text-secondary-900 flex-shrink-0 w-1/3">
                      {key}
                    </span>
                    <span className="text-sm text-secondary-700 text-right flex-1">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* What's in the Box Section */}
        <div className="bg-white rounded-xl border border-secondary-200 overflow-hidden">
          <button
            onClick={() => toggleSection('box')}
            className="w-full px-6 py-4 text-left hover:bg-secondary-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-secondary-900">What's in the Box</h3>
              <SafeIcon 
                icon={expandedSections.has('box') ? FiChevronUp : FiChevronDown}
                className="w-5 h-5 text-secondary-500"
              />
            </div>
          </button>
          {expandedSections.has('box') && (
            <div className="px-6 pb-6 border-t border-secondary-200">
              <div className="grid grid-cols-1 gap-2 pt-4">
                {product.whatInBox.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-secondary-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Related Tutorials */}
      {product.tutorials.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-secondary-900">Setup Tutorials</h3>
            <Link to="/tutorials" className="text-primary-600 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {product.tutorials.map((tutorial) => (
              <Link
                key={tutorial.id}
                to={`/tutorials/${tutorial.id}`}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-secondary-50 transition-colors"
              >
                <div className="relative">
                  <img
                    src={tutorial.thumbnail}
                    alt={tutorial.title}
                    className="w-16 h-12 rounded-lg object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center">
                    <SafeIcon icon={FiPlay} className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-secondary-900 truncate">{tutorial.title}</h4>
                  <p className="text-sm text-secondary-600">{tutorial.duration}</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Compatible Products */}
      {product.compatibleProducts.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-secondary-900">Compatible Products</h3>
            <Link to="/products" className="text-primary-600 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {product.compatibleProducts.map((compatibleProduct) => (
              <Link
                key={compatibleProduct.id}
                to={`/products/${compatibleProduct.id}`}
                className="flex items-center space-x-4 p-3 rounded-lg border border-secondary-200 hover:bg-secondary-50 transition-colors"
              >
                <img
                  src={compatibleProduct.image}
                  alt={compatibleProduct.title}
                  className="w-16 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-secondary-900 truncate">{compatibleProduct.title}</h4>
                  <p className="text-sm text-secondary-500 truncate">{compatibleProduct.name}</p>
                  <p className="text-sm font-semibold text-primary-600">${compatibleProduct.price}</p>
                </div>
                <SafeIcon icon={FiChevronRight} className="w-5 h-5 text-secondary-400" />
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProductDetail;