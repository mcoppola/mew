import Link from 'next/link'
import axios from 'axios'

import { apiRequest } from '../utils/api'


class UserNav extends React.Component {
  constructor(props) {
    super(props)
    this.state = { user: null, points: null }
  }

  componentDidMount() {
    let api = apiRequest(this.props.userToken);

    if (this.props.userToken) {
      api.get('/users/me')
        .then(res => { 
          this.setState({ user: res.data })
        })
        .catch(e => console.log(e))

      api.get('/users/points')
        .then(res => {
          this.setState({ points: res.data })
        })
        .catch(console.log)
    }
  }

  render() {
  	let user = this.props.userToken;

  	return user ? 
  		(
  			<div>
	  			<Link href="/user">
            <div>
              { this.state.user &&
                <div className="fl">
                  <div className="fl tc mr1">
                    <img src={this.state.user.profileImage}
                        className="br-100 h1 w1 dib" alt=""></img>
                  </div>
                  <p className="fl f6 lh-solid v-top b mr1 pointer dim color--purple-light">{this.state.user.username}</p>
                </div>
              }
              <p className="fl f6 lh-solid v-top">{ this.state.points && this.state.points.sum }</p>
            </div>
          </Link>
  			</div>
  		) : (
  			<Link href="/login"><p className="f6 measure-wide fl mr1 pointer dim b">Login</p></Link>
  		)
  }
}


export default UserNav