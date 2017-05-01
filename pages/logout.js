import React from 'react'
import axios from 'axios';
import Head from '../components/Head'

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
  	return(
      <div>
        <Head title="Mew - Logout"/>
      </div>)
  }
}