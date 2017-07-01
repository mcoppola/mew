import React, { PropTypes } from 'react'
import Link from 'next/link'
import * as R from 'ramda'

import Head from '../components/Head'
import Nav from '../components/Nav'
import AlbumSearchInput from '../components/AlbumSearchInput'
import AlbumsList from '../components/AlbumsList'


import { getTokenFromCookie, getTokenFromLocalStorage, getToken } from '../utils/auth'
import { apiRequest, errorMessage, upvoteAlbum, findOrCreateAlbum } from '../utils/api'


export default class extends React.Component {
  static async getInitialProps (ctx) {
    // Auth
    const userToken = process.browser ? getTokenFromLocalStorage() : getTokenFromCookie(ctx.req)

    return { userToken, path: ctx.pathname }
  }

  constructor(props) {
    super(props)

    this.onAlbumSelect = this.onAlbumSelect.bind(this)
    this.onUserSelect = this.onUserSelect.bind(this)
    this.onVoteAction = this.onVoteAction.bind(this)
    this.onRemoveUser = this.onRemoveUser.bind(this)

    this.state = { selectedAlbum: null, selectedUser: null, actions: [] } 
  }

  async onAlbumSelect(album) {

    findOrCreateAlbum({ album, userToken: this.props.userToken })
      .then(upvoteAlbum)
      .then(res => { 
        this.AlbumsList.refreshAlbums()
      })
      .catch(console.log)

    this.setState({ selectedAlbum: album })
  }

  onUserSelect(user) {
    this.setState({ selectedUser: user })
  }

  onVoteAction(action) {
    this.setState({ actions: this.state.actions.concat([action]) })
  }

  onRemoveUser() {
    this.removeSelectedUser()
  }

  removeSelectedUser() {
    this.setState({ selectedUser: null })
    this.AlbumsList.setQuery(null)
  }

  render() {
    return (
      <div>
        <Head/>
        <div className="h-100">
          
          <div className="fixed w-100 z-2 bg--white">
            <div className="cf mw7 tl ma0 center">
              <Nav 
                  userToken={ this.props.userToken } 
                  path={ this.props.path } 
                  actions={ this.state.actions } 
                  selectedUser={this.state.selectedUser}
                  onRemoveUser={this.onRemoveUser } />
            </div>
          </div>

          <div className="cf mw7 tl ma0 center z-1 pt2">
            <div className="cf mt3 pt3">
              <div className="w-70 fl">
                <div>
                  <div>
                  { <AlbumsList 
                      onUserSelect={ this.onUserSelect }
                      onVoteAction={ this.onVoteAction }
                      userToken={ this.props.userToken } 
                      selected={ this.state.selectedAlbum } 
                      ref={instance => { this.AlbumsList = instance; }} /> 
                    }
                  </div>
                  <div className="mt4">
                  { <AlbumSearchInput 
                      onSelect={ this.onAlbumSelect} /> 
                    }
                  </div>  
                </div>
              </div>
              <div className="w-30 fl mt2">
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
              <div className="cf" key={u.id}>
                <div className="fl tc mr1">
                    <img src={u.profileImage}
                        className="br-100 h1 w1 dib" alt=""></img>
                  </div>
                  <p className="fl f6 lh-solid v-top gray" key={u.id}>{u.username}</p>
              </div>
            )
        })}
      </div>
    )
  }
}
