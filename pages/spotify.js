import React, { PropTypes } from 'react'
import Link from 'next/link'
import * as R from 'ramda'
import SpotifyWebApi from 'spotify-web-api-node'

import Head from '../components/Head'
import Nav from '../components/Nav'

import { getTokenFromCookie, getTokenFromLocalStorage, getToken } from '../utils/auth'
import { apiRequest, errorMessage, upvoteAlbum, findOrCreateAlbum, paramsFromObj } from '../utils/api'




export default class extends React.Component {
  static async getInitialProps ({ req, query }) {
    // Auth
    const userToken = process.browser ? getTokenFromLocalStorage() : getTokenFromCookie(req)

    return { userToken, query }
  }

  constructor(props) {
    super(props)

    this.authSpotify = this.authSpotify.bind(this)
    this.apiCodeGrant = this.apiCodeGrant.bind(this)
    this.topTracks = this.topTracks.bind(this)
    this.state = { selectedAlbum: null } 
  }

  componentDidMount() {
  	this.spotifyApi = new SpotifyWebApi({
  	  clientId : '24ff5979c65f4eff8b7ece06329d8afc',
      clientSecret: 'b20a6499e02642e6b2449827da0288d1',
  	  redirectUri : 'http://localhost:3000/spotify'  
  	})

    if (this.props.query.code) {
      // ap[ly for code grant through api proxy
      this.apiCodeGrant(this.props.query.code)
    }

  }

  apiCodeGrant(code) {
    let api = apiRequest(this.props.userToken)

    api.get('/auth/spotify', {
      params: {
        code: code
      }
    })
    .then( res => {

      // Set the access token on the API object to use it in later calls
      this.spotifyApi.setAccessToken(res.data['access_token'])
      this.spotifyApi.setRefreshToken(res.data['refresh_token'])

      // Save tokens to user in db
      api.put('/users/me', {
        spotifyAccess: res.data['access_token'],
        spotifyRefresh: res.data['refresh_token']
      })

    }, err => console.log )

    this.topTracks()

  }

  topTracks() {
    this.spotifyApi.getMyTopTracks({ 
          time_range: 'short_term'
        })
        .then(function(data) {
          console.log('Top Tracks:', data.body);
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
            { this.props.query.code ? 
              <div>
                <p className="pointer dim color--green"
                >Connected to Spotify</p>
                <p className="pointer dim"
                onClick={this.topTracks}
                >Top Tracks</p>
              </div>
              : 
              <p className="pointer dim"
              onClick={this.authSpotify}
              >Authroize Spotify</p>
            }
            	
            </div>
           </div>
      	</div>
      </div>
      )
	}
}