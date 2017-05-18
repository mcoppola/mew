import React, { PropTypes } from 'react'

import { apiRequest, errorMessage } from '../utils/api'
import { searchAlbums } from '../utils/lastfm'


class AlbumSearchInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = { searchResults: [] }

    this.searchAlbums = this.searchAlbums.bind(this)
    this.onSelect = this.onSelect.bind(this)
    this.reset = this.reset.bind(this)
  }

  searchAlbums(e) {
    this.setState({ value: e.target.value })
    searchAlbums(e.target.value)
      .get('/')
      .then(res => {
        this.setState({ searchResults: res.data.results.albummatches.album.slice(0,9) })
      })
      .catch(err => console.log(err))
  }

  onSelect(album) {
    this.props.onSelect(album)
    this.setState({ 
      selectedAlbum: album, 
      value: album.title,
      searchResults: [],
      saved: false
    })
  }

  reset() {
    this.setState({ 
      selectedAlbum: null, 
      searchResults: [],
      saved: false
    })
  }


  render() {
    return(
        <div className="cf mw6">
          <input 
            className="db input-reset f6 ba b--black-40 pa2 mb2 db w-60 fl" 
            type="text" 
            ref="newListItem" 
            value={this.state.value}
            onChange={this.searchAlbums} 
            placeholder="Add Album"
          />
          <input type="submit" className="fl f6 fb dib ba pa2 ph3 bg-white dim pointer" value="Add" />
          <div className="db pa2 f6 mb1">&nbsp;</div>
          <div className="f6 absolute bg-white shadow-1">{this.state.searchResults.map(
            album => 
              <div className="cf album-item mw6 dim pointer" onClick={this.onSelect.bind(null, album)}>
                <div className="w-10 fl">
                  <img width="40" height="40" src={album.image[1]['#text']} alt=""/>
                </div>
                <div className="w-90 fl">
                  { album.artist } - { album.name }
                </div>
              </div>
         )}</div>
        </div>
      )
  }
}

export default AlbumSearchInput
