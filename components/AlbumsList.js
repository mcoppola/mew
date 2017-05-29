import React, { PropTypes } from 'react'
import Link from 'next/link'
import * as R from 'ramda'

import { apiRequest, errorMessage, upvoteAlbum } from '../utils/api'
import { searchAlbums } from '../utils/lastfm'


export default class AlbumsList extends React.Component {
  constructor(props) {
    super(props)
    this.state = { err: 'loading albums...', albums: [], refreshing: false }

    this.refreshAlbums = this.refreshAlbums.bind(this)
    this.onItemClick = this.onItemClick.bind(this)
  }

  async componentDidMount() {
    this.api = apiRequest(this.props.userToken)
    this.refreshAlbums()

    // setInterval(this.refreshAlbums, 2*1000)
  }

  async refreshAlbums() {
    if (this.state.refreshing) return
    this.setState({ refreshing: true })

    let oldPos = this.state.albums.map((a, i) => { return { id: a._id, pos: i }})
    // fetch albums
    let res = await this.api.get(this.props.query || '/albums?limit=10')
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

  async onItemClick(album) {
    if (this.state.refreshing) return

    upvoteAlbum({ album, userToken: this.props.userToken })
      // refetch albums
      .then(this.refreshAlbums)
      .catch(err => this.setState({ err: errorMessage(err) }))
  }

  render () {
    return (
      <div>
        {this.state.err && <p className="red">{this.state.err}</p>}
        {this.state.albums.map((a, i) => 
          <div className={"mw-album-list__item cf delta__" + a.delta} key={a._id}>
            <img className="fl mr3" width="36" height="36" src={"" || a.image[1]} alt=""/>
            <div className="mt1 pt1">
              <div className="fl mr2 pointer gray dim" onClick={this.onItemClick.bind(null, a._id)} >up</div>
              <div className="fl mr2 mw--med green">{a.pointsNow}</div>
              <div className="fl color--dark mr2">{a.pointsTotal}</div>
              <div className="fl mw--small "><span className="mw--med color--blak">{a.title}</span> - <span className="color--dark">{a.artist}</span></div>
            </div>
          </div>
        )}
      </div>
    )
  }
}