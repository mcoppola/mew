
const env = process.env.NODE_ENV || 'development'

const environmentConfigs = {
  development: {
    api: {
      uri: 'http://localhost:4567/',
    }
  },
  test: {
    api: {
      uri: 'http://localhost:4567/',
    }
  },
  production: {
    api: {
      uri: 'https://mew.mattcoppola.com/',
    }
  }
}

export default environmentConfigs[env]