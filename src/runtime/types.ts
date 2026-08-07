export interface EcommerceItem {
  item_id: string | number
  item_name: string
  item_brand?: string
  item_category?: string
  price?: number
  quantity?: number
  [key: string]: any
}

export interface PurchaseData {
  transaction_id: string
  value: number
  currency?: string
  items: EcommerceItem[]
  tax?: number
  shipping?: number
  coupon?: string
}

export interface ConsentState {
  analytics_storage: 'granted' | 'denied'
  ad_storage?: 'granted' | 'denied'
  ad_user_data?: 'granted' | 'denied'
  ad_personalization?: 'granted' | 'denied'
}

declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
    ga: (...args: any[]) => void
  }
}

export {}
