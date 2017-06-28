
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
      uri: 'http://db.mew.mattcoppola.com:4567/',
    }
  }
}

export default environmentConfigs[env]