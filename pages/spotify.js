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

    this.api = apiRequest(this.props.userToken)
    this.authSpotify = this.authSpotify.bind(this)
    this.userSpotifyAccess = this.userSpotifyAccess.bind(this)
    this.getTopTracks = this.getTopTracks.bind(this)
    this.addTopTracks = this.addTopTracks.bind(this)

    this.state = { userSpotifyAccess: false, topTracks: [] }
  }

  componentDidMount() {
  	this.spotifyApi = new SpotifyWebApi({
  	  clientId : '24ff5979c65f4eff8b7ece06329d8afc',
      // clientSecret: 'b20a6499e02642e6b2449827da0288d1',
  	  redirectUri : 'http://localhost:3000/spotify-callback'  
  	})


    this.userSpotifyAccess()
  }

  async userSpotifyAccess() {
    // first check if we have it
    let user = (await userFromToken(this.props.userToken)).data

    if (user.spotifyAccess) {
      
      // reauthorize
      let res = await this.api.get('/spotify/reauthorize')

      let access = res.data.access_token

      this.spotifyApi.setAccessToken(access)
      this.getTopTracks()
    } 

    this.setState({ userSpotifyAccess: user.spotifyAccess ? true : false })
  }


  getTopTracks() {
    this.spotifyApi.getMyTopTracks({ 
        time_range: 'short_term',
        limit: 10
      })
      .then( data => {
        this.setState({ topTracks: data.body.items })
      }, err => console.log )
  }

  addTopTracks() {
    this.api.post('/spotify/add-top-tracks')
    .then(res => console.log(res))
    .catch(err => console.log(err))
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
                   <div className="dib">
                    <p className="db mr2 color--green">Connected to Spotify</p>
                   </div>
                   :
                   <p className="dib mr2 pointer dim" onClick={this.authSpotify}>Authroize Spotify</p>
                }
                { this.state.topTracks.length &&
                  <p className="dib pointer dim" onClick={this.addTopTracks}>Add Top Tracks</p>
                }
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