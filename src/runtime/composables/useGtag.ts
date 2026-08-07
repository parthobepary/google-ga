import { useRuntimeConfig } from '#app'

type GtagCommand = 'config' | 'event' | 'set' | 'js' | 'consent'

export const useGtag = () => {
  const config = useRuntimeConfig()
  const options = config.public.googleAnalytics

  /**
   * Direct access to gtag function
   * @example
   * const gtag = useGtag()
   * gtag('event', 'custom_event', { param1: 'value' })
   * gtag('config', 'G-XXXXXXXX', { send_page_view: false })
   */
  const gtag = (command: GtagCommand, ...args: any[]) => {
    if (typeof window === 'undefined') return

    window.dataLayer = window.dataLayer || []
    window.gtag = window.gtag || function (...args: any[]) {
      window.dataLayer.push(arguments)
    }

    window.gtag(command, ...args)

    if (options?.debug) {
      console.log(`[nuxt-ga] gtag(${command}, ...)`, args)
    }
  }

  return Object.assign(gtag, {
    /**
     * Send a custom event
     */
    event: (eventName: string, eventParams?: Record<string, any>) => {
      gtag('event', eventName, eventParams)
    },

    /**
     * Update configuration
     */
    config: (targetId: string, configParams?: Record<string, any>) => {
      gtag('config', targetId, configParams)
    },

    /**
     * Set user properties
     */
    set: (params: Record<string, any>) => {
      gtag('set', params)
    },

    /**
     * Set user ID for cross-device tracking
     */
    setUserId: (userId: string) => {
      gtag('set', { user_id: userId })
    },

    /**
     * Set user properties
     */
    setUserProperties: (properties: Record<string, any>) => {
      gtag('set', 'user_properties', properties)
    },
  })
}
