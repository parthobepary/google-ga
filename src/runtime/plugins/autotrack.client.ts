import { defineNuxtPlugin, useRuntimeConfig } from '#app'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const options = config.public.googleAnalytics
  const autoTrack = options?.autoTrack

  if (!autoTrack) return

  const trackEvent = (eventName: string, params: Record<string, any>) => {
    if (typeof window === 'undefined') return

    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: eventName,
      ...params,
    })

    if (options?.debug) {
      console.log(`[nuxt-ga] Auto-track: ${eventName}`, params)
    }
  }

  // Track outbound links
  if (autoTrack.outboundLinks) {
    document.addEventListener('click', (e) => {
      const link = (e.target as Element).closest('a')
      if (!link) return

      const href = link.getAttribute('href')
      if (!href) return

      try {
        const url = new URL(href, window.location.origin)
        if (url.hostname !== window.location.hostname) {
          trackEvent('outbound_link', {
            link_url: href,
            link_domain: url.hostname,
            link_text: link.textContent?.trim().slice(0, 100),
          })
        }
      } catch {
        // Invalid URL, skip
      }
    })

    if (options?.debug) {
      console.log('[nuxt-ga] Outbound link tracking enabled')
    }
  }

  // Track file downloads
  if (autoTrack.fileDownloads) {
    const downloadExtensions = [
      'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
      'zip', 'rar', '7z', 'tar', 'gz',
      'mp3', 'mp4', 'avi', 'mov', 'wmv',
      'exe', 'dmg', 'msi', 'apk',
      'csv', 'txt', 'json', 'xml',
    ]

    document.addEventListener('click', (e) => {
      const link = (e.target as Element).closest('a')
      if (!link) return

      const href = link.getAttribute('href')
      if (!href) return

      const extension = href.split('.').pop()?.toLowerCase().split('?')[0]
      if (extension && downloadExtensions.includes(extension)) {
        trackEvent('file_download', {
          file_name: href.split('/').pop()?.split('?')[0],
          file_extension: extension,
          link_url: href,
        })
      }
    })

    if (options?.debug) {
      console.log('[nuxt-ga] File download tracking enabled')
    }
  }

  // Track scroll depth
  if (autoTrack.scrollDepth) {
    const thresholds = [25, 50, 75, 100]
    const trackedThresholds = new Set<number>()

    const calculateScrollPercent = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      return docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0
    }

    const checkScroll = () => {
      const percent = calculateScrollPercent()

      for (const threshold of thresholds) {
        if (percent >= threshold && !trackedThresholds.has(threshold)) {
          trackedThresholds.add(threshold)
          trackEvent('scroll_depth', {
            scroll_depth_threshold: threshold,
            scroll_depth_percent: percent,
            page_path: window.location.pathname,
          })
        }
      }
    }

    // Throttle scroll events
    let ticking = false
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkScroll()
          ticking = false
        })
        ticking = true
      }
    }, { passive: true })

    // Reset on navigation (for SPA)
    const resetScrollTracking = () => {
      trackedThresholds.clear()
    }

    // Listen for route changes
    window.addEventListener('popstate', resetScrollTracking)

    if (options?.debug) {
      console.log('[nuxt-ga] Scroll depth tracking enabled')
    }
  }

  // Track JavaScript errors
  if (autoTrack.errors) {
    window.addEventListener('error', (e) => {
      trackEvent('javascript_error', {
        error_message: e.message,
        error_filename: e.filename,
        error_lineno: e.lineno,
        error_colno: e.colno,
        page_path: window.location.pathname,
      })
    })

    window.addEventListener('unhandledrejection', (e) => {
      trackEvent('javascript_error', {
        error_message: e.reason?.message || String(e.reason),
        error_type: 'unhandled_promise_rejection',
        page_path: window.location.pathname,
      })
    })

    if (options?.debug) {
      console.log('[nuxt-ga] Error tracking enabled')
    }
  }
})
