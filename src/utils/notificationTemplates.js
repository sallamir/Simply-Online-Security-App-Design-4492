// Notification Templates for Simply Online Australia

export const NotificationTemplates = {
  // Promotion Templates
  promotions: {
    flashSale: {
      title: '🔥 Flash Sale: 20% Off Solar Cameras!',
      body: 'Limited time offer on all 4G Solar PTZ cameras. Free shipping Australia-wide!',
      data: {
        type: 'promotion',
        code: 'SOLAR20',
        products: ['4g-solar'],
        urgent: true
      }
    },
    newCustomer: {
      title: '🎉 Welcome! Get 15% Off Your First Order',
      body: 'Start securing your property with our premium solar cameras. Use code WELCOME15.',
      data: {
        type: 'promotion',
        code: 'WELCOME15',
        products: ['all'],
        newCustomer: true
      }
    },
    seasonalSale: {
      title: '🌞 Summer Security Sale - Up to 30% Off',
      body: 'Perfect weather to install solar cameras! Save big on our complete range.',
      data: {
        type: 'promotion',
        code: 'SUMMER30',
        products: ['solar', 'outdoor'],
        seasonal: true
      }
    },
    clearance: {
      title: '📦 Warehouse Clearance - Limited Stock',
      body: 'Last chance to grab previous generation models at massive discounts!',
      data: {
        type: 'promotion',
        code: 'CLEARANCE',
        products: ['clearance'],
        urgent: true
      }
    }
  },

  // Tutorial Templates
  tutorials: {
    newGuide: {
      title: '📹 New Tutorial: Complete Setup Guide',
      body: 'Learn how to install your {tutorialType} camera in under 10 minutes',
      data: {
        type: 'new_tutorial',
        category: '{category}',
        difficulty: 'beginner'
      }
    },
    troubleshooting: {
      title: '🔧 New Tutorial: Fixing Common Issues',
      body: 'Solve the most common camera problems with our expert guide',
      data: {
        type: 'new_tutorial',
        category: 'troubleshooting',
        difficulty: 'intermediate'
      }
    },
    advanced: {
      title: '🎯 Advanced Tutorial: Pro Configuration',
      body: 'Unlock advanced features and optimize your camera performance',
      data: {
        type: 'new_tutorial',
        category: 'advanced',
        difficulty: 'advanced'
      }
    }
  },

  // Product Launch Templates
  products: {
    newCamera: {
      title: '🚀 NEW: {productName}',
      body: 'Introducing our latest innovation in security technology. Pre-order now!',
      data: {
        type: 'new_product',
        category: '{category}',
        preOrder: true
      }
    },
    backInStock: {
      title: '✅ Back in Stock: {productName}',
      body: 'Your favorite camera is available again. Order now before it sells out!',
      data: {
        type: 'new_product',
        category: '{category}',
        restock: true
      }
    },
    upgrade: {
      title: '⬆️ Upgraded: {productName} v2.0',
      body: 'Enhanced features, better performance. See what\'s new in the latest version.',
      data: {
        type: 'new_product',
        category: '{category}',
        upgrade: true
      }
    }
  },

  // Support & FAQ Templates
  support: {
    faqUpdate: {
      title: '💡 FAQ Updated: {topic}',
      body: 'New answers to common questions about {topic}. Get the latest info!',
      data: {
        type: 'faq_update',
        section: '{section}',
        priority: 'medium'
      }
    },
    maintenanceTips: {
      title: '🔧 Camera Maintenance Tips',
      body: 'Keep your cameras running perfectly with our seasonal maintenance guide',
      data: {
        type: 'general',
        category: 'maintenance',
        seasonal: true
      }
    },
    supportHours: {
      title: '📞 Extended Support Hours This Week',
      body: 'Our team is available for longer hours to help with your camera setup',
      data: {
        type: 'general',
        category: 'support',
        temporary: true
      }
    }
  },

  // General Announcements
  general: {
    companyNews: {
      title: '🏆 Simply Online Wins Security Innovation Award',
      body: 'Thank you for trusting us with your security needs. See our latest recognition!',
      data: {
        type: 'general',
        category: 'news',
        priority: 'low'
      }
    },
    weatherAlert: {
      title: '🌪️ Severe Weather Alert - Camera Care Tips',
      body: 'Protect your cameras during extreme weather. Follow our emergency guide.',
      data: {
        type: 'general',
        category: 'weather',
        urgent: true
      }
    },
    appUpdate: {
      title: '📱 App Update Available',
      body: 'New features and improved performance. Update now for the best experience.',
      data: {
        type: 'general',
        category: 'app_update',
        version: '2.1.0'
      }
    }
  }
};

// Template Helper Functions
export const TemplateHelpers = {
  // Replace placeholders in templates
  fillTemplate(template, variables = {}) {
    let title = template.title;
    let body = template.body;

    // Replace variables in title and body
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      title = title.replace(new RegExp(placeholder, 'g'), value);
      body = body.replace(new RegExp(placeholder, 'g'), value);
    });

    return {
      ...template,
      title,
      body,
      data: {
        ...template.data,
        ...variables
      }
    };
  },

  // Get template by category and type
  getTemplate(category, type) {
    return NotificationTemplates[category]?.[type] || null;
  },

  // Get all templates for a category
  getCategoryTemplates(category) {
    return NotificationTemplates[category] || {};
  },

  // Create a custom notification
  createCustom(title, body, type = 'general', data = {}) {
    return {
      title,
      body,
      data: {
        type,
        ...data,
        custom: true
      }
    };
  },

  // Add urgency indicators
  makeUrgent(template) {
    return {
      ...template,
      title: `🚨 URGENT: ${template.title}`,
      data: {
        ...template.data,
        urgent: true,
        priority: 'high'
      }
    };
  },

  // Add emoji based on type - Fixed regex with Unicode flag
  addEmoji(template) {
    const emojiMap = {
      promotion: '🔥',
      new_tutorial: '📹',
      new_product: '🚀',
      faq_update: '💡',
      general: '🔔'
    };

    const emoji = emojiMap[template.data.type] || '🔔';
    
    // Fixed: Use Unicode flag and proper emoji handling
    const emojiPattern = /^[\u{1F300}-\u{1F9FF}]\s*/u;
    const titleWithoutEmoji = template.title.replace(emojiPattern, '');
    
    return {
      ...template,
      title: `${emoji} ${titleWithoutEmoji}`
    };
  }
};

// Predefined notification campaigns
export const NotificationCampaigns = {
  // New customer onboarding series
  onboarding: [
    {
      delay: 0, // Immediate
      template: NotificationTemplates.promotions.newCustomer
    },
    {
      delay: 24 * 60 * 60 * 1000, // 24 hours
      template: NotificationTemplates.tutorials.newGuide,
      variables: { tutorialType: 'first', category: 'beginner' }
    },
    {
      delay: 7 * 24 * 60 * 60 * 1000, // 7 days
      template: NotificationTemplates.support.maintenanceTips
    }
  ],

  // Holiday promotions
  holidays: {
    christmas: NotificationTemplates.promotions.seasonalSale,
    newYear: TemplateHelpers.fillTemplate(
      NotificationTemplates.promotions.flashSale,
      { code: 'NEWYEAR25', discount: '25%' }
    ),
    easter: TemplateHelpers.fillTemplate(
      NotificationTemplates.promotions.seasonalSale,
      { code: 'EASTER20', discount: '20%' }
    )
  },

  // Product launch sequence
  productLaunch: [
    {
      phase: 'teaser',
      template: TemplateHelpers.createCustom(
        '🔮 Something Big is Coming...',
        'A revolutionary new camera is almost here. Be the first to know!',
        'general'
      )
    },
    {
      phase: 'announcement',
      template: NotificationTemplates.products.newCamera
    },
    {
      phase: 'availability',
      template: NotificationTemplates.products.backInStock
    }
  ]
};

export default { NotificationTemplates, TemplateHelpers, NotificationCampaigns };