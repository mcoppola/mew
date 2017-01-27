import React, { PropTypes } from 'react'
import Link from 'next/link'
import { style } from 'glamor'
import * as  _ from 'lodash'
import Head from 'next/head'
import axios from 'axios';

import { getTokenFromCookie, getTokenFromLocalStorage, getToken } from '../utils/auth'

export default class extends React.Component {
  static async getInitialProps (ctx) {

    // Auth
    const loggedUser = process.browser ? getTokenFromLocalStorage() : getTokenFromCookie(ctx.req)
    const api = axios.create({
        baseURL: 'http://localhost:4567/',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': loggedUser ||  null
        }
      });

    let me;
    if (loggedUser) {
      api.get('/users/me')
        .then(res => { me = res.data })
        .catch(e => console.log(e))
    }

    // Get data
    let users = await api.get('/users')
    let lists = await api.get('/lists')

    return { 
      loggedUser,
      currentUrl: ctx.pathname,
      isAuthenticated: !!loggedUser,
      users: users.data,
      lists: lists.data,
      me: me
    }
  }

  // static async getInitialState() {

  //   return { items: 'foo' };
  // }

  render() {
    let user = this.props.isAuthenticated;

    return (
      <div>
        <Head>
          <title>Mew</title>
          <link rel="stylesheet" href="https://unpkg.com/tachyons/css/tachyons.min.css"/>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <div {...styles.inner} className="cf mw7 mt5">
          <div className="cf mv4">
            <div className="w-50 fl">
              <Link href="/"><h3 className="f6 measure-wide fl mr2">Home</h3></Link>
              { user ? 
                  <Link href="/logout"><h3 className="f6 measure-wide fl mr1">Logout</h3></Link> :
                  <Link href="/login"><h3 className="f6 measure-wide fl mr1">Login</h3></Link>
                }
            </div>
            <div className="w-50 fl">
              {user && <SuperSecretDiv />}
              <h6 className="dib f6">{this.props.me && this.props.me.username + ' ' + this.state.items}</h6>
            </div>
          </div>
          <div className="w-50 fl">
            <h2 {...styles.title} className="f4 lh-title ttu">Lists</h2>
            <div {...styles.chart}>
            {this.props.lists.map((list, i) => {
              return (
                  <Link href={"/lists?id=" + list._id} as={list._user.username + "/" + list.title}><p className="f5 lh-copy">{list.title} - {list._user.username}</p></Link>
                );
            })}
            </div>
          </div>
          <div className="w-50 fl">
            <h2 {...styles.title} className="f4 lh-title ttu">users</h2>
            <div {...styles.chart}>
            {this.props.users.map((user, i) => {
              return (
                  <p className="f5 lh-copy">{user.username}</p>
                );
            })}
            </div>
          </div>
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

const SuperSecretDiv = () => (
  <div>
    USER LOGGED IN
  </div>
)



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