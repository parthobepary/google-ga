<script setup lang="ts">
const route = useRoute()
const { trackViewItem, trackAddToCart, buildItem } = useGtagEvent()

// Mock product data
const product = {
  id: route.params.id as string,
  name: `Product ${route.params.id}`,
  price: 49.99,
  category: 'Electronics',
}

const item = buildItem(product.id, product.name, product.price, product.category)

// Track view item on mount
onMounted(() => {
  trackViewItem(item, product.price)
})

const addToCart = () => {
  trackAddToCart(item, product.price)
  alert('Added to cart! (Check console for tracking event)')
}
</script>

<template>
  <div style="padding: 2rem; font-family: system-ui;">
    <NuxtLink to="/" style="color: #666;">&larr; Back to Products</NuxtLink>

    <div style="margin-top: 2rem;">
      <h1>{{ product.name }}</h1>
      <p style="font-size: 1.5rem; font-weight: bold;">${{ product.price }}</p>
      <p style="color: #666;">Category: {{ product.category }}</p>

      <button
        style="margin-top: 1rem; padding: 1rem 2rem; background: #000; color: #fff; border: none; cursor: pointer;"
        @click="addToCart"
      >
        Add to Cart
      </button>
    </div>
  </div>
</template>
