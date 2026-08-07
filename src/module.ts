import { defineNuxtModule, addPlugin, addImports, createResolver } from '@nuxt/kit'
import type { ModuleOptions } from './types'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-google-ga',
    configKey: 'googleAnalytics',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  defaults: {
    debug: false,
    autoPageView: true,
    respectDoNotTrack: false,
    currency: 'USD',
    itemBrand: '',
    consentMode: {
      enabled: false,
      defaultConsent: 'granted',
    },
    lazyLoad: {
      enabled: false,
      onInteraction: true,
      delay: 3000,
    },
    autoTrack: {
      outboundLinks: false,
      fileDownloads: false,
      scrollDepth: false,
      errors: false,
    },
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Add options to runtime config
    nuxt.options.runtimeConfig.public.googleAnalytics = options

    // Add gtag plugin (initializes dataLayer)
    addPlugin({
      src: resolver.resolve('./runtime/plugins/gtag.client'),
      mode: 'client',
    })

    // Add GTM plugin if configured
    if (options.gtm?.containerId && options.gtm?.enabled !== false) {
      addPlugin({
        src: resolver.resolve('./runtime/plugins/gtm.client'),
        mode: 'client',
      })
    }

    // Add GA4 plugin if configured (standalone without GTM)
    if (options.ga4?.measurementId && options.ga4?.enabled !== false && !options.gtm?.containerId) {
      addPlugin({
        src: resolver.resolve('./runtime/plugins/ga4.client'),
        mode: 'client',
      })
    }

    // Add Universal Analytics plugin if configured
    if (options.ua?.trackingId && options.ua?.enabled !== false) {
      addPlugin({
        src: resolver.resolve('./runtime/plugins/ua.client'),
        mode: 'client',
      })
    }

    // Add auto-tracking plugin if any auto-track feature is enabled
    const autoTrack = options.autoTrack
    if (autoTrack?.outboundLinks || autoTrack?.fileDownloads || autoTrack?.scrollDepth || autoTrack?.errors) {
      addPlugin({
        src: resolver.resolve('./runtime/plugins/autotrack.client'),
        mode: 'client',
      })
    }

    // Auto-import composables
    addImports([
      {
        name: 'useAnalytics',
        from: resolver.resolve('./runtime/composables/useAnalytics'),
      },
      {
        name: 'useGtagEvent',
        from: resolver.resolve('./runtime/composables/useGtagEvent'),
      },
      {
        name: 'useGtag',
        from: resolver.resolve('./runtime/composables/useGtag'),
      },
      {
        name: 'useGa',
        from: resolver.resolve('./runtime/composables/useGa'),
      },
      {
        name: 'useAnalyticsConsent',
        from: resolver.resolve('./runtime/composables/useAnalyticsConsent'),
      },
    ])
  },
})
