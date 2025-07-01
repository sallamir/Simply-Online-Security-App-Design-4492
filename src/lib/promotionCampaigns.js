// Promotional Campaign Templates for Simply Online Australia
import { PromotionSystem } from './promotionSystem';

export class PromotionCampaigns {
  
  // Flash Sale Campaigns
  static async launchFlashSale(products = ['solar'], discount = 25, durationDays = 3) {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + durationDays);

    const promotion = await PromotionSystem.createPromotion({
      name: `Flash Sale - ${discount}% Off ${products.join(', ')}`,
      type: 'flash_sale',
      discountCode: `FLASH${discount}`,
      discountPercentage: discount,
      targetProducts: products,
      targetAudience: 'all',
      startDate: new Date().toISOString(),
      endDate: endDate.toISOString(),
      notificationTitle: `🔥 Flash Sale: ${discount}% Off ${this.getProductName(products)}!`,
      notificationBody: 'Limited time offer! Free shipping Australia-wide.',
      maxUses: 100
    });

    // Send notification immediately
    await PromotionSystem.sendPromotionNotification(promotion.id);
    return promotion;
  }

  // Seasonal Campaigns
  static async launchSeasonalSale(season = 'summer', discount = 30) {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 14); // 2 weeks

    const promotion = await PromotionSystem.createPromotion({
      name: `${season.charAt(0).toUpperCase() + season.slice(1)} Security Sale`,
      type: 'seasonal',
      discountCode: `${season.toUpperCase()}${discount}`,
      discountPercentage: discount,
      targetProducts: ['solar', 'outdoor'],
      targetAudience: 'all',
      startDate: new Date().toISOString(),
      endDate: endDate.toISOString(),
      notificationTitle: `🌞 ${season.charAt(0).toUpperCase() + season.slice(1)} Sale - ${discount}% Off`,
      notificationBody: `Perfect time for outdoor security! Save ${discount}% on solar cameras.`,
      minOrderAmount: 200
    });

    await PromotionSystem.sendPromotionNotification(promotion.id);
    return promotion;
  }

  // New Customer Welcome
  static async createWelcomeOffer(discount = 15) {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30); // Valid for 30 days

    return await PromotionSystem.createPromotion({
      name: 'New Customer Welcome Offer',
      type: 'new_customer',
      discountCode: `WELCOME${discount}`,
      discountPercentage: discount,
      targetProducts: ['all'],
      targetAudience: 'new_customers',
      startDate: new Date().toISOString(),
      endDate: endDate.toISOString(),
      notificationTitle: `🎉 Welcome! Get ${discount}% Off Your First Order`,
      notificationBody: 'Start securing your property with our premium cameras.',
      minOrderAmount: 100
    });
  }

  // Product-Specific Campaigns
  static async launch4GCameraSale(discount = 20) {
    const promotion = await PromotionSystem.createPromotion({
      name: '4G Camera Special Sale',
      type: 'product_specific',
      discountCode: `4G${discount}`,
      discountPercentage: discount,
      targetProducts: ['4g'],
      targetAudience: 'all',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      notificationTitle: `📱 4G Camera Special - ${discount}% Off`,
      notificationBody: 'Perfect for remote monitoring! Save on all 4G cameras.',
      minOrderAmount: 150
    });

    await PromotionSystem.sendPromotionNotification(promotion.id);
    return promotion;
  }

  static async launchSolarCameraSale(discount = 25) {
    const promotion = await PromotionSystem.createPromotion({
      name: 'Solar Camera Eco Sale',
      type: 'product_specific',
      discountCode: `SOLAR${discount}`,
      discountPercentage: discount,
      targetProducts: ['solar'],
      targetAudience: 'all',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days
      notificationTitle: `☀️ Solar Camera Sale - ${discount}% Off`,
      notificationBody: 'Go green and save! Eco-friendly solar cameras on sale.',
      minOrderAmount: 200
    });

    await PromotionSystem.sendPromotionNotification(promotion.id);
    return promotion;
  }

  // Bundle Campaigns
  static async launchBundleDeal() {
    const promotion = await PromotionSystem.createPromotion({
      name: 'Complete Security Bundle',
      type: 'bundle',
      discountCode: 'BUNDLE30',
      discountPercentage: 30,
      targetProducts: ['solar', 'accessories'],
      targetAudience: 'all',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days
      notificationTitle: '📦 Complete Security Bundle - 30% Off',
      notificationBody: 'Camera + Solar Panel + Accessories = Maximum Savings!',
      minOrderAmount: 500
    });

    await PromotionSystem.sendPromotionNotification(promotion.id);
    return promotion;
  }

  // Helper methods
  static getProductName(products) {
    const productNames = {
      'solar': 'Solar Cameras',
      '4g': '4G Cameras', 
      'wifi': 'WiFi Cameras',
      'accessories': 'Accessories',
      'doorlock': 'Smart Locks'
    };

    if (products.length === 1) {
      return productNames[products[0]] || products[0];
    } else if (products.length === 2) {
      return `${productNames[products[0]]} & ${productNames[products[1]]}`;
    } else {
      return 'Selected Products';
    }
  }

  // Automated Campaign Scheduler
  static async scheduleAutomatedCampaigns() {
    // Schedule weekly flash sales
    setInterval(async () => {
      const day = new Date().getDay();
      if (day === 5) { // Friday flash sales
        await this.launchFlashSale(['solar'], 20, 2); // Weekend sale
      }
    }, 24 * 60 * 60 * 1000); // Check daily

    // Schedule seasonal campaigns
    const month = new Date().getMonth();
    if (month === 11 || month === 0 || month === 1) { // Summer in Australia
      await this.launchSeasonalSale('summer', 25);
    }
  }

  // Analytics for campaigns
  static async getCampaignAnalytics(campaignId) {
    // This would integrate with your analytics system
    return {
      impressions: 1250,
      clicks: 340,
      conversions: 45,
      revenue: 12500,
      roi: 3.2
    };
  }
}

// Quick campaign launchers for admin use
export const quickCampaigns = {
  // Weekend Flash Sale
  weekendSale: () => PromotionCampaigns.launchFlashSale(['solar'], 25, 2),
  
  // 4G Special
  fourGSpecial: () => PromotionCampaigns.launch4GCameraSale(20),
  
  // New Customer Welcome
  newCustomer: () => PromotionCampaigns.createWelcomeOffer(15),
  
  // Bundle Deal
  bundleDeal: () => PromotionCampaigns.launchBundleDeal(),
  
  // Clearance Sale
  clearance: async () => {
    const promotion = await PromotionSystem.createPromotion({
      name: 'Warehouse Clearance',
      type: 'clearance',
      discountCode: 'CLEARANCE40',
      discountPercentage: 40,
      targetProducts: ['clearance'],
      targetAudience: 'all',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      notificationTitle: '📦 Warehouse Clearance - Up to 40% Off',
      notificationBody: 'Last chance! Previous generation models at massive discounts.',
      minOrderAmount: 100
    });
    
    await PromotionSystem.sendPromotionNotification(promotion.id);
    return promotion;
  }
};

export default PromotionCampaigns;