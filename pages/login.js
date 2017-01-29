import React from 'react'
import Link from 'next/link'
import { style } from 'glamor'
import Head from 'next/head'
import axios from 'axios';

import Header from '../components/Header'

import { getTokenFromCookie, getTokenFromLocalStorage, setToken } from '../utils/auth'
import { connection, errorMessage } from '../utils/api'


export default class extends React.Component {
  static async getInitialProps (ctx) {
    const userToken = process.browser ? getTokenFromLocalStorage() : getTokenFromCookie(ctx.req)

    return { userToken }
  }

  constructor(props) {
    super(props)
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this)
    this.toggleCreateForm = this.toggleCreateForm.bind(this)

    this.state = { showCreateForm: false, err: null }
  }


  handleLoginSubmit (e) {
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
      this.setState({ err: errorMessage(err) })
    })
  }

  toggleCreateForm (e) {
    e.preventDefault()
    this.setState({ showCreateForm: !this.state.showCreateForm })
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
          <Header userToken={ this.props.userToken } />
          {!this.state.showCreateForm && 
            <div>
             <h2 className="f6 mt3">Login</h2>
             <form onSubmit={this.handleLoginSubmit} action="http://localhost:4567/auth/login" method="POST">
               <input className="f6" type="text" ref="username" placeholder="username"/>
               <input className="f6" type="password" ref="password" placeholder="password"/>
               <input className="f6" type="submit"/>
              </form>
            </div>
          }
          {this.state.err && <div className="f6 mt2">{this.state.err}</div>}
          {this.state.showCreateForm && <CreateAccountForm />}
          <div className="f6 mt2 dim pointer" onClick={this.toggleCreateForm}>{this.state.showCreateForm ? 'Login' : 'Create Account' }</div>
        </div>
      </div>
    )
  }
}


class CreateAccountForm extends React.Component {
  constructor(props) {
    super(props)
    this.handleCreateSubmit = this.handleCreateSubmit.bind(this)

    this.state = { err: null, msg: null }
  }
  handleCreateSubmit(e) {
    e.preventDefault()

    let api = connection()

    api.post('/users', {
      username: this.refs.username.value,
      password: this.refs.password.value,
      email: this.refs.email.value
    })
    .then(res => {
      let token = res.data.token
      setToken(token)
      this.setState({ err: 'Logged in!' })
    })
    .catch( err => {
      this.setState({ err:  errorMessage(err) })
    })

  }

  render() {
    return (
      <div>
        <h2 className="f6 mt3">Create Account</h2>
        <form onSubmit={this.handleCreateSubmit} action="http://localhost:4567/auth/login" method="POST">
          <input className="f6 db" type="text" ref="email" placeholder="email"/>
          <input className="f6 db" type="text" ref="username" placeholder="username"/>
          <input className="f6 db" type="password" ref="password" placeholder="password"/>
          <input className="f6 db" type="submit"/>
        </form>
        {this.state.err && <div className="f6 mt2">{this.state.err}</div>}
      </div>
    )
  }
}



const styles = {
  'inner': style({
    margin: '0 auto',
    color: 'rgb(97, 97, 97)'
  })
}


