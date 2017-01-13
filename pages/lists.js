import React from 'react'
import Link from 'next/link'
import { style } from 'glamor'
import * as  _ from 'lodash'
import Head from 'next/head'
import axios from 'axios';


export default class extends React.Component {
  static async getInitialProps (req) {
    console.log(req.query);
    let list = await axios.get('http://localhost:4567/lists/'  + req.query.id  );
    console.log(list.data);
    return { list: list.data }
  }
  render() {
    return (
      <div>
        <Head>
          <title>Mew</title>
          <link rel="stylesheet" href="https://unpkg.com/tachyons/css/tachyons.min.css"/>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <div>
          <div {...styles.inner} className="cf mw7 mt5">
            <Link href="/"><h3 className="f6 measure-wide">Home</h3></Link>
            <h2 {...styles.title} className="f4 lh-title ttu">{this.props.list._user.username} / {this.props.list.title}</h2>
            <div {...styles.chart}>
            {this.props.list.albums.map((album, i) => {
              return (
                  <p className="f5 lh-copy">{album}</p>
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