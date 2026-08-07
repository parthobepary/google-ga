# nuxt-google-ga

[![npm version](https://badge.fury.io/js/nuxt-google-ga.svg)](https://www.npmjs.com/package/nuxt-google-ga)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Google Analytics module for Nuxt 3/4 with GA4, GTM, and Universal Analytics support.

## Features

- GA4 (Google Analytics 4) with gtag.js
- GTM (Google Tag Manager) integration
- Universal Analytics (legacy) support
- Full e-commerce tracking (GA4 format)
- GDPR consent mode
- Auto page view tracking
- **Lazy loading** for better performance
- **Auto-tracking** (outbound links, file downloads, scroll depth, errors)
- TypeScript support
- SSR compatible

## Installation

```bash
npm install nuxt-google-ga
```

## Configuration

Add the module to your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['nuxt-google-ga'],

  googleAnalytics: {
    // Option 1: Google Tag Manager (recommended)
    gtm: {
      containerId: 'GTM-XXXXXXX',
    },

    // Option 2: GA4 directly
    ga4: {
      measurementId: 'G-XXXXXXXXXX',
    },

    // Option 3: Universal Analytics (legacy)
    ua: {
      trackingId: 'UA-XXXXXXXX-X',
    },

    // Common options
    debug: false,
    autoPageView: true,
    respectDoNotTrack: false,
    currency: 'USD',
    itemBrand: 'My Store',

    // GDPR consent mode
    consentMode: {
      enabled: true,
      defaultConsent: 'denied',
    },

    // Lazy loading (better performance)
    lazyLoad: {
      enabled: true,
      onInteraction: true,  // Load on click/scroll/keypress
      delay: 3000,          // Or load after 3 seconds
    },

    // Automatic tracking
    autoTrack: {
      outboundLinks: true,  // Track external link clicks
      fileDownloads: true,  // Track file downloads
      scrollDepth: true,    // Track 25%, 50%, 75%, 100% scroll
      errors: true,         // Track JavaScript errors
    },
  },
})
```

## Usage

### Quick Start (Recommended)

Use `useAnalytics()` for the simplest API:

```vue
<script setup>
const analytics = useAnalytics()

// Track any event
analytics.track('button_click', { button_id: 'cta' })

// E-commerce - build item and track
const product = analytics.item('SKU123', 'Product Name', 29.99, 'Category')
analytics.viewItem(product)
analytics.addToCart(product)
analytics.purchase('TXN-123', [product], 29.99)

// DataLayer
analytics.push({ custom_data: 'value' })
analytics.clear()  // Clear all
analytics.clearEcommerce()  // Clear ecommerce only
</script>
```

### E-commerce Tracking

```vue
<script setup>
const { buildItem, trackViewItem, trackAddToCart, trackPurchase } = useGtagEvent()

// Build an item
const item = buildItem('SKU123', 'Product Name', 29.99, 'Category')

// Track product view
onMounted(() => {
  trackViewItem(item, 29.99)
})

// Track add to cart
const addToCart = () => {
  trackAddToCart(item, 29.99)
}

// Track purchase
const completePurchase = () => {
  trackPurchase('TXN-123', [item], 29.99, {
    tax: 2.40,
    shipping: 5.99,
  })
}
</script>
```

### Available E-commerce Events

```typescript
const {
  buildItem,            // Build an item object
  trackViewItemList,    // Product listing page
  trackViewItem,        // Product detail page
  trackSelectItem,      // Click on item in list
  trackAddToCart,       // Add to cart
  trackRemoveFromCart,  // Remove from cart
  trackAddToWishlist,   // Add to wishlist
  trackViewCart,        // View cart
  trackBeginCheckout,   // Begin checkout
  trackAddShippingInfo, // Add shipping info
  trackAddPaymentInfo,  // Add payment info
  trackPurchase,        // Complete purchase
  trackRefund,          // Refund
  trackViewPromotion,   // View promotion banner
  trackSelectPromotion, // Click promotion
  trackSearch,          // Search
  pushEvent,            // Custom ecommerce event
} = useGtagEvent()
```

### Custom Events (GA4)

```vue
<script setup>
const gtag = useGtag()

// Send custom event
gtag.event('button_click', { button_id: 'cta' })

// Set user properties
gtag.setUserProperties({ membership: 'premium' })

// Set user ID
gtag.setUserId('user123')
</script>
```

### Universal Analytics (Legacy)

```vue
<script setup>
const ga = useGa()

// Send event
ga.sendEvent('Category', 'Action', 'Label', 1)

// Set dimension
ga.setDimension(1, 'value')

// Send page view
ga.sendPageView('/custom-page')
</script>
```

### useAnalytics() - Full API

```typescript
const analytics = useAnalytics()

// DataLayer
analytics.push({ key: 'value' })     // Push to dataLayer
analytics.clear()                     // Clear dataLayer
analytics.clearEcommerce()            // Clear ecommerce data

// Simple tracking
analytics.track('event_name', { param: 'value' })
analytics.trackPageView('/path', 'Page Title')

// Build items
const item = analytics.item('SKU', 'Name', 99.99, 'Category', 1)

// E-commerce events
analytics.viewItemList([item], 'List Name')
analytics.viewItem(item)
analytics.selectItem(item, 'List Name')
analytics.addToCart(item)
analytics.removeFromCart(item)
analytics.addToWishlist(item)
analytics.viewCart([item])
analytics.beginCheckout([item], 99.99, 'COUPON')
analytics.addShippingInfo([item], 99.99, 'Ground')
analytics.addPaymentInfo([item], 99.99, 'Credit Card')
analytics.purchase('TXN-123', [item], 99.99, { tax: 5, shipping: 10 })
analytics.refund('TXN-123')
analytics.viewPromotion('promo_id', 'Summer Sale')
analytics.selectPromotion('promo_id', 'Summer Sale')
analytics.search('search term')

// User tracking
analytics.setUserId('user123')
analytics.setUserProperties({ plan: 'premium' })

// Common events
analytics.login('Google')
analytics.signUp('Email')
analytics.share('Twitter', 'article', 'article_123')
```

### Consent Management (GDPR)

```vue
<script setup>
const {
  grantConsent,
  revokeConsent,
  grantAnalyticsOnly,
  hasAnalyticsConsent,
  consentState
} = useAnalyticsConsent()

// Show cookie banner
const acceptAll = () => grantConsent()
const rejectAll = () => revokeConsent()
const acceptAnalyticsOnly = () => grantAnalyticsOnly()

// Check consent status
if (hasAnalyticsConsent()) {
  // Analytics is enabled
}
</script>
```

### Lazy Loading

Improve performance by deferring analytics script loading:

```typescript
// nuxt.config.ts
googleAnalytics: {
  ga4: { measurementId: 'G-XXXXXXXXXX' },
  lazyLoad: {
    enabled: true,
    onInteraction: true, // Load on first click/scroll/keypress
    delay: 3000,         // Or load after 3 seconds (whichever comes first)
  },
}
```

### Auto-Tracking

Automatically track common user interactions:

```typescript
// nuxt.config.ts
googleAnalytics: {
  ga4: { measurementId: 'G-XXXXXXXXXX' },
  autoTrack: {
    outboundLinks: true,  // Track clicks on external links
    fileDownloads: true,  // Track downloads (.pdf, .zip, .doc, etc.)
    scrollDepth: true,    // Track scroll milestones (25%, 50%, 75%, 100%)
    errors: true,         // Track JavaScript errors
  },
}
```

**Events tracked:**
- `outbound_link` - External link clicks with URL and domain
- `file_download` - File downloads with filename and extension
- `scroll_depth` - Scroll depth at 25%, 50%, 75%, 100%
- `javascript_error` - JS errors with message and stack info

## Module Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `ga4.measurementId` | `string` | - | GA4 Measurement ID (G-XXXXXXXXXX) |
| `ga4.enabled` | `boolean` | `true` | Enable/disable GA4 |
| `gtm.containerId` | `string` | - | GTM Container ID (GTM-XXXXXXX) |
| `gtm.enabled` | `boolean` | `true` | Enable/disable GTM |
| `ua.trackingId` | `string` | - | UA Tracking ID (UA-XXXXXXXX-X) |
| `ua.enabled` | `boolean` | `true` | Enable/disable UA |
| `debug` | `boolean` | `false` | Enable debug logging |
| `autoPageView` | `boolean` | `true` | Auto-track page views on route change |
| `respectDoNotTrack` | `boolean` | `false` | Respect browser's DNT setting |
| `currency` | `string` | `'USD'` | Default currency for e-commerce |
| `itemBrand` | `string` | `''` | Default brand for e-commerce items |
| `consentMode.enabled` | `boolean` | `false` | Enable consent mode |
| `consentMode.defaultConsent` | `'granted' \| 'denied'` | `'granted'` | Default consent state |
| `lazyLoad.enabled` | `boolean` | `false` | Enable lazy loading |
| `lazyLoad.onInteraction` | `boolean` | `true` | Load on user interaction |
| `lazyLoad.delay` | `number` | `3000` | Delay before loading (ms) |
| `autoTrack.outboundLinks` | `boolean` | `false` | Track outbound link clicks |
| `autoTrack.fileDownloads` | `boolean` | `false` | Track file downloads |
| `autoTrack.scrollDepth` | `boolean` | `false` | Track scroll depth |
| `autoTrack.errors` | `boolean` | `false` | Track JavaScript errors |

## Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Start playground
npm run dev

# Build module
npm run build
```

## Support

If you find this package helpful, consider buying me a coffee!

- **bKash/Nagad:** 01798339054

Your support helps maintain and improve this package.

## License

MIT License - Copyright (c) 2024 Partho Bepary

See [LICENSE](./LICENSE) for details.
