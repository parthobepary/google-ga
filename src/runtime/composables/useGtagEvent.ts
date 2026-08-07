import { useRuntimeConfig } from '#app'
import type { EcommerceItem } from '../types'

export const useGtagEvent = () => {
  const config = useRuntimeConfig()
  const options = config.public.googleAnalytics
  const currency = options?.currency || 'USD'
  const itemBrand = options?.itemBrand || ''

  const pushEvent = (eventName: string, ecommerceData: Record<string, any>) => {
    if (typeof window === 'undefined') return

    window.dataLayer = window.dataLayer || []
    // Clear previous ecommerce data to prevent contamination
    window.dataLayer.push({ ecommerce: null })
    window.dataLayer.push({
      event: eventName,
      ecommerce: ecommerceData,
    })

    if (options?.debug) {
      console.log(`[nuxt-ga] Event: ${eventName}`, ecommerceData)
    }
  }

  const buildItem = (
    id: string | number,
    name: string,
    price?: number,
    category?: string,
    quantity?: number,
  ): EcommerceItem => ({
    item_id: String(id),
    item_name: name,
    item_brand: itemBrand,
    item_category: category,
    price: price ?? 0,
    quantity: quantity ?? 1,
  })

  return {
    /**
     * Track view of a list of items (e.g., product listing page)
     */
    trackViewItemList: (items: EcommerceItem[], listName?: string) =>
      pushEvent('view_item_list', {
        item_list_name: listName,
        items,
      }),

    /**
     * Track view of a single item (e.g., product detail page)
     */
    trackViewItem: (item: EcommerceItem, value?: number) =>
      pushEvent('view_item', {
        currency,
        value: value ?? item.price ?? 0,
        items: [item],
      }),

    /**
     * Track add to cart action
     */
    trackAddToCart: (item: EcommerceItem, value?: number) =>
      pushEvent('add_to_cart', {
        currency,
        value: value ?? item.price ?? 0,
        items: [item],
      }),

    /**
     * Track remove from cart action
     */
    trackRemoveFromCart: (item: EcommerceItem, value?: number) =>
      pushEvent('remove_from_cart', {
        currency,
        value: value ?? item.price ?? 0,
        items: [item],
      }),

    /**
     * Track view cart action
     */
    trackViewCart: (items: EcommerceItem[], value?: number) =>
      pushEvent('view_cart', {
        currency,
        value: value ?? items.reduce((sum, i) => sum + (i.price ?? 0) * (i.quantity ?? 1), 0),
        items,
      }),

    /**
     * Track begin checkout action
     */
    trackBeginCheckout: (items: EcommerceItem[], value?: number) =>
      pushEvent('begin_checkout', {
        currency,
        value: value ?? items.reduce((sum, i) => sum + (i.price ?? 0) * (i.quantity ?? 1), 0),
        items,
      }),

    /**
     * Track add payment info action
     */
    trackAddPaymentInfo: (items: EcommerceItem[], value?: number, paymentType?: string) =>
      pushEvent('add_payment_info', {
        currency,
        value: value ?? items.reduce((sum, i) => sum + (i.price ?? 0) * (i.quantity ?? 1), 0),
        payment_type: paymentType,
        items,
      }),

    /**
     * Track purchase completion
     */
    trackPurchase: (transactionId: string, items: EcommerceItem[], value: number, extra?: {
      tax?: number
      shipping?: number
      coupon?: string
    }) =>
      pushEvent('purchase', {
        transaction_id: transactionId,
        currency,
        value,
        tax: extra?.tax,
        shipping: extra?.shipping,
        coupon: extra?.coupon,
        items,
      }),

    /**
     * Track refund
     */
    trackRefund: (transactionId: string, items?: EcommerceItem[], value?: number) =>
      pushEvent('refund', {
        transaction_id: transactionId,
        currency,
        value,
        items,
      }),

    /**
     * Track item selection from a list
     */
    trackSelectItem: (item: EcommerceItem, listName?: string) =>
      pushEvent('select_item', {
        item_list_name: listName,
        items: [item],
      }),

    /**
     * Track add to wishlist
     */
    trackAddToWishlist: (item: EcommerceItem, value?: number) =>
      pushEvent('add_to_wishlist', {
        currency,
        value: value ?? item.price ?? 0,
        items: [item],
      }),

    /**
     * Track promotion view
     */
    trackViewPromotion: (promotionId: string, promotionName: string, creativeName?: string, creativeSlot?: string, items?: EcommerceItem[]) =>
      pushEvent('view_promotion', {
        promotion_id: promotionId,
        promotion_name: promotionName,
        creative_name: creativeName,
        creative_slot: creativeSlot,
        items,
      }),

    /**
     * Track promotion click/selection
     */
    trackSelectPromotion: (promotionId: string, promotionName: string, creativeName?: string, creativeSlot?: string, items?: EcommerceItem[]) =>
      pushEvent('select_promotion', {
        promotion_id: promotionId,
        promotion_name: promotionName,
        creative_name: creativeName,
        creative_slot: creativeSlot,
        items,
      }),

    /**
     * Track shipping info added
     */
    trackAddShippingInfo: (items: EcommerceItem[], value?: number, shippingTier?: string) =>
      pushEvent('add_shipping_info', {
        currency,
        value: value ?? items.reduce((sum, i) => sum + (i.price ?? 0) * (i.quantity ?? 1), 0),
        shipping_tier: shippingTier,
        items,
      }),

    /**
     * Track search
     */
    trackSearch: (searchTerm: string) =>
      pushEvent('search', {
        search_term: searchTerm,
      }),

    /**
     * Helper to build an item object
     */
    buildItem,

    /**
     * Push a custom ecommerce event
     */
    pushEvent,
  }
}
