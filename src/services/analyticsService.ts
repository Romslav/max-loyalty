export const analyticsClient = {
  track: (event: string, data?: any) => {
    console.log('Analytics:', event, data)
  }
}

export const initMixpanel = () => {
  console.log('Mixpanel initialized')
}

export const initSentry = () => {
  console.log('Sentry initialized')
}
