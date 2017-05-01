import React from 'react'
import Link from 'next/link'
import { style } from 'glamor'
import { merge } from 'lodash'
import Head from 'next/head'
import axios from 'axios'

import Nav from '../../components/Nav'

import { getTokenFromCookie, getTokenFromLocalStorage, setToken } from '../../utils/auth'
import { apiRequest, errorMessage } from '../../utils/api'
import { searchAlbums } from '../../utils/lastfm'


class CreateListForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      list: [], 
      title: '', 
      saved: false,
      album: '', 
      searchResults: [] 
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.setTitle = this.setTitle.bind(this)
    this.saveList = this.saveList.bind(this)
    this.searchAlbums = this.searchAlbums.bind(this)
    this.selectAlbum = this.selectAlbum.bind(this)
  }


  handleSubmit(e) {
    e.preventDefault()

    this.setState({
      list: this.state.list.concat({ label: this.refs.newListItem.value }),
      title: this.refs.title.value,
      saved: false,
      albumInput: ''
    })

    this.refs.newListItem.value = '';
  }


  setTitle(e) {
    this.setState({ title: e.target.value })
  }


  async saveList(e) {
    let api = apiRequest(this.props.userToken)
    let albums = this.state.list.map(l => l.data)
    let id;

    if (!this.state.title) {
      return this.setState({ err: 'Title is required'})
    } else if (!albums.length) {
      return this.setState({ err: 'Albums are required'})
    }

    // get user id
    await api.get('/users/me')
          .then(res =>  id = res.data.id)
          .catch(err => errorMessage(e))


    // create albums refs in our db
    await Promise.all(
          albums.map( album => 
            api.post('/albums', { 
              _user: id,
              title: album.name,
              artist: album.artist,
              image: album.image.map(i => i['#text']),
              mbid: album.mbid
            })
          ))
          .then(res => {
            albums = res.map(r => r.data._id)
          })
          .catch(e => errorMessage(e))

    // add to lists
    await api.post('/lists', { 
            _user: id,
            title: this.state.title,
            _albums: albums
          })
          .then(res => { 
            this.setState({ saved: true, err: null }) 
          })
          .catch(e => this.setState({ err: errorMessage(e) }))
  }


  searchAlbums(e) {
    this.setState({ albumInput: e.target.value });
    searchAlbums(e.target.value)
      .get('/')
      .then(res => {
        this.setState({ searchResults: res.data.results.albummatches.album.slice(0,9) })
      })
      .catch(err => console.log(err))
  }


  selectAlbum(album) {
    let label = album.artist + ' - ' + album.name
    this.setState({ 
      list: this.state.list.concat({ label, data: album }),
      selectedAlbum: album, 
      albumInput: label,
      searchResults: [],
      saved: false
    })
  }


  render() {

    let listItems = this.state.list.map((item, i) => { 
        return(
            <div className="cf">
              <div className="fl w-10">
                <img width="50" height="50" src={item.data.image[1]['#text']} alt=""/>
              </div>
              <div className="fl w-90">
                <div className="f6 mv3">{i + 1}. &nbsp; {item.label}</div> 
              </div>
            </div>
          )
      })

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div className="cf">
            <input className="input-reset f5 mb4 bt-0 bl-0 br-0 bb b--black-20 pa2" type="text" ref="title" value={this.state.title} onChange={this.setTitle} placeholder="List Title"/>
          </div> 
          <div className="cf">
            {listItems}
          </div>
            <div className="cf mw6">
              <input className="db input-reset f6 ba b--black-40 pa2 mb2 db w-60 fl" type="text" ref="newListItem" value={this.state.albumInput} onChange={this.searchAlbums} placeholder="Search Albums to add"/>
              <input type="submit" className="fl f6 fb dib ba pa2 ph3 bg-white dim pointer" value="Add" />
              <div className="db pa2 f6 mb1">&nbsp;</div>
              <div className="f6 absolute bg-white shadow-1">{this.state.searchResults.map(
                album => 
                  <div className="cf album-item mw6 dim pointer" onClick={this.selectAlbum.bind(null, album)}>
                    <div className="w-10 fl">
                      <img width="40" height="40" src={album.image[1]['#text']} alt=""/>
                    </div>
                    <div className="w-90 fl">
                      { album.artist } - { album.name }
                    </div>
                  </div>
             )}</div>
            </div>
         </form>

         <div className="mt5 green bg-washed-green ba pa2 dib pointer dim" onClick={this.saveList}>{ this.state.saved ? 'list saved' : 'Save'}</div>
         <div className="mt1 red">{this.state.err}</div>
      </div>
     )
  }
}


export default class extends React.Component {
  static async getInitialProps (ctx) {
    const userToken = process.browser ? getTokenFromLocalStorage() : getTokenFromCookie(ctx.req)

    return { userToken: userToken }
  }
  render() {
    return (
      <div>
        <Head>
          <title>Mew</title>
          <link rel="stylesheet" href="/static/tachyons.min.css"/>
        </Head>
        <div {...styles.inner} className="cf mw7 mt5">
          <Nav userToken={this.props.userToken} />
          <div className="cf mt3">
            <h3 className="mb5">New List</h3>
            <CreateListForm userToken={this.props.userToken} />
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
  }),
  'add': style({
    color: '#137b23',
    cursor: 'pointer'
  })
}