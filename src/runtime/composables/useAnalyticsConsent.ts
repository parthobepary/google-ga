import { useState } from '#app'
import { useRuntimeConfig } from '#app'
import type { ConsentState } from '../types'

const CONSENT_STORAGE_KEY = 'nuxt-ga-consent'

export const useAnalyticsConsent = () => {
  const config = useRuntimeConfig()
  const options = config.public.googleAnalytics

  // Use useState to prevent SSR state sharing issues
  const consentState = useState<ConsentState>('nuxt-ga-consent-state', () => ({
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  }))

  /**
   * Load consent state from localStorage
   */
  const loadConsent = () => {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY)
      if (stored) {
        consentState.value = JSON.parse(stored)
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }

  /**
   * Save consent state to localStorage
   */
  const saveConsent = () => {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentState.value))
    } catch (e) {
      // Ignore localStorage errors
    }
  }

  /**
   * Update consent state and notify gtag
   */
  const updateConsent = (newState: Partial<ConsentState>) => {
    consentState.value = { ...consentState.value, ...newState }
    saveConsent()

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', newState)

      if (options?.debug) {
        console.log('[nuxt-ga] Consent updated:', newState)
      }
    }
  }

  /**
   * Grant all analytics consent
   */
  const grantConsent = () => {
    updateConsent({
      analytics_storage: 'granted',
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    })
  }

  /**
   * Revoke all analytics consent
   */
  const revokeConsent = () => {
    updateConsent({
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    })
  }

  /**
   * Grant only analytics (no ads)
   */
  const grantAnalyticsOnly = () => {
    updateConsent({
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    })
  }

  /**
   * Check if analytics consent is granted
   */
  const hasAnalyticsConsent = () => {
    return consentState.value.analytics_storage === 'granted'
  }

  /**
   * Check if ad consent is granted
   */
  const hasAdConsent = () => {
    return consentState.value.ad_storage === 'granted'
  }

  // Load saved consent on init
  loadConsent()

  return {
    consentState,
    updateConsent,
    grantConsent,
    revokeConsent,
    grantAnalyticsOnly,
    hasAnalyticsConsent,
    hasAdConsent,
    loadConsent,
  }
}
