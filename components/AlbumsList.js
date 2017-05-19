import React, { PropTypes } from 'react'
import Link from 'next/link'
import * as R from 'ramda'

import { apiRequest, errorMessage } from '../utils/api'
import { searchAlbums } from '../utils/lastfm'


export default class AlbumsList extends React.Component {
  constructor(props) {
    super(props)
    this.state = { err: 'loading albums...', albums: [ ] }

    this.fetchAlbums = this.fetchAlbums.bind(this)
    this.upvoteAlbum = this.upvoteAlbum.bind(this)
  }

  async componentDidMount() {
    this.fetchAlbums()

    setInterval(this.fetchAlbums, 5*1000)
  }

  async fetchAlbums() {
    let api = apiRequest(this.props.userToken)
    let res = await api.get(this.props.query || '/albums?limit=10')
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
            <img className="fl mr3 shadow-4" width="40" height="40" src={a.image[1]} alt=""/>
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