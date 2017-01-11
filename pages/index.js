import React from 'react'
import { style } from 'glamor'
import * as  _ from 'lodash'
import Head from 'next/head'
import axios from 'axios';


export default class extends React.Component {
  static async getInitialProps () {
    let users = await axios.get('http://localhost:4567/users');
    let lists = await axios.get('http://localhost:4567/lists');
    return { users: users.data, lists: lists.data }
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
          <div className="w-50 fl">
            <h2 {...styles.title} className="f4 lh-title ttu">Lists</h2>
            <div {...styles.chart}>
            {this.props.lists.map((list, i) => {
              return (
                  <p className="f5 lh-copy">{list.title} - {list._user.username}</p>
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