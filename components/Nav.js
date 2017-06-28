import React, { PropTypes } from 'react'
import Link from 'next/link'

import UserNav from './UserNav'

const links = [{ label: 'Home', path: '/' },
               { label: 'Spotify', path: '/spotify' }]

class Nav extends React.Component {
  constructor(props) {
    super(props)
    this.state = { user: null }
  }

  linkStyle = l =>  "f6 measure-wide fl mr2 pointer dim color--" + (l.path === this.props.path ? 'purple' : 'gray1')


  render() {
    return(
        <div className="cf mv4">
          <div className="w-70 fl">
            { links.map( l => 
                <Link href={l.path} key={l.label + l.path}><h3 className={this.linkStyle(l)} >{l.label}</h3></Link>
            )}
          </div>
          <div className="w-30 fl">
            <UserNav userToken={ this.props.userToken } spentDollars={this.props.spentDollars} />
          </div>
        </div>
      )
  }
}

export default Nav
