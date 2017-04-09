import React from 'react'
import Head from 'next/head'
import css from 'next/css'

import Header from '../components/Header'
import Auth from '../utils/auth'

const styles = {
  app: css({
    height: '100vh',
    width: '100vw'
  }),
  main: css({
    maxWidth: 800,
    margin: '0 auto',
    padding: 30
  })
}

export default Page => class DefaultPage extends React.Component {
  static getInitialProps (ctx) {
    const loggedUser = process.browser ? Auth.getUserFromLocalStorage() : Auth.getUserFromCookie(ctx.req)
    const pageProps = Page.getInitialProps && Page.getInitialProps(ctx)

    return {
      ...pageProps,
      loggedUser,
      currentUrl: ctx.pathname,
      isAuthenticated: !!loggedUser
    }
  }

  constructor (props) {
    super(props)

    this.logout = this.logout.bind(this)
  }

  logout (eve) {
    if (eve.key === 'logout') {
      this.props.url.pushTo(`/?logout=${eve.newValue}`)
    }
  }

  componentDidMount () {
    window.addEventListener('storage', this.logout, false)
  }

  componentWillUnmount () {
    window.removeEventListener('storage', this.logout, false)
  }

  render () {
    const cssFiles = [
      'https://unpkg.com/tachyons/css/tachyons.min.css'
    ]
    return (
      <div>
        <Head>
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          {cssFiles.map((c, i) => <link key={i} href={c} rel='stylesheet' />)}
          <style>
            {`* {
              margin: 0;
              font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
            }`}
          </style>
          <title>Mew</title>
        </Head>
        <div className={styles.app}>
          <div className={styles.main}>
            <Header {...this.props} />
            <Page {...this.props} />
          </div>
        </div>
      </div>
    )
  }
}