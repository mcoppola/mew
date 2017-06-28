import React, { PropTypes } from 'react'
import Link from 'next/link'
import * as R from 'ramda'

import { apiRequest, errorMessage, upvoteAlbum } from '../utils/api'
import { searchAlbums } from '../utils/lastfm'


export default class AlbumsList extends React.Component {
  constructor(props) {
    super(props)

    this.state = { err: 'loading albums...', albums: [], refreshing: false, query: null }

    this.refreshAlbums = this.refreshAlbums.bind(this)
    this.onItemClick = this.onItemClick.bind(this)
    this._onUserSelect = this._onUserSelect.bind(this)
    this.setQuery = this.setQuery.bind(this)
  }

  async componentDidMount() {
    this.api = apiRequest(this.props.userToken)
    this.refreshAlbums()

    // setInterval(this.refreshAlbums, 5*1000)
  }

  async refreshAlbums() {
    // if (this.state.refreshing) return
    this.setState({ refreshing: true })

    let oldPos = this.state.albums.map((a, i) => { return { id: a._id, pos: i }})
    // fetch albums
    let res = await this.api.get(this.state.query || '/albums?limit=30')
    let albums = this.calcDeltas(oldPos, this.sortByPoints(res.data))

    this.setState({ albums, err: null })

    // after UI transition, end refreshing
    setTimeout(() => { this.setState({ refreshing: false })}, 817)
  }

  setQuery(query) {
    this.setState({ query }, () => this.refreshAlbums())
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

    this.props.onVoteAction({ type: 'upvote', value: 1 })
  }

  _onUserSelect(user) {
    if (this.state.refreshing) return 

    this.setState({ query: '/albums/user/'+user.id+'?limit=30' }, () => this.refreshAlbums())
    this.props.onUserSelect(user)
  }

  formatTitle(t) {
    let max = 30
    return t.length > max ? t.substring(0, max) + '... ' : t
  }

  render () {
    return (
      <div>
        {this.state.err && <p className="red">{this.state.err}</p>}
        {this.state.albums.map((a, i) => 
          <div className={"mw-album-list__item cf delta__" + a.delta} key={a._id +'__'+ a.title}>
            
            <div className="fl">
              <div className="mt2 pt1 fl mr3">
                <div className="fl f6 w1 mr3 color--purple mw--mono">{(i + 1) + '.'}</div>
                <div className="fl f6 w1 mr3 color--green mw--mono">{a.pointsNow}</div>
                <div className="fl f6 w1 color--gray1 mw--mono">{a.pointsTotal}</div>
              </div>
            </div>
            <img className="mw-album-list__item__img fl mr3" width="46" height="46" src={"" || a.image[1]} alt="" onClick={this.onItemClick.bind(null, a._id)} />
            
            <div className="fl">
              <div className="cf">
                <h6 className="dib v-btm lh-solid mw--sabon mw--small">{this.formatTitle(a.title)}</h6>
                <p className="dib v-btm lh-solid mw--smaller color--dark mw--med">&nbsp;<span className="color--purple">/</span>&nbsp;{a.artist}</p>
              </div>
              <div className="db">
                <div className="fl pt1">
                  { a.pointsUsers.map(u => 
                      <div className="fl tc mr1 dim pointer" onClick={e => this._onUserSelect(u) } key={u.id + '__pointsusers'}>
                        <img src={u.profileImage}className="br-100 h1 w1 dib" alt=""></img>
                      </div>
                    )}
                </div>
              </div>
            </div>
            
          </div>
        )}
      </div>
    )
  }
}

// <div className="mw-album-list__item__up mt1 fl mr2 pointer color--gray3" onClick={this.onItemClick.bind(null, a._id)} >up</div>