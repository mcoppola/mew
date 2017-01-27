import React from 'react'
import Head from 'next/head'
import axios from 'axios';


import { unsetToken } from '../utils/auth'

export default class extends React.Component {
  static async getInitialProps (ctx) {

    unsetToken()

    ctx.res.writeHead(302, { Location: '/' })
    res.end()
  }
}