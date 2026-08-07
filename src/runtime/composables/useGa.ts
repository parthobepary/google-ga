import { useRuntimeConfig } from '#app'

type GaCommand = 'send' | 'set' | 'create' | 'require' | 'provide' | 'remove'

export const useGa = () => {
  const config = useRuntimeConfig()
  const options = config.public.googleAnalytics

  /**
   * Direct access to ga function (Universal Analytics)
   * @example
   * const ga = useGa()
   * ga('send', 'event', 'category', 'action', 'label', value)
   * ga('set', 'dimension1', 'value')
   */
  const ga = (command: GaCommand, ...args: any[]) => {
    if (typeof window === 'undefined') return

    if (!window.ga) {
      console.warn('[nuxt-ga] Universal Analytics not loaded')
      return
    }

    window.ga(command, ...args)

    if (options?.debug) {
      console.log(`[nuxt-ga] ga(${command}, ...)`, args)
    }
  }

  return Object.assign(ga, {
    /**
     * Send an event
     */
    sendEvent: (category: string, action: string, label?: string, value?: number) => {
      ga('send', 'event', category, action, label, value)
    },

    /**
     * Send a page view
     */
    sendPageView: (page?: string) => {
      if (page) {
        ga('set', 'page', page)
      }
      ga('send', 'pageview')
    },

    /**
     * Set a dimension
     */
    setDimension: (index: number, value: string) => {
      ga('set', `dimension${index}`, value)
    },

    /**
     * Set a metric
     */
    setMetric: (index: number, value: number) => {
      ga('set', `metric${index}`, value)
    },

    /**
     * Set user ID
     */
    setUserId: (userId: string) => {
      ga('set', 'userId', userId)
    },

    /**
     * Send timing data
     */
    sendTiming: (category: string, variable: string, value: number, label?: string) => {
      ga('send', 'timing', category, variable, value, label)
    },

    /**
     * Send exception
     */
    sendException: (description: string, fatal?: boolean) => {
      ga('send', 'exception', {
        exDescription: description,
        exFatal: fatal,
      })
    },

    /**
     * Send social interaction
     */
    sendSocial: (network: string, action: string, target: string) => {
      ga('send', 'social', network, action, target)
    },
  })
}
