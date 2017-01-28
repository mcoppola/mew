import React from 'react'
import Link from 'next/link'
import { style } from 'glamor'
import { } from 'lodash'
import Head from 'next/head'
import axios from 'axios'

import Header from '../components/Header'

import { getTokenFromCookie, getTokenFromLocalStorage, getToken } from '../utils/auth'
import { connection } from '../utils/api'



export default class extends React.Component {
  static async getInitialProps (ctx) {
    const userToken = process.browser ? getTokenFromLocalStorage() : getTokenFromCookie(ctx.req)

    let id = ctx.query.id || ''

    let api = connection(userToken)
    let list = await api.get('/lists/'  + id );

    return { list: list.data, userToken }
  }
  render() {
    return (
      <div>
        <Head>
          <title>Mew</title>
          <link rel="stylesheet" href="https://unpkg.com/tachyons/css/tachyons.min.css"/>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <div>
          <div {...styles.inner} className="cf mw7 mt5">
            <Header userToken={ this.props.userToken } />
            <h2 {...styles.title} className="f4 lh-title ttu">{this.props.list._user.username} / {this.props.list.title}</h2>
            <div {...styles.chart}>
            {this.props.list.albums.map((album, i) => {
              return (
                  <p className="f5 lh-copy">{album}</p>
                );
            })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}




const styles = {
  'inner': style({
    margin: '0 auto',
    color: 'rgb(97, 97, 97)'
  })
}