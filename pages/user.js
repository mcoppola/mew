import React, { PropTypes } from 'react'
import Link from 'next/link'
import { canUseDOM } from 'exenv';

import Head from '../components/Head'
import Nav from '../components/Nav'
import Dollars from '../components/Dollars'
import Spotify from '../components/Spotify'

import { getTokenFromCookie, getTokenFromLocalStorage } from '../utils/auth'
import { apiRequest, errorMessage, upvoteAlbum, findOrCreateAlbum, userFromToken } from '../utils/api'

// TODO: move key
const filstackApiKey = 'Ar96l4dbRZyoiaEBakSpZz'


export default class extends React.Component {
  static async getInitialProps ({ req, query }) {
    // Auth
    const userToken = process.browser ? getTokenFromLocalStorage() : getTokenFromCookie(req)

    return { userToken, query }
  }

  constructor(props) {
    super(props)

    this.state = { user: null, points: null, changed: false, formValues: {} }
    this.saveSettings = this.saveSettings.bind(this)
    this.fetchUserData = this.fetchUserData.bind(this)
    this.updateProfileImage = this.updateProfileImage.bind(this)
  }


  componentDidMount() {
    this.api = apiRequest(this.props.userToken)
    this.fsClient = canUseDOM ? require('filestack-js').default.init(filstackApiKey) : {}

    this.fetchUserData()    
  }

  fetchUserData() {
    if (this.props.userToken) {
      this.api.get('/users/me')
        .then(res => { 
          this.setState({ user: res.data })
        })
        .catch(e => console.log(e))

      this.api.get('/users/points')
        .then(res => {
          this.setState({ points: res.data })
        })
        .catch(e => console.log(e))

      this.api.get('/users/dollars')
        .then(res => {
          this.setState({ dollars: res.data })
        })
        .catch(e => console.log(e))
    }
  }

  saveSettings(e) {
    this.api.put('/users/me', this.state.formValues)
      .then(res => {
        this.fetchUserData()
        this.setState({ changed: false })
      })
      .catch(e =>  console.log(e))
  }

  updateProfileImage(e) {
    let file = e.target.files[0]

    this.fsClient.upload(file)
      .then(res => {
        this.setState({ 
          formValues: { profileImage: res.url }, 
          changed: true 
        })
      })
  }


  render() {
    return (
      <div>
        <Head/>
        <div className="h-100">
          <div className="cf mw7 tl ma0 center">
            <Nav userToken={ this.props.userToken } />

            <div className="cf mt5">
              { this.state.user &&
                  <div>
                    <div className="fl tc mr1">
                      <img src={ this.state.formValues.profileImage ? this.state.formValues.profileImage : this.state.user.profileImage }
                          className="br-100 h2 w2 dib" alt="Image"></img>
                    </div>
                    <h6 className="fl b" style={{ color: '#948bff' }} >{ this.state.user.username }</h6>
                    <Link href="/logout"><p className="f6 measure-wide fl mt2 ml2 pointer dim">Logout</p></Link> 
                  </div>
                }
            </div>

            <div className="cf mt5">
              <div className="fl w-20">
                <h6 className="f5 b">Stats</h6>
              </div>
              <div className="fl w-80">
                <div>
                  { this.state.points &&
                    <p><span className="b">{ this.state.points.sum }</span> points</p>
                  }
                  {
                    this.state.dollars &&
                    <div className="dib">
                      <Dollars data={this.state.dollars}/>
                    </div>
                  }
                </div>
              </div>
            </div>

            <div className="cf mt5">
              <div className="fl w-20">
                <h6 className="f5 b">Settings</h6>
              </div>
              <div className="fl w-80">
                <div className="cf">
                  { this.state.user &&
                    <div>
                      <p className="fl mr1">username</p>
                      <input 
                        onChange={e => { this.setState({ changed: true })}} 
                        onKeyUp={e => { this.setState({ formValues: { username: e.target.value }}) }} 
                        className="fl" 
                        type="text" 
                        placeholder={this.state.user.username} />
                    </div>
                  }
                </div>
                <div className="cf mt2">
                  { this.state.user &&
                    <div>
                      <p className="fl mr1">profile image</p>
                      <div className="fl pa1 tc">
                        <img
                            src={ this.state.formValues.profileImage ? this.state.formValues.profileImage : this.state.user.profileImage }
                            className="br-100 h1 w1 dib" alt="Image"></img>
                      </div>
                      <div className="cf db">
                        <input 
                          onChange={this.updateProfileImage} 
                          className="db" 
                          type="file" />
                      </div>
                    </div>
                  }
                </div>
              </div>

              <div className="cf mt5">
                <div className="fl w-20 mt5">
                  <h6 className="f5 b">Spotify</h6>
                </div>
                <div className="fl w-80 mt5">
                  <div className="cf">
                    { this.state.user &&
                      <Spotify userToken={this.props.userToken}/>
                    }
                  </div>
                </div>
             </div>

            </div>
          </div>   
        </div>
      </div>
    )
	}
}