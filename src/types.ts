export interface GA4Config {
  measurementId: string
  enabled?: boolean
}

export interface GTMConfig {
  containerId: string
  enabled?: boolean
}

export interface UAConfig {
  trackingId: string
  enabled?: boolean
}

export interface ConsentModeConfig {
  enabled: boolean
  defaultConsent?: 'granted' | 'denied'
}

export interface LazyLoadConfig {
  enabled: boolean
  /** Load on first user interaction (click, scroll, keypress) */
  onInteraction?: boolean
  /** Delay in milliseconds before loading */
  delay?: number
}

export interface AutoTrackConfig {
  /** Track outbound link clicks */
  outboundLinks?: boolean
  /** Track file downloads (.pdf, .zip, .doc, etc.) */
  fileDownloads?: boolean
  /** Track scroll depth (25%, 50%, 75%, 100%) */
  scrollDepth?: boolean
  /** Track JavaScript errors */
  errors?: boolean
}

export interface ModuleOptions {
  ga4?: GA4Config
  gtm?: GTMConfig
  ua?: UAConfig
  debug?: boolean
  autoPageView?: boolean
  respectDoNotTrack?: boolean
  currency?: string
  itemBrand?: string
  consentMode?: ConsentModeConfig
  /** Lazy load scripts for better performance */
  lazyLoad?: LazyLoadConfig
  /** Automatic tracking features */
  autoTrack?: AutoTrackConfig
}

declare module '@nuxt/schema' {
  interface NuxtConfig {
    googleAnalytics?: ModuleOptions
  }
  interface NuxtOptions {
    googleAnalytics?: ModuleOptions
  }
  interface PublicRuntimeConfig {
    googleAnalytics: ModuleOptions
  }
}

declare module 'nuxt/schema' {
  interface NuxtConfig {
    googleAnalytics?: ModuleOptions
  }
  interface NuxtOptions {
    googleAnalytics?: ModuleOptions
  }
  interface PublicRuntimeConfig {
    googleAnalytics: ModuleOptions
  }
}

export {}
