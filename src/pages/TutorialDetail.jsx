import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiPlay, FiClock, FiEye, FiThumbsUp, FiShare, FiBookmark, FiChevronRight } = FiIcons;

const TutorialDetail = () => {
  const { id } = useParams();

  // Mock data - in a real app, this would come from an API
  const tutorial = {
    id: parseInt(id),
    title: 'Complete Ubox Camera Setup Guide',
    description: 'Step-by-step installation and configuration of your Ubox security camera system. This comprehensive tutorial covers everything from unboxing to advanced configuration.',
    duration: '8:45',
    views: '3.2k',
    likes: 245,
    category: 'Ubox Tutorials',
    publishDate: '2024-01-15',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    chapters: [
      { time: '0:00', title: 'Introduction & Overview' },
      { time: '1:15', title: 'Unboxing Your Ubox Camera' },
      { time: '2:30', title: 'Choosing Installation Location' },
      { time: '3:45', title: 'Physical Installation Process' },
      { time: '5:00', title: 'Ubox App Setup & Configuration' },
      { time: '6:30', title: 'WiFi Connection & Testing' },
      { time: '7:45', title: 'Final Settings & Tips' },
    ],
    relatedTutorials: [
      {
        id: 6,
        title: 'Ubox Night Vision Optimization',
        duration: '7:45',
        thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=300&h=200&fit=crop',
        views: '2.3k'
      },
      {
        id: 2,
        title: 'Camhipro App Configuration',
        duration: '6:30',
        thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=200&fit=crop',
        views: '2.8k'
      }
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-4 py-6 space-y-6"
    >
      {/* Video Player */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl overflow-hidden shadow-sm border border-secondary-200"
      >
        <div className="video-responsive">
          <iframe
            src={tutorial.videoUrl}
            title={tutorial.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </motion.div>

      {/* Tutorial Info */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200"
      >
        <div className="space-y-4">
          {/* Title and Stats */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full">
                {tutorial.category}
              </span>
            </div>
            <h1 className="text-xl font-bold text-secondary-900 mb-2">{tutorial.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-secondary-600">
              <div className="flex items-center space-x-1">
                <SafeIcon icon={FiClock} className="w-4 h-4" />
                <span>{tutorial.duration}</span>
              </div>
              <div className="flex items-center space-x-1">
                <SafeIcon icon={FiEye} className="w-4 h-4" />
                <span>{tutorial.views} views</span>
              </div>
              <div className="flex items-center space-x-1">
                <SafeIcon icon={FiThumbsUp} className="w-4 h-4" />
                <span>{tutorial.likes}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-secondary-700 leading-relaxed">{tutorial.description}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3 pt-2">
            <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              <SafeIcon icon={FiThumbsUp} className="w-4 h-4" />
              <span>Like</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-secondary-200 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors">
              <SafeIcon icon={FiBookmark} className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-secondary-200 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors">
              <SafeIcon icon={FiShare} className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Video Chapters */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200"
      >
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Video Chapters</h3>
        <div className="space-y-2">
          {tutorial.chapters.map((chapter, index) => (
            <button
              key={index}
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary-50 transition-colors text-left"
            >
              <span className="text-sm font-mono text-primary-600 min-w-0">
                {chapter.time}
              </span>
              <span className="text-sm text-secondary-900 flex-1">
                {chapter.title}
              </span>
              <SafeIcon icon={FiPlay} className="w-4 h-4 text-secondary-400" />
            </button>
          ))}
        </div>
      </motion.div>

      {/* Related Tutorials */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-secondary-900">Related Tutorials</h3>
          <Link to="/tutorials" className="text-primary-600 text-sm font-medium">
            View All
          </Link>
        </div>
        <div className="space-y-3">
          {tutorial.relatedTutorials.map((relatedTutorial) => (
            <Link
              key={relatedTutorial.id}
              to={`/tutorials/${relatedTutorial.id}`}
              className="flex items-center space-x-4 p-3 rounded-lg hover:bg-secondary-50 transition-colors"
            >
              <div className="relative">
                <img
                  src={relatedTutorial.thumbnail}
                  alt={relatedTutorial.title}
                  className="w-16 h-12 rounded-lg object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center">
                  <SafeIcon icon={FiPlay} className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-secondary-900 truncate">{relatedTutorial.title}</h4>
                <div className="flex items-center space-x-3 mt-1 text-sm text-secondary-600">
                  <span>{relatedTutorial.duration}</span>
                  <span>{relatedTutorial.views} views</span>
                </div>
              </div>
              <SafeIcon icon={FiChevronRight} className="w-5 h-5 text-secondary-400" />
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TutorialDetail;