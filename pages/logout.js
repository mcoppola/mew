import React from 'react'
import axios from 'axios';
import Head from '../components/Head'

import { unsetToken, getToken } from '../utils/auth'
import redirect from '../utils/redirect'

export default class extends React.Component {
  static async getInitialProps (ctx) {
    unsetToken()
  }
  render() {
  	return(
      <div>
        <Head title="Mew - Logout"/>
      </div>)
  }
}