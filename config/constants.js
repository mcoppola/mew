
const env = process.env.NODE_ENV || 'development'

const environmentConfigs = {
  development: {
    api: {
      uri: 'http://localhost:4567/',
    },
    spotify: {
      callback: 'http://localhost:3000/spotify-callback'
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
    },
    spotify: {
      callback: 'https://alpha.mattcoppola.com/spotify-callback'
    }
  }
}

export default environmentConfigs[env]