import Link from 'next/link'
import axios from 'axios'

import { apiRequest } from '../utils/api'


class UserNav extends React.Component {
  constructor(props) {
    super(props)
    this.state = { user: null }
  }

  componentDidMount() {
    let api = apiRequest(this.props.userToken);

    if (this.props.userToken) {
      api.get('/users/me')
        .then(res => { 
          this.setState({ user: res.data })
        })
        .catch(e => console.log(e))
    }
  }

  render() {
  	let user = this.props.userToken;

  	return user ? 
  		(
  			<div>
          <Link href="/logout"><h3 className="f6 f7 measure-wide fl mr1">Logout</h3></Link> 
	  			<p className="dib f6" style={{ color: '#948bff' }}>{this.state.user && this.state.user.username}</p>
  			</div>
  		) : (
  			<Link href="/login"><h3 className="f6 measure-wide fl mr1">Login</h3></Link>
  		)
  }
}


export default UserNav