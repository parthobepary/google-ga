<script setup lang="ts">
const { trackViewItemList, buildItem } = useGtagEvent()
const gtag = useGtag()
const { grantConsent, revokeConsent, hasAnalyticsConsent, consentState } = useAnalyticsConsent()

// Sample products
const products = [
  { id: 'SKU001', name: 'Product 1', price: 29.99, category: 'Electronics' },
  { id: 'SKU002', name: 'Product 2', price: 49.99, category: 'Clothing' },
  { id: 'SKU003', name: 'Product 3', price: 19.99, category: 'Books' },
]

// Build items for tracking
const items = products.map(p => buildItem(p.id, p.name, p.price, p.category))

// Track view item list on mount
onMounted(() => {
  trackViewItemList(items, 'Homepage Products')
})

// Custom event example
const trackCustomEvent = () => {
  gtag.event('button_click', {
    button_id: 'cta_button',
    page: 'homepage',
  })
}
</script>

<template>
  <div style="padding: 2rem; font-family: system-ui;">
    <h1>Nuxt GA Playground</h1>

    <section style="margin: 2rem 0; padding: 1rem; border: 1px solid #ccc; border-radius: 8px;">
      <h2>Consent Management</h2>
      <p>
        Analytics consent:
        <strong>{{ consentState.analytics_storage }}</strong>
      </p>
      <div style="display: flex; gap: 1rem; margin-top: 1rem;">
        <button
          style="padding: 0.5rem 1rem; cursor: pointer;"
          @click="grantConsent"
        >
          Accept All Cookies
        </button>
        <button
          style="padding: 0.5rem 1rem; cursor: pointer;"
          @click="revokeConsent"
        >
          Reject All
        </button>
      </div>
    </section>

    <section style="margin: 2rem 0;">
      <h2>Products</h2>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
        <NuxtLink
          v-for="product in products"
          :key="product.id"
          :to="`/product/${product.id}`"
          style="padding: 1rem; border: 1px solid #eee; border-radius: 8px; text-decoration: none; color: inherit;"
        >
          <h3>{{ product.name }}</h3>
          <p>${{ product.price }}</p>
          <p style="color: #666;">{{ product.category }}</p>
        </NuxtLink>
      </div>
    </section>

    <section style="margin: 2rem 0;">
      <h2>Custom Events</h2>
      <button
        style="padding: 0.5rem 1rem; cursor: pointer;"
        @click="trackCustomEvent"
      >
        Track Custom Event
      </button>
    </section>

    <section style="margin: 2rem 0;">
      <h2>Navigation</h2>
      <nav style="display: flex; gap: 1rem;">
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/cart">Cart</NuxtLink>
        <NuxtLink to="/checkout">Checkout</NuxtLink>
      </nav>
    </section>
  </div>
</template>
