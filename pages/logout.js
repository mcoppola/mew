import React from 'react'
import Head from 'next/head'
import axios from 'axios';


import { unsetToken, getToken } from '../utils/auth'

export default class extends React.Component {
  static async getInitialProps (ctx) {

    unsetToken()

    if (ctx.req) {
	    ctx.res.writeHead(302, { Location: '/' })
	    return
	  } else {
	    document.location.pathname = '/'
	    return
	  }
  }
  render() {
  	return;
  }
}