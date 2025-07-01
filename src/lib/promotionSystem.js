// Promotion and Discount Code Management System
import supabase from './supabase';
import { NotificationService } from './pushNotifications';

export class PromotionSystem {
  // Create a new promotion campaign
  static async createPromotion({
    name,
    type, // 'flash_sale', 'seasonal', 'new_customer', 'clearance'
    discountCode,
    discountPercentage = null,
    discountAmount = null,
    targetProducts = [],
    targetAudience = 'all', // 'all', 'new_customers', 'existing_customers'
    minOrderAmount = null,
    maxUses = null,
    startDate,
    endDate,
    notificationTitle,
    notificationBody
  }) {
    try {
      const { data, error } = await supabase
        .from('promotion_campaigns_so2024')
        .insert({
          name,
          type,
          discount_code: discountCode,
          discount_percentage: discountPercentage,
          discount_amount: discountAmount,
          target_products: targetProducts,
          target_audience: targetAudience,
          min_order_amount: minOrderAmount,
          max_uses: maxUses,
          start_date: startDate,
          end_date: endDate,
          notification_title: notificationTitle,
          notification_body: notificationBody,
          is_active: true,
          uses_count: 0
        });

      if (error) throw error;

      console.log('Promotion created:', data);
      return data[0];
    } catch (error) {
      console.error('Error creating promotion:', error);
      throw error;
    }
  }

  // Send promotion notification
  static async sendPromotionNotification(promotionId) {
    try {
      const { data: promotion, error } = await supabase
        .from('promotion_campaigns_so2024')
        .select('*')
        .eq('id', promotionId)
        .single();

      if (error) throw error;

      // Send notification using the notification service
      await NotificationService.sendPromotionNotification(
        promotion.notification_title,
        promotion.notification_body,
        promotion.discount_code,
        promotion.target_products
      );

      console.log('Promotion notification sent for:', promotion.name);
      return true;
    } catch (error) {
      console.error('Error sending promotion notification:', error);
      throw error;
    }
  }

  // Get active promotions
  static async getActivePromotions() {
    try {
      const { data, error } = await supabase
        .from('promotion_campaigns_so2024')
        .select('*')
        .eq('is_active', true)
        .gte('end_date', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching active promotions:', error);
      return [];
    }
  }

  // Validate discount code
  static async validateDiscountCode(code, orderTotal = 0) {
    try {
      const { data, error } = await supabase
        .from('promotion_campaigns_so2024')
        .select('*')
        .eq('discount_code', code)
        .eq('is_active', true)
        .gte('end_date', new Date().toISOString())
        .lte('start_date', new Date().toISOString())
        .single();

      if (error) throw error;

      const promotion = data;

      // Check minimum order amount
      if (promotion.min_order_amount && orderTotal < promotion.min_order_amount) {
        return {
          valid: false,
          reason: `Minimum order amount is $${promotion.min_order_amount}`,
          promotion: null
        };
      }

      // Check usage limits
      if (promotion.max_uses && promotion.uses_count >= promotion.max_uses) {
        return {
          valid: false,
          reason: 'This promotion code has reached its usage limit',
          promotion: null
        };
      }

      return {
        valid: true,
        promotion,
        discountAmount: promotion.discount_amount,
        discountPercentage: promotion.discount_percentage
      };
    } catch (error) {
      return {
        valid: false,
        reason: 'Invalid or expired promotion code',
        promotion: null
      };
    }
  }

  // Apply discount code (increment usage)
  static async applyDiscountCode(code) {
    try {
      const { data, error } = await supabase
        .rpc('increment_promotion_usage', { promo_code: code });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error applying discount code:', error);
      return false;
    }
  }

  // Predefined promotion templates
  static getPromotionTemplates() {
    return {
      flashSale: {
        name: 'Solar Camera Flash Sale',
        type: 'flash_sale',
        discountCode: 'SOLAR25',
        discountPercentage: 25,
        targetProducts: ['solar'],
        targetAudience: 'all',
        notificationTitle: '🔥 Flash Sale: 25% Off Solar Cameras!',
        notificationBody: 'Limited time offer on all solar cameras. Free shipping Australia-wide!'
      },
      newCustomer: {
        name: 'New Customer Welcome',
        type: 'new_customer',
        discountCode: 'WELCOME15',
        discountPercentage: 15,
        targetProducts: ['all'],
        targetAudience: 'new_customers',
        notificationTitle: '🎉 Welcome! Get 15% Off',
        notificationBody: 'Start securing your property with our premium cameras. Use code WELCOME15'
      },
      seasonal: {
        name: 'Summer Security Sale',
        type: 'seasonal',
        discountCode: 'SUMMER30',
        discountPercentage: 30,
        targetProducts: ['outdoor', 'solar'],
        targetAudience: 'all',
        notificationTitle: '🌞 Summer Security Sale - Up to 30% Off',
        notificationBody: 'Perfect weather to install solar cameras! Save big on our complete range.'
      },
      clearance: {
        name: 'Warehouse Clearance',
        type: 'clearance',
        discountCode: 'CLEARANCE40',
        discountPercentage: 40,
        targetProducts: ['clearance'],
        targetAudience: 'all',
        notificationTitle: '📦 Warehouse Clearance - Up to 40% Off',
        notificationBody: 'Last chance to grab previous generation models at massive discounts!'
      }
    };
  }
}

// Quick promotion creation helpers
export const createFlashSale = async (products = ['solar'], discount = 25, duration = 3) => {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + duration);

  return await PromotionSystem.createPromotion({
    name: `Flash Sale - ${discount}% Off`,
    type: 'flash_sale',
    discountCode: `FLASH${discount}`,
    discountPercentage: discount,
    targetProducts: products,
    targetAudience: 'all',
    startDate: new Date().toISOString(),
    endDate: endDate.toISOString(),
    notificationTitle: `🔥 Flash Sale: ${discount}% Off Solar Cameras!`,
    notificationBody: 'Limited time offer! Free shipping Australia-wide.',
    maxUses: 100
  });
};

export const createSeasonalSale = async (season = 'summer', discount = 30) => {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 14); // 2 weeks

  return await PromotionSystem.createPromotion({
    name: `${season.charAt(0).toUpperCase() + season.slice(1)} Sale`,
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
};

export default PromotionSystem;