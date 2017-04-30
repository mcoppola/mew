import React, { PropTypes } from 'react'
import Link from 'next/link'
import { style } from 'glamor'
import * as  _ from 'lodash'

import Head from 'next/head'
import Header from '../components/Header'

import { getTokenFromCookie, getTokenFromLocalStorage, getToken } from '../utils/auth'
import { apiRequest } from '../utils/api'



export default class extends React.Component {
  static async getInitialProps (ctx) {
    // Auth
    const userToken = process.browser ? getTokenFromLocalStorage() : getTokenFromCookie(ctx.req)

    return { userToken }
  }

  render() {
    return (
      <div>
        <Head>
          <title>Mew</title>
          <link rel="stylesheet" href="/static/tachyons.min.css"/>
        </Head>
        <div className="h-100">
          <div {...styles.inner} className="cf mw7 mt5">
            <Header userToken={ this.props.userToken } />
            <div className="w-50 fl">
              <h2 {...styles.title} className="f4 lh-title ttu purple">Lists</h2>
              <div {...styles.chart}>
                { <Lists userToken={ this.props.userToken } /> }
                <Link href="/create/list" ><div className="f6 link dim ba ph3 pv2 mt2 mb2 dib near-black">+ add list</div></Link>
              </div>
            </div>
            <div className="w-50 fl">
              <h2 {...styles.title} className="f4 lh-title ttu">users</h2>
              <div {...styles.chart}>
              <Users />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// All Lists

class Lists extends React.Component {
  constructor(props) {
    super(props)
    this.state = { err: 'loading lists...', lists: [] }
  }

  async componentDidMount() {
    let api = apiRequest(this.props.userToken)
    let lists = await api.get('/lists?limit=10')
    this.setState({ lists: lists.data, err: null })
  }

  render () {
    return (
      <div>
        {this.state.err && <p>{this.state.err}</p>}
        {this.state.lists.map( l => 
            <Link href={"/lists?id=" + l._id} as={l._user.username + "/" + l.title}><div className="f5 measure lh-copy mv2">{l.title} - {l._user.username}</div></Link>
        )}
      </div>
    )
  }
}

// Users list

class Users extends React.Component {
  constructor(props) {
    super(props)
    this.state = { err: 'loading users...', users: [] }
  }

  async componentDidMount() {
    let api = apiRequest(this.props.userToken)
    let users = await api.get('/users')
    this.setState({ users: users.data, err: null })
  }

  render(){
    return (
      <div>
        {this.state.err && <p>{this.state.err}</p>}
        {this.state.users.map( u => {
          return (
              <p className="f5 lh-copy">{u.username}</p>
            )
        })}
      </div>
    )
  }
}



const styles = {
  'inner': style({
    margin: '0 auto',
    color: 'rgb(97, 97, 97)'
  }),
  'user': style({
    color: '#948bff'
  }),
  'add': style({
    color: '#137b23',
    cursor: 'pointer'
  })
}


// import defaultPage from '../views/defaultPage'

// const SuperSecretDiv = () => (
//   <div className={styles.secretDiv}>
//     This is a super secret div.
//   </div>
// )


// const Index = ({ isAuthenticated }) => (
//   <div>
//     {isAuthenticated && <SuperSecretDiv />}
//     <div {...styles.inner} className="cf mw7 mt5">
//       <div className="cf mv4">
//         <Link href="/"><h3 className="f6 measure-wide fl mr2">Home</h3></Link>
//         <Link href="/login"><h3 className="f6 measure-wide fl mr1">Login</h3></Link>
//       </div>
//       <div className="w-50 fl">
//         <h2 {...styles.title} className="f4 lh-title ttu">Lists</h2>
//         <div {...styles.chart}>
//         {this.props.lists.map((list, i) => {
//           return (
//               <Link href={"/lists?id=" + list._id} as={list._user.username + "/" + list.title}><p className="f5 lh-copy">{list.title} - {list._user.username}</p></Link>
//             );
//         })}
//         </div>
//       </div>
//       <div className="w-50 fl">
//         <h2 {...styles.title} className="f4 lh-title ttu">users</h2>
//         <div {...styles.chart}>
//         {...this.props.users.map((user, i) => {
//           return (
//               <p className="f5 lh-copy">{user.username}</p>
//             );
//         })}
//         </div>
//       </div>
//     </div>
//     <div className={styles.main}>
//       <h1 className={styles.heading}>Hello, friend!</h1>
//       <p className={styles.content}>
//         This is a super simple example of how to use {createLink('https://github.com/zeit/next.js', 'next.js')} and {createLink('https://auth0.com/', 'Auth0')} together.
//       </p>
//       {!isAuthenticated && (
//         <p className={styles}>
//           You're not authenticated yet. Maybe you want to <Link href='/auth/sign-in'>{createLink('/auth/sign-in', 'sign in')}</Link> and see what happens?
//         </p>
//       )}
//       {isAuthenticated && (
//         <p className={styles.content}>
//           Now that you're authenticated, maybe you should try going to our <Link href='/secret'>{createLink('/secret', 'super secret page')}</Link>!
//         </p>
//       )}
//     </div>
//   </div>
// )


// //     let users = await axios.get('http://localhost:4567/users');
// //     let lists = await axios.get('http://localhost:4567/lists');
// //     return { users: users.data, lists: lists.data }
// //   }
// // Index.getInitialProps = async (req) => {
// //   let users = await axios.get('http://localhost:4567/users');
// //   let lists = await axios.get('http://localhost:4567/lists');
// //   return { users: users.data, lists: lists.data }
// // }

// // console.log(Index);

// Index.propTypes = {
//   isAuthenticated: PropTypes.bool.isRequired
// }

// export default defaultPage(Index)