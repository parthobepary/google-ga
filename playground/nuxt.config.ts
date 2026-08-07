export default defineNuxtConfig({
  modules: ['../src/module'],

  googleAnalytics: {
    // Option 1: Use GTM (recommended for production)
    // gtm: {
    //   containerId: 'GTM-XXXXXXX',
    // },

    // Option 2: Use GA4 directly
    ga4: {
      measurementId: 'G-XXXXXXXXXX',
    },

    // Option 3: Use Universal Analytics (legacy)
    // ua: {
    //   trackingId: 'UA-XXXXXXXX-X',
    // },

    // Common options
    debug: true,
    autoPageView: true,
    currency: 'USD',
    itemBrand: 'My Store',

    // Consent mode (GDPR)
    consentMode: {
      enabled: true,
      defaultConsent: 'denied',
    },
  },

  devtools: { enabled: true },
})
