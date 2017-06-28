import axios from 'axios';
import config from '../config/constants'


export const apiRequest = (user) => axios.create({
  baseURL: config.api.uri,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': user ||  null
  }
})

// USER ===========================

export const userFromToken = (token) => {
  return new Promise((resolve, reject) => {
    let api = apiRequest(token)
    // get user id
    api.get('/users/me')
      .then(res => resolve(res))
      .catch(reject)
  });
}

// ALBUM ===========================

export const findOrCreateAlbum = ({ album, userToken }) => {
  return new Promise((resolve, reject) => {
    let api = apiRequest(userToken)

    userFromToken(userToken)
    .then(user => {
    	// frist, try to find album by mbid or fmUrl
	    api.get('/albums', { params: {
				format: 'json',
				q: {
					mbid: album.mbid && album.mbid.length ? album.mbid : null,
					fmUrl: album.url && album.url.length ? album.url : null
				}

				}}).then(res => {

				if (res.data && res.data.length) {
					// found, return it
					return resolve({ album: res.data[0], userToken })
				} else {

					// Second, try to find album by title, artist
					api.get('/albums', { params: {
						format: 'json',
						q: {
							title: album.name,
							artist: album.artist,
						}

						}}).then(res => {

							if (res.data && res.data.length) {
								// found, return it
								return resolve({ album: res.data[0], userToken })
							} else {

								// Not found, create it
								api.post('/albums', { 
							      _user: user.id,
							      title: album.name,
							      artist: album.artist,
							      image: album.image.map(i => i['#text']),
							      mbid: album.mbid && album.mbid.length ? album.mbid : null,
							      fmUrl: album.url && album.url.length ? album.url : null
							    }).then(res => {
							   		return resolve({ album: res.data, userToken })
							    })
								}
							})
		   
					}
				})
			})
		})
}

export const upvoteAlbum = ({ album, userToken }) => {
  return new Promise((resolve, reject) => {
    let api = apiRequest(userToken)

    userFromToken(userToken)
    .then(res => {

      api.post('/points', {
        _user: res.data.id,
        action: 'upvote',
        album: album
      })
      .then(res => { 
      	resolve(res)
      })
      .catch(reject)
    })
    .catch(reject)
  })
}

export const errorMessage = (error) => {
	let err = error.response ? error.response.data : error;
	try {
		err = JSON.parse(err)
	} catch (e) {}

	if (err.errors) {
		err = Object.keys(err.errors).map(k => err.errors[k]).join(' ')
	} else if (err.message) {
		err = err.message
	}
	return translateErrorCode(err)
}

const errorCodeMessages = {
	// List create: <title> + <_user> must be unique
	'E11000': {
		msg: 'List already exists with that name'
	}
}

function translateErrorCode(msg) {
	let strings = msg.toString().split(' ')

	for (let i = 0; i < strings.length; i++) {
		if (Object.keys(errorCodeMessages).indexOf(strings[i]) > -1 ) {
			return errorCodeMessages[strings[i]].msg
		}
	}
	return msg
}


export const paramsFromObj = (data) =>
 	Object.keys(data).map(key => `${key}=${encodeURIComponent(data[key])}`).join('&');

