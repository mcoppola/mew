import React, { PropTypes } from 'react'
import Link from 'next/link'
import * as R from 'ramda'

import { apiRequest, errorMessage } from '../utils/api'
import { searchAlbums } from '../utils/lastfm'


export default class AlbumsList extends React.Component {
  constructor(props) {
    super(props)
    this.state = { err: 'loading albums...', albums: [] }

    this.refreshAlbums = this.refreshAlbums.bind(this)
    this.upvoteAlbum = this.upvoteAlbum.bind(this)
  }

  async componentDidMount() {
    this.refreshAlbums()

    setInterval(this.refreshAlbums, 2*1000)
  }

  async refreshAlbums() {
    if (this.state.refreshing) return
    this.setState({ refreshing: true })

    let oldPos = this.state.albums.map((a, i) => { return { id: a._id, pos: i }})
    // fetch albums
    let api = apiRequest(this.props.userToken)
    let res = await api.get(this.props.query || '/albums?limit=10')
    let albums = this.calcDeltas(oldPos, this.sortByPoints(res.data))

    this.setState({ albums, err: null })
    // after UI transition, end refreshing
    setTimeout(() => { this.setState({ refreshing: false })}, 1000)
  }

  sortByPoints (albums) { 
    return R.reverse(R.sortBy(R.prop('pointsNow'), albums))
  }
  calcDeltas (oldPos, albums) {
    return albums.map((album, i) => {
      return R.merge(album, {
        delta: R.filter(a => a.id === album._id, oldPos).length
               ? R.filter(a => a.id === album._id, oldPos)[0].pos - i
               : (oldPos.length ? albums.length - i : 0), 
      })
    })
  }

  async upvoteAlbum(album) {
    if (this.state.refreshing) return
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
    .then(this.refreshAlbums)
    .catch(err => this.setState({ err: errorMessage(err) }))
  } 

  render () {
    return (
      <div>
        {this.state.err && <p className="red">{this.state.err}</p>}
        {this.state.albums.map((a, i) => 
          <div className={"mw-album-list__item cf pv2 pointer delta__" + a.delta} 
              onClick={this.upvoteAlbum.bind(null, a._id)}
              key={a._id}>
            <img className="fl mr3 shadow-4" width="40" height="40" src={a.image[1]} alt=""/>
            <div className="mt2 pt1">
              <div className="fl f6 mr2 pointer gray dim" >up</div>
              <div className="fl mr2 bold green">{a.pointsNow}</div>
              <div className="fl bold mr2">{a.pointsTotal}</div>
              <div className="fl"><span className="color--blue mw--med">{a.title}</span> - <em>{a.artist}</em></div>
            </div>
          </div>
        )}
      </div>
    )
  }
}