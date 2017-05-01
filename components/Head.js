import React, { PropTypes } from 'react'
import Head from 'next/head'


class HtmlHead extends React.Component {
  constructor(props) {
    super(props)
    this.state = { title: this.props.title || 'Mew' }
  }

  render() {
    return(
        <Head>
          <title>{ this.state.title }</title>
          <link rel="stylesheet" href="/static/tachyons.min.css"/>
        </Head>
      )
  }
}

export default HtmlHead
