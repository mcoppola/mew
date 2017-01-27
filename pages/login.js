import React from 'react'
import Link from 'next/link'
import { style } from 'glamor'
import * as  _ from 'lodash'
import Head from 'next/head'
import axios from 'axios';


import { getTokenFromCookie, getTokenFromLocalStorage, setToken } from '../utils/auth'

export default class extends React.Component {
  static async getInitialProps (ctx) {

    const loggedUser = process.browser ? getTokenFromLocalStorage() : getTokenFromCookie(ctx.req)

    return { msg: '' }
  }

  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }


  handleSubmit (e) {
    e.preventDefault()

    axios.post('http://localhost:4567/auth/login', {
      username: this.refs.username.value,
      password: this.refs.password.value
    })
    .then(res => {
      let token = res.data.token
      setToken(token)
      this.props.url.replaceTo('/')
    })
    .catch( err => {
      console.log(err);
    })
  }

  render() {
    return (
      <div>
        <Head>
          <title>Mew</title>
          <link rel="stylesheet" href="https://unpkg.com/tachyons/css/tachyons.min.css"/>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <div {...styles.inner} className="cf mw7 mt5">
         <Link href="/"><h3 className="f6 measure-wide">Home</h3></Link>

         { this.props.loginStatus }

         <h2 className="f6 mt5">Login</h2>
         <form onSubmit={this.handleSubmit} action="http://localhost:4567/auth/login" method="POST">
           <input type="text" ref="username" placeholder="username"/>
           <input type="password" ref="password" placeholder="password"/>
           <input type="submit"/>
         </form>
        </div>
      </div>
    );
  }
}



const styles = {
  'inner': style({
    margin: '0 auto',
    color: 'rgb(97, 97, 97)'
  })
}