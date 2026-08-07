import { defineNuxtPlugin, useRuntimeConfig, useRouter } from '#app'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const options = config.public.googleAnalytics

  if (!options?.ga4?.measurementId) {
    return
  }

  const measurementId = options.ga4.measurementId

  // Respect Do Not Track
  if (options.respectDoNotTrack && navigator.doNotTrack === '1') {
    if (options.debug) {
      console.log('[nuxt-ga] GA4 disabled due to Do Not Track')
    }
    return
  }

  const loadGA4 = () => {
    // Prevent double loading
    if ((window as any).__nuxtGaLoaded) return
    ;(window as any).__nuxtGaLoaded = true

    // Load gtag.js script
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    document.head.appendChild(script)

    // Initialize gtag
    window.gtag('js', new Date())

    // Handle consent mode
    if (options.consentMode?.enabled) {
      const defaultConsent = options.consentMode.defaultConsent || 'denied'
      window.gtag('consent', 'default', {
        analytics_storage: defaultConsent,
        ad_storage: defaultConsent,
      })
    }

    // Configure GA4
    window.gtag('config', measurementId, {
      send_page_view: options.autoPageView !== false,
      debug_mode: options.debug,
    })

    // Auto page view tracking on route change
    if (options.autoPageView !== false) {
      const router = useRouter()
      router.afterEach((to) => {
        window.gtag('config', measurementId, {
          page_path: to.fullPath,
        })
      })
    }

    if (options.debug) {
      console.log(`[nuxt-ga] GA4 loaded: ${measurementId}`)
    }
  }

  // Check if lazy loading is enabled
  if (options.lazyLoad?.enabled) {
    let loaded = false

    const load = () => {
      if (loaded) return
      loaded = true
      loadGA4()
      // Remove event listeners
      if (options.lazyLoad?.onInteraction) {
        document.removeEventListener('click', load)
        document.removeEventListener('scroll', load)
        document.removeEventListener('keypress', load)
        document.removeEventListener('touchstart', load)
      }
    }

    // Load on user interaction
    if (options.lazyLoad.onInteraction !== false) {
      document.addEventListener('click', load, { once: true, passive: true })
      document.addEventListener('scroll', load, { once: true, passive: true })
      document.addEventListener('keypress', load, { once: true, passive: true })
      document.addEventListener('touchstart', load, { once: true, passive: true })
    }

    // Load after delay
    if (options.lazyLoad.delay) {
      setTimeout(load, options.lazyLoad.delay)
    }

    if (options.debug) {
      console.log('[nuxt-ga] GA4 lazy loading enabled')
    }
  } else {
    // Load immediately
    loadGA4()
  }
})
