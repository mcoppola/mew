import Link from 'next/link'
import axios from 'axios'

import Dollars from './Dollars'
import { apiRequest } from '../utils/api'
import * as R from 'ramda'


class UserNav extends React.Component {
  constructor(props) {
    super(props)
    this.state = { user: null, points: null, dollars: null }
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
        .catch(e => console.log(e))

      api.get('/users/dollars')
        .then(res => {
          this.setState({ dollars: res.data })
        })
        .catch(e => console.log(e))
    }
  }

  render() {
  	let user = this.props.userToken;

  	return user ? 
  		(
  			<div>
          <div>
            { this.state.user &&
              <div className="fl mr2">
                <div className="fl tc mr1 lh-nav pt1">
                  <img src={this.state.user.profileImage}
                      className="br-100 h1 w1 dib" alt=""></img>
                </div>
                <Link href="/user"><p className="fl f6 lh-nav v-top b pointer dim color--purple-light">{this.state.user.username}</p></Link>
              </div>
            }
            <p className="fl f6 lh-nav v-top mr2 mw--mono">
              <span className="color--purple">&bull;</span>
              { this.state.points && 
                this.state.points.sum + (this.props.actions ? R.sum(this.props.actions.map(R.prop('value'))) : 0) }
            </p>
            <div className="fl f6 lh-nav v-top mw--mono">
              <Dollars data={ this.state.dollars } actions={ this.props.actions } />
            </div>
          </div>
  			</div>
  		) : (
  			<Link href="/login"><p className="f6 lh-nav measure-wide fl mr1 pointer dim b">Login</p></Link>
  		)
  }
}


export default UserNav