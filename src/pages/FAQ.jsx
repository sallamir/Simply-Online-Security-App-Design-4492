import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useFAQs } from '../hooks/useSupabase';

const { FiSearch, FiChevronDown, FiChevronUp, FiHelpCircle, FiSettings, FiTool, FiStar, FiTruck, FiLoader } = FiIcons;

const FAQ = () => {
  const { faqs, loading, error } = useFAQs();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState(new Set());

  const faqCategories = [
    { id: 'general', title: 'General Information', icon: FiHelpCircle },
    { id: 'installation', title: 'Installation & Setup', icon: FiSettings },
    { id: 'troubleshooting', title: 'Troubleshooting', icon: FiTool },
    { id: 'features', title: 'Product Features', icon: FiStar },
    { id: 'shipping', title: 'Shipping & Support', icon: FiTruck }
  ];

  const categorizedFaqs = faqCategories.map(category => ({
    ...category,
    faqs: faqs.filter(faq => faq.category === category.id)
  }));

  const allFaqs = faqs.map(faq => ({
    ...faq,
    categoryTitle: faqCategories.find(cat => cat.id === faq.category)?.title || faq.category
  }));

  const filteredFaqs = searchTerm ?
    allFaqs.filter(faq =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    ) : null;

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <SafeIcon icon={FiLoader} className="w-8 h-8 text-primary-600" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-6 text-center">
        <p className="text-red-600">Error loading FAQs: {error}</p>
      </div>
    );
  }

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
          placeholder="Search Simply Online FAQs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-soft"
        />
      </motion.div>

      {/* Search Results */}
      {filteredFaqs && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="space-y-3"
        >
          <p className="text-sm text-secondary-600">
            {filteredFaqs.length} question{filteredFaqs.length !== 1 ? 's' : ''} found
          </p>
          {filteredFaqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.05 * index }}
              className="bg-white rounded-xl border border-secondary-100 overflow-hidden shadow-soft"
            >
              <button
                onClick={() => toggleExpanded(faq.id)}
                className="w-full px-5 py-4 text-left hover:bg-secondary-50 transition-colors touch-target"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 pr-4">
                    <h3 className="font-medium text-secondary-900">{faq.question}</h3>
                    <p className="text-xs text-primary-600 mt-1 font-medium">{faq.categoryTitle}</p>
                  </div>
                  <SafeIcon
                    icon={expandedItems.has(faq.id) ? FiChevronUp : FiChevronDown}
                    className="w-5 h-5 text-secondary-500 flex-shrink-0"
                  />
                </div>
              </button>
              <AnimatePresence>
                {expandedItems.has(faq.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-secondary-100"
                  >
                    <div className="px-5 py-4 bg-secondary-25">
                      <p className="text-secondary-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Categories */}
      {!searchTerm && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {categorizedFaqs.map((category, categoryIndex) => (
            category.faqs.length > 0 && (
              <motion.div
                key={category.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * categoryIndex }}
                className="bg-white rounded-xl border border-secondary-100 overflow-hidden shadow-soft"
              >
                {/* Category Header */}
                <div className="bg-secondary-50 px-5 py-4 border-b border-secondary-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                      <SafeIcon icon={category.icon} className="w-5 h-5 text-primary-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-secondary-900">{category.title}</h2>
                    <span className="ml-auto text-xs bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-medium">
                      {category.faqs.length}
                    </span>
                  </div>
                </div>

                {/* FAQs */}
                <div className="divide-y divide-secondary-100">
                  {category.faqs.map((faq, faqIndex) => (
                    <div key={faq.id}>
                      <button
                        onClick={() => toggleExpanded(faq.id)}
                        className="w-full px-5 py-4 text-left hover:bg-secondary-50 transition-colors touch-target"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-secondary-900 pr-4">{faq.question}</h3>
                          <SafeIcon
                            icon={expandedItems.has(faq.id) ? FiChevronUp : FiChevronDown}
                            className="w-5 h-5 text-secondary-500 flex-shrink-0"
                          />
                        </div>
                      </button>
                      <AnimatePresence>
                        {expandedItems.has(faq.id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-secondary-100"
                          >
                            <div className="px-5 py-4 bg-secondary-25">
                              <p className="text-secondary-700 leading-relaxed">{faq.answer}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          ))}
        </motion.div>
      )}

      {/* No Results */}
      {filteredFaqs && filteredFaqs.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <SafeIcon icon={FiHelpCircle} className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 mb-2">No questions found</h3>
          <p className="text-secondary-600 mb-4">Try different search terms or browse categories below</p>
          <button
            onClick={() => setSearchTerm('')}
            className="text-primary-600 font-medium hover:text-primary-700"
          >
            View all categories
          </button>
        </motion.div>
      )}

      {/* Contact Support */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-6 text-center border border-primary-200"
      >
        <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <SafeIcon icon={FiHelpCircle} className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-primary-900 mb-2">Still need help?</h3>
        <p className="text-primary-700 text-sm mb-4">
          Can't find the answer you're looking for? Contact our Simply Online support team.
        </p>
        <div className="flex space-x-3 justify-center">
          <a
            href="tel:0261892020"
            className="bg-primary-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-soft"
          >
            Call (02) 6189 2020
          </a>
          <a
            href="mailto:Info@simplyonline.com.au"
            className="bg-white text-primary-600 border border-primary-600 px-4 py-2 rounded-xl font-medium hover:bg-primary-50 transition-colors"
          >
            Send Email
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FAQ;