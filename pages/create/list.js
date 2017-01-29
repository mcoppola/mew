import React from 'react'
import Link from 'next/link'
import { style } from 'glamor'
import { merge } from 'lodash'
import Head from 'next/head'
import axios from 'axios'

import Header from '../../components/Header'

import { getTokenFromCookie, getTokenFromLocalStorage, setToken } from '../../utils/auth'
import { apiRequest } from '../../utils/api'
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
    this.saveList = this.saveList.bind(this)
    this.searchAlbums = this.searchAlbums.bind(this)
  }


  handleSubmit(e) {
    e.preventDefault()

    this.setState({
      list: this.state.list.concat(this.refs.newListItem.value),
      title: this.refs.title.value,
      saved: false
    })

    this.refs.newListItem.value = '';
  }

  async saveList(e) {
    let api = apiRequest(this.props.userToken)
    let id;

    await api.get('/users/me')
          .then(res =>  id = res.data.id)
          .catch(err => console.log(err))

    await api.post('/lists', { 
            _user: id,
            title: this.state.title,
            albums: this.state.list
          })
          .then(res => { 
            this.setState({ saved: true }) 
          })
          .catch(err => console.log(err))
  }

  searchAlbums(e) {

    console.log('searchalbum this.value', e.target.value);
    this.setState({album: e.target.value});

    searchAlbums(e.target.value)
      .get('/')
      .then(res => {
        console.log(res.data.results)
        console.log(res.data.results.albummatches.album)
        this.setState({ searchResults: res.data.results.albummatches.album.slice(0,9) })
      })
      .catch(err => console.log(err))
  }


  render() {

    let listItems = this.state.list.map(item => <div className="f6">{item}</div>)

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div className="cf">
            <input className="f5 mv2" type="text" ref="title" placeholder="List Title"/>
          </div> 
          <div className="cf">
            {listItems}
          </div>
           <input className="f6" type="text" ref="newListItem" value={this.state.album} onChange={this.searchAlbums} placeholder="Artist / Album"/>
           <div className="f6">{this.state.searchResults.map(
              album => 
                <div className="cf album-item mw6 dim pointer shadow" data={album}>
                  <div className="w-10 fl">
                    <img width="40" height="40" src={album.image[1]['#text']} alt=""/>
                  </div>
                  <div className="f-90 fl">
                    { album.artist } - { album.name }
                  </div>
                </div>
           )}</div>
           <input type="submit"/>
         </form>

         <div {...styles.add} onClick={this.saveList}>{ this.state.saved ? 'list saved' : 'Save'}</div>
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
          <link rel="stylesheet" href="https://unpkg.com/tachyons/css/tachyons.min.css"/>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <div {...styles.inner} className="cf mw7 mt5">
          <Header userToken={this.props.userToken} />
          <div className="cf mt3">
            <h6>New List</h6>
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