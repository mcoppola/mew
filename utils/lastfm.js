// Application name	Mew
// API key	058345110c4d0a9174fa2a8171d81487
// Shared secret	334c0d6dad8459027dd7806c2b36861a
// Registered to	mcoppola832

import axios from 'axios';

export const lastfmRequest = () => axios.create({
  baseURL: 'http://ws.audioscrobbler.com/2.0/',
  params: {
    format: 'json',
    api_key: '058345110c4d0a9174fa2a8171d81487'
  }
})

export const searchAlbums = (q = '') => axios.create({
  baseURL: 'http://ws.audioscrobbler.com/2.0/',
  params: {
    format: 'json',
    api_key: '058345110c4d0a9174fa2a8171d81487',
    method: 'album.search',
    album: q
  }
})