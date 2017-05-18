import React, { PropTypes } from 'react'
import Link from 'next/link'
import { style } from 'glamor'
import * as  _ from 'lodash'
import * as R from 'ramda'

import Head from '../components/Head'
import Nav from '../components/Nav'
import AlbumSearchInput from '../components/AlbumSearchInput'


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
      mbid: album.mbid
    })

    this.setState({ selectedAlbum: album })
  }

  render() {
    return (
      <div>
        <Head/>
        <div className="h-100">
          <div {...styles.inner} className="cf mw7 mt5">
            <Nav userToken={ this.props.userToken } />
            <div className="w-50 fl">
              <h2 {...styles.title} className="f4 lh-title ttu purple">Albums</h2>
              <div {...styles.chart}>
                { <Albums userToken={ this.props.userToken } selected={ this.state.selectedAlbum }/> }
                { <AlbumSearchInput onSelect={ this.onAlbumSelect} /> }
                <Link href="/create/list" ><div className="f6 link dim ba ph3 pv2 mt2 mb2 dib near-black">+ add list</div></Link>
              </div>
            </div>
            <div className="w-50 fl">
              <h2 {...styles.title} className="f4 lh-title ttu">users</h2>
              <div {...styles.chart}>
              <Users />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


// Top Albums

class Albums extends React.Component {
  constructor(props) {
    super(props)
    this.state = { err: 'loading albums...', albums: [] }

    this.fetchAlbums = this.fetchAlbums.bind(this)
    this.upvoteAlbum = this.upvoteAlbum.bind(this)
  }

  async componentDidMount() {
    this.fetchAlbums()

    setInterval(this.fetchAlbums, 5*1000)
  }

  async fetchAlbums() {
    let api = apiRequest(this.props.userToken)
    let res = await api.get('/albums?limit=10')
    let albums = this.sortByPoints(res.data)

    this.setState({ albums, err: null })
  }

  sortByPoints(list) {
    return R.reverse(R.sortBy(R.prop('pointsNow'), list))
  }

  async upvoteAlbum(album) {
    let api = apiRequest(this.props.userToken)
    let id

    // get user id
    await api.get('/users/me')
          .then(res =>  id = res.data.id)
          .catch(err => this.setState({ err: errorMessage(err) }))

    // post upvote
    let albums = await api.post('/points', {
      _user: id,
      action: 'upvote',
      album: album
    })
    // refetch albums
    .then(this.fetchAlbums)
    .catch(err => this.setState({ err: errorMessage(err) }))
  }

  render () {
    return (
      <div>
        {this.state.err && <p className="red">{this.state.err}</p>}
        {this.state.albums.map((a, i) => 
          <div className="cf mb3">
            <img className="fl mr3 shadow-4 "width="40" height="40" src={a.image[1]} alt=""/>
            <div className="mt3">
              <div className="fl f6 mr2 pointer gray dim" onClick={this.upvoteAlbum.bind(null, a._id)}>up</div>
              <div className="fl mr2 bold green">{a.pointsNow}</div>
              <div className="fl bold mr2">{a.pointsTotal}</div>
              <div className="fl"><Link className="f5 measure lh-copy mv2" href={"/albums?id=" + a._id}>{a.title}</Link> - <em>{a.artist}</em></div>
            </div>
          </div>
        )}
      </div>
    )
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


const styles = {
  'inner': style({
    margin: '0 auto',
    color: 'rgb(97, 97, 97)'
  }),
  'user': style({
    color: '#948bff'
  }),
  'add': style({
    color: '#137b23',
    cursor: 'pointer'
  })
}

