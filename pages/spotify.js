import React, { PropTypes } from 'react'
import Link from 'next/link'
import * as R from 'ramda'
import SpotifyWebApi from 'spotify-web-api-node'

import Head from '../components/Head'
import Nav from '../components/Nav'

import { getTokenFromCookie, getTokenFromLocalStorage } from '../utils/auth'
import { apiRequest, errorMessage, upvoteAlbum, findOrCreateAlbum, userFromToken } from '../utils/api'




export default class extends React.Component {
  static async getInitialProps ({ req, query }) {
    // Auth
    const userToken = process.browser ? getTokenFromLocalStorage() : getTokenFromCookie(req)

    return { userToken, query }
  }

  constructor(props) {
    super(props)

    this.authSpotify = this.authSpotify.bind(this)
    this.userSpotifyAccess = this.userSpotifyAccess.bind(this)
    this.topTracks = this.topTracks.bind(this)

    this.state = { userSpotifyAccess: false, topTracks: [] }
  }

  componentDidMount() {
  	this.spotifyApi = new SpotifyWebApi({
  	  clientId : '24ff5979c65f4eff8b7ece06329d8afc',
      clientSecret: 'b20a6499e02642e6b2449827da0288d1',
  	  redirectUri : 'http://localhost:3000/spotify-callback'  
  	})


    this.userSpotifyAccess()
  }

  async userSpotifyAccess() {
    // first check if we have it
    let user = (await userFromToken(this.props.userToken)).data

    console.log('user', user)

    if (user.spotifyAccess) {

      this.spotifyApi.setAccessToken(user.spotifyAccess)
      this.spotifyApi.setRefreshToken(user.spotifyRefresh)

      this.topTracks()
    } 

    this.setState({ userSpotifyAccess: user.spotifyAccess ? true : false })
  }


  topTracks() {
    this.spotifyApi.getMyTopTracks({ 
        time_range: 'short_term',
        limit: 10
      })
      .then( data => {
        console.log('Top Tracks:', data.body)

        this.setState({ topTracks: data.body.items })

      }, err => console.log )
  }

  async authSpotify() {
    let scopes = ['user-read-private', 'user-read-email', 'user-top-read'],
        state = 'foo';

    // Create the authorization URL
    let authorizeURL = this.spotifyApi.createAuthorizeURL(scopes, state)
    window.location = authorizeURL
  }

  render() {
    return (
      <div>
        <Head/>
        <div className="h-100">
          <div className="cf mw7 tl ma0 center">
            <Nav userToken={ this.props.userToken } />
            <div className="cf">
              <div>
                { this.state.userSpotifyAccess ? 
                   <p className="dib mr1 color--green">Connected to Spotify</p>
                   :
                   <p className="dib mr1 pointer dim" onClick={this.authSpotify}>Authroize Spotify</p>
                }
                <p className="dib pointer dim" onClick={this.topTracks}>Refresh Top Tracks</p>

                <div className="mt3">
                  <h6 className="mw--med mb3 f5">My Top Albums on Spotify</h6>
                  { this.state.topTracks.map( t => 
                    <div className="mw-album-list__item cf" key={t.album.id}>
                      <img className="fl mr3" width="36" height="36" src={t.album.images[1].url} alt=""/>
                      <div className="mt1 pt1">
                        <div className="fl mw--small "><span className="mw--med color--blak">{t.album.name}</span> - <span className="color--dark">{t.artists[0].name}</span></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
           </div>
      	</div>
      </div>
      )
	}
}