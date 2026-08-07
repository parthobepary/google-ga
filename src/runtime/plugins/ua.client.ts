import { defineNuxtPlugin, useRuntimeConfig, useRouter } from '#app'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const options = config.public.googleAnalytics

  if (!options?.ua?.trackingId) {
    return
  }

  const trackingId = options.ua.trackingId

  // Respect Do Not Track
  if (options.respectDoNotTrack && navigator.doNotTrack === '1') {
    if (options.debug) {
      console.log('[nuxt-ga] Universal Analytics disabled due to Do Not Track')
    }
    return
  }

  // Load analytics.js script
  const script = document.createElement('script')
  script.async = true
  script.src = 'https://www.google-analytics.com/analytics.js'
  document.head.appendChild(script)

  // Initialize ga function
  window.ga = window.ga || function (...args: any[]) {
    (window.ga.q = window.ga.q || []).push(args)
  }
  ;(window.ga as any).l = +new Date()

  // Create tracker
  window.ga('create', trackingId, 'auto')

  // Send initial page view
  if (options.autoPageView !== false) {
    window.ga('send', 'pageview')

    // Auto page view tracking on route change
    const router = useRouter()
    router.afterEach((to) => {
      window.ga('set', 'page', to.fullPath)
      window.ga('send', 'pageview')
    })
  }

  if (options.debug) {
    console.log(`[nuxt-ga] Universal Analytics loaded: ${trackingId}`)
  }
})
