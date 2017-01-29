import React, { PropTypes } from 'react'
import Link from 'next/link'
import css from 'next/css'

import UserHead from './UserHead'

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = { user: null }
  }

  render() {
    return(
        <div className="cf mv4">
          <div className="w-75 fl">
            <Link href="/"><h3 className="f6 measure-wide fl mr2">Home</h3></Link>
          </div>
          <div className="w-25 fl">
            <UserHead userToken={ this.props.userToken } />
          </div>
        </div>
      )
  }
}

// const getAllowedLinks = isAuthenticated => links.filter(l => !l.authRequired || (l.authRequired && isAuthenticated))
//                                                 .filter(l => !isAuthenticated || (isAuthenticated && !l.anonymousOnly))

// //           <div className="cf mv4">
// //             <Link href="/"><h3 className="f6 measure-wide fl mr2">Home</h3></Link>
// //             <Link href="/login"><h3 className="f6 measure-wide fl mr1">Login</h3></Link>
// //           </div>

// const Header = ({ isAuthenticated, currentUrl }) => (
//   <div className="cf mv4">
//     {getAllowedLinks(isAuthenticated).map(l => (
//       <Link key={l.href} href={l.href}>
//         <a className={styles.link(currentUrl === l.href)}>
//           {l.text}
//         </a>
//       </Link>
//     ))}
//   </div>
// )



// Header.propTypes = {
//   isAuthenticated: PropTypes.bool.isRequired,
//   currentUrl: PropTypes.string.isRequired
// }

export default Header
