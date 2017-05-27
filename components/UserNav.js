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
          <Link href="/logout"><p className="f6 measure-wide lh-solid v-top fl mr1 pointer dim b">Logout</p></Link> 
	  			<p className="dib f6 lh-solid v-top" style={{ color: '#948bff' }}>{this.state.user && this.state.user.username}</p>
  			</div>
  		) : (
  			<Link href="/login"><p className="f6 measure-wide fl mr1 pointer dim b">Login</p></Link>
  		)
  }
}


export default UserNav