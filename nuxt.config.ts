export default defineNuxtConfig({
  modules: ['./src/module'],
  devtools: { enabled: true },
  googleAnalytics: {
    ga4: {
      measurementId: 'G-XXXXXXXXXX',
    },
    debug: true,
  },
})
