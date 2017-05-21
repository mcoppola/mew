import React from 'react'
import Link from 'next/link'
import { style } from 'glamor'
import axios from 'axios';

import Head from '../components/Head'
import Nav from '../components/Nav'

import { getTokenFromCookie, getTokenFromLocalStorage, setToken } from '../utils/auth'
import { apiRequest, errorMessage } from '../utils/api'


export default class extends React.Component {
  static async getInitialProps (ctx) {
    const userToken = process.browser ? getTokenFromLocalStorage() : getTokenFromCookie(ctx.req)

    return { userToken }
  }

  constructor(props) {
    super(props)
    this.toggleCreateForm = this.toggleCreateForm.bind(this)

    this.state = { showCreateForm: false, err: null }
  }


  toggleCreateForm (e) {
    e.preventDefault()
    this.setState({ showCreateForm: !this.state.showCreateForm })
  }

  render() {
    return (
      <div>
        <Head/>
        <div {...styles.inner} className="cf mw7 mt5">
          <Nav userToken={ this.props.userToken } />
          {!this.state.showCreateForm && <LoginForm />}
          {this.state.showCreateForm && <CreateAccountForm />}
          <div className="f6 mt3 dim pointer" onClick={this.toggleCreateForm}>{this.state.showCreateForm ? 'Back to Login' : 'Create Account' }</div>
        </div>
      </div>
    )
  }
}



class LoginForm extends React.Component {
  constructor(props) {
    super(props)
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this)

    this.state = { err: null, msg: null }
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

  render() {
    return (
      <div>
        <form onSubmit={this.handleLoginSubmit} action="http://localhost:4567/auth/login" method="POST">
          <div className="measure w-40">
            <label for="username" className="f6 b db mb2">Username</label>
            <input className="db input-reset f6 ba b--black-20 pa2 mb2 db w-100" ref="username" type="text"/>
            <label for="username" className="f6 b db mb2">Password</label>
            <input className="db input-reset f6 ba b--black-20 pa2 mb2 db w-100" ref="password" type="password"/>
            <input className="f6 link dim ba ph3 pv2 mt2 mb2 dib near-black pointer" type="submit" value="Login"/>
          </div>
        </form>
        {this.state.err && <div className="f6 mt2">{this.state.err}</div>}
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

    let api = apiRequest()

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
        <h2 className="f6 mt3 mb4">Create Account</h2>
        <form className="w-40" onSubmit={this.handleCreateSubmit} action="http://localhost:4567/auth/login" method="POST">
          <label for="username" className="f6 b db mb2">Email</label>
          <input className="input-reset f6 db ba b--black-20 pa2 mb2 db w-100" type="text" ref="email"/>
          <label for="username" className="f6 b db mb2">Username</label>
          <input className="input-reset f6 db ba b--black-20 pa2 mb2 db w-100" type="text" ref="username"/>
          <label for="username" className="f6 b db mb2">Password</label>
          <input className="input-reset f6 db ba b--black-20 pa2 mb2 db w-100" type="password" ref="password"/>
          <small id="password-desc" class="f6 lh-copy black-60 db mb2">
              Must be 6 characters long and contain a number.
            </small>
          <input className="db f6 link dim ba ph3 pv2 mt2 mb2 near-black pointer" type="submit"/>
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


