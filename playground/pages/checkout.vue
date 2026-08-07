<script setup lang="ts">
const { trackAddPaymentInfo, trackPurchase, buildItem } = useGtagEvent()

// Mock cart data
const cartItems = [
  { id: 'SKU001', name: 'Product 1', price: 29.99, quantity: 2, category: 'Electronics' },
  { id: 'SKU002', name: 'Product 2', price: 49.99, quantity: 1, category: 'Clothing' },
]

const items = cartItems.map(p => buildItem(p.id, p.name, p.price, p.category, p.quantity))
const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

const paymentMethod = ref('')
const isComplete = ref(false)
const transactionId = ref('')

const selectPayment = (method: string) => {
  paymentMethod.value = method
  trackAddPaymentInfo(items, total, method)
}

const completePurchase = () => {
  transactionId.value = `TXN-${Date.now()}`
  trackPurchase(transactionId.value, items, total, {
    tax: total * 0.08,
    shipping: 5.99,
  })
  isComplete.value = true
}
</script>

<template>
  <div style="padding: 2rem; font-family: system-ui;">
    <NuxtLink to="/cart" style="color: #666;">&larr; Back to Cart</NuxtLink>

    <h1 style="margin-top: 1rem;">Checkout</h1>

    <div v-if="isComplete" style="margin-top: 2rem; padding: 2rem; background: #e8f5e9; border-radius: 8px;">
      <h2>Order Complete!</h2>
      <p>Transaction ID: {{ transactionId }}</p>
      <p>Total: ${{ (total + total * 0.08 + 5.99).toFixed(2) }}</p>
      <NuxtLink to="/" style="display: inline-block; margin-top: 1rem; color: #000;">
        Continue Shopping
      </NuxtLink>
    </div>

    <div v-else>
      <section style="margin-top: 2rem;">
        <h2>Order Summary</h2>
        <div
          v-for="item in cartItems"
          :key="item.id"
          style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #eee;"
        >
          <span>{{ item.name }} x {{ item.quantity }}</span>
          <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
        </div>
        <div style="margin-top: 1rem; text-align: right;">
          <p>Subtotal: ${{ total.toFixed(2) }}</p>
          <p>Tax (8%): ${{ (total * 0.08).toFixed(2) }}</p>
          <p>Shipping: $5.99</p>
          <p style="font-size: 1.25rem; font-weight: bold;">
            Total: ${{ (total + total * 0.08 + 5.99).toFixed(2) }}
          </p>
        </div>
      </section>

      <section style="margin-top: 2rem;">
        <h2>Payment Method</h2>
        <div style="display: flex; gap: 1rem; margin-top: 1rem;">
          <button
            v-for="method in ['Credit Card', 'PayPal', 'Apple Pay']"
            :key="method"
            :style="{
              padding: '1rem',
              border: paymentMethod === method ? '2px solid #000' : '1px solid #ccc',
              background: paymentMethod === method ? '#f5f5f5' : '#fff',
              cursor: 'pointer',
            }"
            @click="selectPayment(method)"
          >
            {{ method }}
          </button>
        </div>
      </section>

      <button
        :disabled="!paymentMethod"
        style="margin-top: 2rem; padding: 1rem 2rem; background: #000; color: #fff; border: none; cursor: pointer; opacity: 1;"
        :style="{ opacity: paymentMethod ? 1 : 0.5 }"
        @click="completePurchase"
      >
        Complete Purchase
      </button>
    </div>
  </div>
</template>
