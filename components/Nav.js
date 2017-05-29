import React, { PropTypes } from 'react'
import Link from 'next/link'

import UserNav from './UserNav'

class Nav extends React.Component {
  constructor(props) {
    super(props)
    this.state = { user: null }
  }

  render() {
    return(
        <div className="cf mv4">
          <div className="w-80 fl">
            <Link href="/"><h3 className="f6 measure-wide fl mr2 pointer dim">Home</h3></Link>
            <Link href="/spotify"><h3 className="f6 measure-wide fl mr2 pointer dim">Spotify</h3></Link>
          </div>
          <div className="w-20 fl">
            <UserNav userToken={ this.props.userToken } />
          </div>
        </div>
      )
  }
}

export default Nav
