import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  // Initialize dataLayer immediately so ecommerce events are buffered
  // before GTM/GA4 script loads
  window.dataLayer = window.dataLayer || []

  // Define gtag function for direct GA4 usage
  window.gtag = function gtag(...args: any[]) {
    window.dataLayer.push(arguments)
  }
})
