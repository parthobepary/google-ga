<script setup lang="ts">
const { trackViewCart, trackRemoveFromCart, trackBeginCheckout, buildItem } = useGtagEvent()

// Mock cart items
const cartItems = ref([
  { id: 'SKU001', name: 'Product 1', price: 29.99, quantity: 2, category: 'Electronics' },
  { id: 'SKU002', name: 'Product 2', price: 49.99, quantity: 1, category: 'Clothing' },
])

const items = computed(() =>
  cartItems.value.map(p => buildItem(p.id, p.name, p.price, p.category, p.quantity))
)

const total = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
)

// Track view cart on mount
onMounted(() => {
  trackViewCart(items.value, total.value)
})

const removeItem = (index: number) => {
  const removed = cartItems.value[index]
  const removedItem = buildItem(removed.id, removed.name, removed.price, removed.category, removed.quantity)
  trackRemoveFromCart(removedItem, removed.price * removed.quantity)
  cartItems.value.splice(index, 1)
}

const checkout = () => {
  trackBeginCheckout(items.value, total.value)
  navigateTo('/checkout')
}
</script>

<template>
  <div style="padding: 2rem; font-family: system-ui;">
    <NuxtLink to="/" style="color: #666;">&larr; Continue Shopping</NuxtLink>

    <h1 style="margin-top: 1rem;">Shopping Cart</h1>

    <div v-if="cartItems.length === 0" style="margin-top: 2rem;">
      <p>Your cart is empty.</p>
    </div>

    <div v-else>
      <div
        v-for="(item, index) in cartItems"
        :key="item.id"
        style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-bottom: 1px solid #eee;"
      >
        <div>
          <h3>{{ item.name }}</h3>
          <p>Qty: {{ item.quantity }} x ${{ item.price }}</p>
        </div>
        <button
          style="padding: 0.5rem 1rem; cursor: pointer;"
          @click="removeItem(index)"
        >
          Remove
        </button>
      </div>

      <div style="margin-top: 2rem; text-align: right;">
        <p style="font-size: 1.25rem;">
          Total: <strong>${{ total.toFixed(2) }}</strong>
        </p>
        <button
          style="margin-top: 1rem; padding: 1rem 2rem; background: #000; color: #fff; border: none; cursor: pointer;"
          @click="checkout"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  </div>
</template>
