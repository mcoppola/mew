import React from 'react'
import Link from 'next/link'
import { style } from 'glamor'
import * as  _ from 'lodash'
import Head from 'next/head'
import axios from 'axios';


export default class extends React.Component {
  static async getInitialProps () {
    return {}
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

         <h2 className="f6 mt5">Login</h2>
         <form action="http://localhost:4567/auth/login" method="POST">
           <input type="text" name="username" placeholder="username"/>
           <input type="password" name="password" placeholder="password"/>
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