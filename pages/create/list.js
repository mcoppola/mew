import React from 'react'
import Link from 'next/link'
import { style } from 'glamor'
import * as  _ from 'lodash'
import Head from 'next/head'
import axios from 'axios';


import { getTokenFromCookie, getTokenFromLocalStorage, setToken } from '../../utils/auth'
import { connection } from '../../utils/api'

class CreateListForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { list: [], title: '', saved: false }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.saveList = this.saveList.bind(this);
  }


  handleSubmit(e) {
    e.preventDefault()

    this.setState({
      list: this.state.list.concat(this.refs.newListItem.value),
      title: this.refs.title.value,
      saved: false
    })

    this.refs.newListItem.value = '';
  }

  async saveList(e) {
    let api = connection(this.props.userToken)
    let id;

    await api.get('/users/me')
          .then(res =>  id = res.data.id)
          .catch(err => console.log(err))

    await api.post('/lists', { 
            _user: id,
            title: this.state.title,
            albums: this.state.list
          })
          .then(res => { 
            this.setState({ saved: true }) 
          })
          .catch(err => console.log(err))
  }
  

  render() {

    let listItems = this.state.list.map(item => <div className="f6">{item}</div>)

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div className="cf">
            <input className="f5 mv2" type="text" ref="title" placeholder="List Title"/>
          </div> 
          <div className="cf">
            {listItems}
          </div>
           <input className="f6" type="text" ref="newListItem" placeholder="Artist - Album"/>
           <input type="submit"/>
         </form>

         <div {...styles.add} onClick={this.saveList}>{ this.state.saved ? 'list saved' : 'Save'}</div>
      </div>
     )
  }
}


export default class extends React.Component {
  static async getInitialProps (ctx) {
    const userToken = process.browser ? getTokenFromLocalStorage() : getTokenFromCookie(ctx.req)

    return { userToken: userToken }
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

          <div className="cf mt3">
            <h6>New List</h6>
            <CreateListForm userToken={this.props.userToken} />
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
  }),
  'add': style({
    color: '#137b23',
    cursor: 'pointer'
  })
}