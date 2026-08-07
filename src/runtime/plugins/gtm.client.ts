import { defineNuxtPlugin, useRuntimeConfig } from '#app'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const options = config.public.googleAnalytics

  if (!options?.gtm?.containerId) {
    return
  }

  const containerId = options.gtm.containerId

  // Respect Do Not Track
  if (options.respectDoNotTrack && navigator.doNotTrack === '1') {
    if (options.debug) {
      console.log('[nuxt-ga] GTM disabled due to Do Not Track')
    }
    return
  }

  const loadGTM = () => {
    // Prevent double loading
    if ((window as any).__nuxtGtmLoaded) return
    ;(window as any).__nuxtGtmLoaded = true

    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js',
    })

    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtm.js?id=${containerId}`
    document.head.appendChild(script)

    if (options.debug) {
      console.log(`[nuxt-ga] GTM loaded: ${containerId}`)
    }
  }

  // Check if lazy loading is enabled
  if (options.lazyLoad?.enabled) {
    let loaded = false

    const load = () => {
      if (loaded) return
      loaded = true
      loadGTM()
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
      console.log('[nuxt-ga] GTM lazy loading enabled')
    }
  } else {
    // Load immediately
    loadGTM()
  }
})
