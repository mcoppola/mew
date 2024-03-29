import React from 'react'
import Link from 'next/link'
import { } from 'lodash'
import Head from 'next/head'
import axios from 'axios'

import Nav from '../components/Nav'

import { getTokenFromCookie, getTokenFromLocalStorage, getToken } from '../utils/auth'
import { apiRequest, errorMessage } from '../utils/api'
import { getAlbums } from '../utils/lastfm'



export default class extends React.Component {
  static getInitialProps (ctx) {
    const userToken = process.browser ? getTokenFromLocalStorage() : getTokenFromCookie(ctx.req)
    return { userToken, listId: ctx.query.id, path: ctx.pathname }
  }

  async componentDidMount() {
    let id = this.props.listId
    let api = apiRequest(this.props.userToken)
    let list = await api.get('/lists/'  + id )
    this.setState({ list: list.data })
  }

  render() {
    let l = this.state ? this.state.list : null;

    return (
      <div>
        <Head>
          <title>Mew</title>
          <link rel="stylesheet" href="/static/tachyons.min.css"/>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <div>
          <div {...styles.inner} className="cf mw7 mt5">
            <Nav userToken={ this.props.userToken } pathname={ this.props.path } />
            <h2 {...styles.title} className="f4 lh-title ttu">{l && l._user.username} / {l && l.title}</h2>
            <div {...styles.chart}>
            {l && l._albums.map((album, i) => {
              return (
                  <div className="cf mb2">
                    <div className="fl w-10">
                      <img width="50" height="50" src={album.image[1]} alt=""/>
                    </div>
                    <div className="fl w-90">
                      <div className="f6 mv3">{i + 1}. &nbsp; {album.artist} - {album.title}</div> 
                    </div>
                  </div>
                );
            })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

