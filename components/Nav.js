import React, { PropTypes } from 'react'
import Link from 'next/link'

import UserNav from './UserNav'

const links = [{ label: 'Home', path: '/' },
               { label: 'Spotify', path: '/spotify' }]

class Nav extends React.Component {
  constructor(props) {
    super(props)
    this._onRemoveUser = this._onRemoveUser.bind(this)
    this.state = { user: null }
  }

  linkStyle = l =>  "f6 measure-wide fl mr2 pointer dim color--" + (l.path === this.props.path ? 'purple' : 'gray1')

  _onRemoveUser() {
    this.props.onRemoveUser()
  }

  render() {
    return(
      <div>
        <div className="cf bg--white">
          <div className="w-70 fl">
            <div className="fl f5 mr2" onClick={e => this._onRemoveUser() }>
              <Link href="/"><span className="f4 b lh-nav v-mid color--purple dim pointer">/</span></Link>
            </div>
            
            <h2 className="fl f4 lh-nav v-btm color--purple">
            { this.props.path != "/" 
              ?
              <Link href="/"><span className="dim pointer">#NowPlaying</span></Link> :
              <span className="">#NowPlaying</span>
            }
            { this.props.selectedUser &&  
                <div className="dib tc ml1 lh-nav v-btm dim pointer" onClick={e => this._onRemoveUser() }>
                  <img src={this.props.selectedUser.profileImage}
                      className="br-100 h1 w1 dib" alt=""></img>
                </div>
            }
            </h2>
            
          </div>
          <div className="w-30 fl">
            <UserNav userToken={ this.props.userToken } actions={this.props.actions} />
          </div>
        </div>
        <div className="fl w-100 bb border-color--purple o-70"></div>
      </div>
    )
  }
}

export default Nav
