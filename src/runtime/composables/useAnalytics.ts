import { useRuntimeConfig } from '#app'
import type { EcommerceItem } from '../types'

/**
 * Simple, unified analytics composable
 * Easy to use API for all tracking needs
 */
export const useAnalytics = () => {
  const config = useRuntimeConfig()
  const options = config.public.googleAnalytics
  const currency = options?.currency || 'USD'
  const itemBrand = options?.itemBrand || ''

  // ============================================
  // DataLayer Helpers
  // ============================================

  /**
   * Push data to dataLayer
   */
  const push = (data: Record<string, any>) => {
    if (typeof window === 'undefined') return
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push(data)

    if (options?.debug) {
      console.log('[nuxt-ga] Push:', data)
    }
  }

  /**
   * Clear dataLayer
   */
  const clear = () => {
    if (typeof window === 'undefined') return
    window.dataLayer = []

    if (options?.debug) {
      console.log('[nuxt-ga] DataLayer cleared')
    }
  }

  /**
   * Clear ecommerce data only
   */
  const clearEcommerce = () => {
    push({ ecommerce: null })
  }

  // ============================================
  // Simple Event Tracking
  // ============================================

  /**
   * Track any event (simplest way)
   * @example
   * track('button_click', { button_id: 'cta' })
   * track('sign_up', { method: 'Google' })
   */
  const track = (eventName: string, params?: Record<string, any>) => {
    push({
      event: eventName,
      ...params,
    })
  }

  /**
   * Track page view manually
   */
  const trackPageView = (pagePath?: string, pageTitle?: string) => {
    push({
      event: 'page_view',
      page_path: pagePath || (typeof window !== 'undefined' ? window.location.pathname : ''),
      page_title: pageTitle || (typeof document !== 'undefined' ? document.title : ''),
    })
  }

  // ============================================
  // E-commerce Helpers
  // ============================================

  /**
   * Build an item object for e-commerce tracking
   */
  const item = (
    id: string | number,
    name: string,
    price?: number,
    category?: string,
    quantity?: number,
    extra?: Record<string, any>
  ): EcommerceItem => ({
    item_id: String(id),
    item_name: name,
    item_brand: itemBrand,
    item_category: category,
    price: price ?? 0,
    quantity: quantity ?? 1,
    ...extra,
  })

  /**
   * Push e-commerce event
   */
  const ecommerce = (eventName: string, data: Record<string, any>) => {
    clearEcommerce()
    push({
      event: eventName,
      ecommerce: {
        currency,
        ...data,
      },
    })
  }

  // ============================================
  // E-commerce Events (All GA4 Events)
  // ============================================

  const viewItemList = (items: EcommerceItem[], listName?: string) =>
    ecommerce('view_item_list', { item_list_name: listName, items })

  const viewItem = (items: EcommerceItem | EcommerceItem[], value?: number) => {
    const itemsArray = Array.isArray(items) ? items : [items]
    const total = value ?? itemsArray.reduce((sum, i) => sum + (i.price ?? 0) * (i.quantity ?? 1), 0)
    ecommerce('view_item', { value: total, items: itemsArray })
  }

  const selectItem = (items: EcommerceItem | EcommerceItem[], listName?: string) => {
    const itemsArray = Array.isArray(items) ? items : [items]
    ecommerce('select_item', { item_list_name: listName, items: itemsArray })
  }

  const addToCart = (items: EcommerceItem | EcommerceItem[], value?: number) => {
    const itemsArray = Array.isArray(items) ? items : [items]
    const total = value ?? itemsArray.reduce((sum, i) => sum + (i.price ?? 0) * (i.quantity ?? 1), 0)
    ecommerce('add_to_cart', { value: total, items: itemsArray })
  }

  const removeFromCart = (items: EcommerceItem | EcommerceItem[], value?: number) => {
    const itemsArray = Array.isArray(items) ? items : [items]
    const total = value ?? itemsArray.reduce((sum, i) => sum + (i.price ?? 0) * (i.quantity ?? 1), 0)
    ecommerce('remove_from_cart', { value: total, items: itemsArray })
  }

  const addToWishlist = (items: EcommerceItem | EcommerceItem[], value?: number) => {
    const itemsArray = Array.isArray(items) ? items : [items]
    const total = value ?? itemsArray.reduce((sum, i) => sum + (i.price ?? 0) * (i.quantity ?? 1), 0)
    ecommerce('add_to_wishlist', { value: total, items: itemsArray })
  }

  const viewCart = (items: EcommerceItem[], value?: number) => {
    const total = value ?? items.reduce((sum, i) => sum + (i.price ?? 0) * (i.quantity ?? 1), 0)
    ecommerce('view_cart', { value: total, items })
  }

  const beginCheckout = (items: EcommerceItem[], value?: number, coupon?: string) => {
    const total = value ?? items.reduce((sum, i) => sum + (i.price ?? 0) * (i.quantity ?? 1), 0)
    ecommerce('begin_checkout', { value: total, coupon, items })
  }

  const addShippingInfo = (items: EcommerceItem[], value?: number, shippingTier?: string) => {
    const total = value ?? items.reduce((sum, i) => sum + (i.price ?? 0) * (i.quantity ?? 1), 0)
    ecommerce('add_shipping_info', { value: total, shipping_tier: shippingTier, items })
  }

  const addPaymentInfo = (items: EcommerceItem[], value?: number, paymentType?: string) => {
    const total = value ?? items.reduce((sum, i) => sum + (i.price ?? 0) * (i.quantity ?? 1), 0)
    ecommerce('add_payment_info', { value: total, payment_type: paymentType, items })
  }

  const purchase = (
    transactionId: string,
    items: EcommerceItem[],
    value: number,
    extra?: { tax?: number; shipping?: number; coupon?: string }
  ) => {
    ecommerce('purchase', {
      transaction_id: transactionId,
      value,
      tax: extra?.tax,
      shipping: extra?.shipping,
      coupon: extra?.coupon,
      items,
    })
  }

  const refund = (transactionId: string, items?: EcommerceItem[], value?: number) => {
    ecommerce('refund', { transaction_id: transactionId, value, items })
  }

  const viewPromotion = (promotionId: string, promotionName: string, items?: EcommerceItem[]) => {
    ecommerce('view_promotion', { promotion_id: promotionId, promotion_name: promotionName, items })
  }

  const selectPromotion = (promotionId: string, promotionName: string, items?: EcommerceItem[]) => {
    ecommerce('select_promotion', { promotion_id: promotionId, promotion_name: promotionName, items })
  }

  const search = (searchTerm: string) => {
    track('search', { search_term: searchTerm })
  }

  // ============================================
  // User Tracking
  // ============================================

  const setUserId = (userId: string) => {
    push({ user_id: userId })
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('set', { user_id: userId })
    }
  }

  const setUserProperties = (properties: Record<string, any>) => {
    push({ user_properties: properties })
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('set', 'user_properties', properties)
    }
  }

  // ============================================
  // Common Events (Shortcuts)
  // ============================================

  const login = (method?: string) => track('login', { method })
  const signUp = (method?: string) => track('sign_up', { method })
  const share = (method?: string, contentType?: string, itemId?: string) =>
    track('share', { method, content_type: contentType, item_id: itemId })

  return {
    // DataLayer
    push,
    clear,
    clearEcommerce,

    // Simple tracking
    track,
    trackPageView,

    // E-commerce helpers
    item,
    ecommerce,

    // E-commerce events
    viewItemList,
    viewItem,
    selectItem,
    addToCart,
    removeFromCart,
    addToWishlist,
    viewCart,
    beginCheckout,
    addShippingInfo,
    addPaymentInfo,
    purchase,
    refund,
    viewPromotion,
    selectPromotion,
    search,

    // User
    setUserId,
    setUserProperties,

    // Common events
    login,
    signUp,
    share,
  }
}
