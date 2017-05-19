import React, { PropTypes } from 'react'
import Link from 'next/link'
import * as R from 'ramda'

import Head from '../components/Head'
import Nav from '../components/Nav'
import AlbumSearchInput from '../components/AlbumSearchInput'
import AlbumsList from '../components/AlbumsList'


import { getTokenFromCookie, getTokenFromLocalStorage, getToken } from '../utils/auth'
import { apiRequest, errorMessage } from '../utils/api'



export default class extends React.Component {
  static async getInitialProps (ctx) {
    // Auth
    const userToken = process.browser ? getTokenFromLocalStorage() : getTokenFromCookie(ctx.req)

    return { userToken }
  }

  constructor(props) {
    super(props)

    this.onAlbumSelect = this.onAlbumSelect.bind(this)
    this.state = { selectedAlbum: null } 
  }

  async onAlbumSelect(album) {
    let api = apiRequest(this.props.userToken)
        // get user id
    let id = await api.get('/users/me')
          .then(res =>  id = res.data.id)
          .catch(err => errorMessage(e))

    // post new album
    api.post('/albums', { 
      _user: id,
      title: album.name,
      artist: album.artist,
      image: album.image.map(i => i['#text']),
      mbid: album.mbid || album.id
    })

    this.setState({ selectedAlbum: album })
  }

  render() {
    return (
      <div>
        <Head/>
        <div className="h-100">
          <div className="cf mw7 tl ma0 center">
            <Nav userToken={ this.props.userToken } />
            <div className="w-80 fl">
              <h2 className="f4 lh-title ttu purple">Albums</h2>
              <div>
                { <AlbumsList userToken={ this.props.userToken } selected={ this.state.selectedAlbum } /> }
                { <AlbumSearchInput onSelect={ this.onAlbumSelect} /> }
              </div>
            </div>
            <div className="w-20 fl">
              <h2 className="f4 lh-title ttu">users</h2>
              <div>
                <Users />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


// Users list

class Users extends React.Component {
  constructor(props) {
    super(props)
    this.state = { err: 'loading users...', users: [] }
  }

  async componentDidMount() {
    let api = apiRequest(this.props.userToken)
    let users = await api.get('/users')
    this.setState({ users: users.data, err: null })
  }

  render(){
    return (
      <div>
        {this.state.err && <p>{this.state.err}</p>}
        {this.state.users.map( u => {
          return (
              <p className="f5 lh-copy">{u.username}</p>
            )
        })}
      </div>
    )
  }
}
