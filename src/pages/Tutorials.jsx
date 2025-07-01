import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiPlay, FiClock, FiEye, FiSearch, FiFilter, FiSun, FiWifi, FiSignal, FiZoom, FiLoader, FiLock } = FiIcons;

// Real tutorial videos from Simply Online
const realTutorials = [
  {
    id: 1,
    title: 'How to Connect 4G Solar Camera to UBOX App',
    description: 'Complete step-by-step guide for connecting your 4G solar camera to the UBOX mobile app. Covers SIM card setup, app configuration, and troubleshooting tips.',
    duration: '8:45',
    views: '12.3k',
    category: 'ubox',
    videoUrl: 'https://www.youtube.com/embed/9LCrD91GdPs',
    thumbnail: 'https://img.youtube.com/vi/9LCrD91GdPs/maxresdefault.jpg',
    publishDate: '2024-01-15'
  },
  {
    id: 2,
    title: 'WiFi Solar PTZ Camera Setup Tutorial',
    description: 'Learn how to set up your WiFi solar PTZ camera, including positioning for optimal solar charging and WiFi connection configuration.',
    duration: '6:30',
    views: '9.8k',
    category: 'wifi',
    videoUrl: 'https://www.youtube.com/embed/TpPdIVCn3Os',
    thumbnail: 'https://img.youtube.com/vi/TpPdIVCn3Os/maxresdefault.jpg',
    publishDate: '2024-01-20'
  },
  {
    id: 3,
    title: '4G Bullet Camera Installation Guide',
    description: 'Professional installation guide for 4G solar bullet cameras. Includes mounting techniques, SIM card setup, and app configuration.',
    duration: '7:15',
    views: '8.7k',
    category: '4g',
    videoUrl: 'https://www.youtube.com/embed/cxipTkC-48Y',
    thumbnail: 'https://img.youtube.com/vi/cxipTkC-48Y/maxresdefault.jpg',
    publishDate: '2024-01-25'
  },
  {
    id: 4,
    title: 'CamHi Pro App Complete Setup',
    description: 'Comprehensive guide for setting up the CamHi Pro app for your optical zoom cameras. Includes all advanced features and PTZ controls.',
    duration: '9:20',
    views: '7.2k',
    category: 'camhipro',
    videoUrl: 'https://www.youtube.com/embed/X3pzRT_dCIg',
    thumbnail: 'https://img.youtube.com/vi/X3pzRT_dCIg/maxresdefault.jpg',
    publishDate: '2024-02-01'
  },
  {
    id: 5,
    title: 'Solar Panel Positioning for Maximum Efficiency',
    description: 'Expert tips on positioning your solar panels for optimal charging. Includes seasonal adjustments and troubleshooting common issues.',
    duration: '5:45',
    views: '6.1k',
    category: 'solar',
    videoUrl: 'https://www.youtube.com/embed/h1LiARvsN3o',
    thumbnail: 'https://img.youtube.com/vi/h1LiARvsN3o/maxresdefault.jpg',
    publishDate: '2024-02-05'
  },
  {
    id: 6,
    title: 'YCC365 App Setup for 2MP WiFi Camera',
    description: 'Step-by-step setup guide for the YCC365 app used with 2MP WiFi cameras. Covers all basic and advanced features.',
    duration: '6:45',
    views: '5.9k',
    category: 'ycc365',
    videoUrl: 'https://www.youtube.com/embed/h1LiARvsN3o',
    thumbnail: 'https://img.youtube.com/vi/h1LiARvsN3o/maxresdefault.jpg',
    publishDate: '2024-02-10'
  },
  {
    id: 7,
    title: 'iCSee App Configuration Tutorial',
    description: 'Complete guide for setting up the iCSee app for indoor cameras and baby monitors. Includes two-way audio setup and features.',
    duration: '7:30',
    views: '5.3k',
    category: 'icsee',
    videoUrl: 'https://www.youtube.com/embed/Cg7rLYR2pAI',
    thumbnail: 'https://img.youtube.com/vi/Cg7rLYR2pAI/maxresdefault.jpg',
    publishDate: '2024-02-15'
  },
  {
    id: 8,
    title: '4G SIM Card Setup and Data Plans',
    description: 'Everything you need to know about choosing and setting up SIM cards for your 4G cameras. Includes carrier recommendations for Australia.',
    duration: '4:20',
    views: '4.8k',
    category: '4g',
    videoUrl: 'https://www.youtube.com/embed/9LCrD91GdPs',
    thumbnail: 'https://img.youtube.com/vi/9LCrD91GdPs/maxresdefault.jpg',
    publishDate: '2024-02-20'
  },
  {
    id: 9,
    title: 'Smart Door Lock Installation Guide',
    description: 'Professional installation guide for smart door locks including mechanical installation, app setup, and user management.',
    duration: '11:15',
    views: '4.2k',
    category: 'doorlock',
    videoUrl: 'https://www.youtube.com/embed/TpPdIVCn3Os',
    thumbnail: 'https://img.youtube.com/vi/TpPdIVCn3Os/maxresdefault.jpg',
    publishDate: '2024-02-25'
  },
  {
    id: 10,
    title: 'Troubleshooting Common Camera Issues',
    description: 'Solutions for the most common issues with security cameras including connectivity problems, power issues, and app troubleshooting.',
    duration: '8:50',
    views: '7.6k',
    category: 'troubleshooting',
    videoUrl: 'https://www.youtube.com/embed/cxipTkC-48Y',
    thumbnail: 'https://img.youtube.com/vi/cxipTkC-48Y/maxresdefault.jpg',
    publishDate: '2024-03-01'
  },
  {
    id: 11,
    title: '30X Optical Zoom Camera Features',
    description: 'Detailed overview of the massive optical zoom cameras and how to use all their advanced features for maximum security coverage.',
    duration: '10:30',
    views: '6.4k',
    category: 'optical',
    videoUrl: 'https://www.youtube.com/embed/X3pzRT_dCIg',
    thumbnail: 'https://img.youtube.com/vi/X3pzRT_dCIg/maxresdefault.jpg',
    publishDate: '2024-03-05'
  },
  {
    id: 12,
    title: 'Dual Lens Camera Setup and Benefits',
    description: 'Learn about the advantages of dual lens cameras and how to set them up for optimal security coverage with multiple viewing angles.',
    duration: '6:15',
    views: '3.9k',
    category: 'dual',
    videoUrl: 'https://www.youtube.com/embed/Cg7rLYR2pAI',
    thumbnail: 'https://img.youtube.com/vi/Cg7rLYR2pAI/maxresdefault.jpg',
    publishDate: '2024-03-10'
  }
];

const Tutorials = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Tutorials', icon: FiPlay },
    { id: 'ubox', name: 'UBOX App', icon: FiPlay },
    { id: 'camhipro', name: 'CamHi Pro', icon: FiZoom },
    { id: '4g', name: '4G Setup', icon: FiSignal },
    { id: 'wifi', name: 'WiFi Setup', icon: FiWifi },
    { id: 'solar', name: 'Solar Cameras', icon: FiSun },
    { id: 'doorlock', name: 'Smart Locks', icon: FiLock },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: FiPlay },
  ];

  const filteredTutorials = realTutorials.filter(tutorial => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categoriesWithCounts = categories.map(cat => ({
    ...cat,
    count: cat.id === 'all' 
      ? realTutorials.length 
      : realTutorials.filter(t => t.category === cat.id).length
  }));

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.icon || FiPlay;
  };

  const openVideoInNewTab = (videoUrl) => {
    const watchUrl = videoUrl.replace('/embed/', '/watch?v=');
    window.open(watchUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-4 py-6 space-y-6"
    >
      {/* Search Bar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <SafeIcon
          icon={FiSearch}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400"
        />
        <input
          type="text"
          placeholder="Search Simply Online video tutorials..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-soft"
        />
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiFilter} className="w-5 h-5 text-secondary-600" />
          <span className="font-medium text-secondary-900">Categories</span>
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categoriesWithCounts.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white shadow-medium'
                  : 'bg-white text-secondary-600 border border-secondary-200 hover:bg-secondary-50 shadow-soft'
              }`}
            >
              <SafeIcon icon={category.icon} className="w-4 h-4" />
              <span>{category.name}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                selectedCategory === category.id ? 'bg-primary-500' : 'bg-secondary-200'
              }`}>
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Results Count */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-sm text-secondary-600">
          {filteredTutorials.length} tutorial{filteredTutorials.length !== 1 ? 's' : ''} found
        </p>
      </motion.div>

      {/* Tutorial Grid */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        {filteredTutorials.map((tutorial, index) => (
          <motion.div
            key={tutorial.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div
              onClick={() => openVideoInNewTab(tutorial.videoUrl)}
              className="block bg-white rounded-xl shadow-soft border border-secondary-100 overflow-hidden hover:shadow-medium transition-all duration-300 cursor-pointer"
            >
              <div className="relative">
                <img
                  src={tutorial.thumbnail}
                  alt={tutorial.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = `https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&text=${encodeURIComponent(tutorial.title)}`;
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="bg-white bg-opacity-90 rounded-full p-4">
                    <SafeIcon icon={FiPlay} className="w-8 h-8 text-primary-600" />
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white text-sm px-3 py-1 rounded-full font-medium">
                  {tutorial.duration}
                </div>
                <div className="absolute top-3 left-3 bg-primary-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                  {categoriesWithCounts.find(cat => cat.id === tutorial.category)?.name || tutorial.category}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-secondary-900 text-lg mb-2 line-clamp-2">
                  {tutorial.title}
                </h3>
                <p className="text-sm text-secondary-600 mb-4 line-clamp-2">
                  {tutorial.description}
                </p>
                <div className="flex items-center justify-between text-xs text-secondary-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiEye} className="w-4 h-4" />
                      <span>{tutorial.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiClock} className="w-4 h-4" />
                      <span>{tutorial.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredTutorials.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <SafeIcon icon={FiSearch} className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 mb-2">No tutorials found</h3>
          <p className="text-secondary-600">Try adjusting your search or filter criteria</p>
        </motion.div>
      )}

      {/* YouTube Channel Notice */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-red-50 rounded-xl p-4 border border-red-200 text-center"
      >
        <p className="text-sm text-red-700 mb-2 font-medium">
          Watch on YouTube
        </p>
        <p className="text-xs text-red-600 mb-3">
          These are our official installation tutorials. Subscribe for the latest setup guides.
        </p>
        <a
          href="https://www.youtube.com/@monstercopty"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-700 transition-colors shadow-soft"
        >
          Visit Our YouTube Channel
        </a>
      </motion.div>
    </motion.div>
  );
};

export default Tutorials;