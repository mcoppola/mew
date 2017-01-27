import jwtDecode from 'jwt-decode'
import Cookie from 'js-cookie'

const getQueryParams = () => {
  const params = {}
  window.location.href.replace(/([^(?|#)=&]+)(=([^&]*))?/g, ($0, $1, $2, $3) => {
    params[$1] = $3
  })
  return params
}

export const extractInfoFromHash = () => {
  if (!process.browser) {
    return undefined
  }
  const {id_token, state} = getQueryParams()
  return {token: id_token, secret: state}
}

export const setToken = (token) => {
  if (!process.browser) {
    return
  }
  window.localStorage.setItem('mewToken', token)
  // window.localStorage.setItem('mew_user', JSON.stringify(jwtDecode(token)))
  Cookie.set('mewToken', token)
}

export const unsetToken = () => {
  if (!process.browser) {
    return
  }
  window.localStorage.removeItem('mewToken')
  // window.localStorage.removeItem('mew_user')
  window.localStorage.removeItem('mewSecret')
  Cookie.remove('mewToken')

  window.localStorage.setItem('mewLogout', Date.now())
}

export const getTokenFromCookie = (req) => {
  if (!req.headers.cookie) {
    return undefined
  }
  const jwtCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith('mewToken='))
  if (!jwtCookie) {
    return undefined
  }
  return jwtCookie.split('=')[1];
  // const jwt = jwtCookie.split('=')[1]
  // return jwtDecode(jwt)
}

export const getTokenFromLocalStorage = () => {
  const token = window.localStorage.mewToken
  return token ? token : undefined
}

export const setSecret = (secret) => window.localStorage.setItem('mewSecret', secret)

export const checkSecret = (secret) => window.localStorage.secret === secret
