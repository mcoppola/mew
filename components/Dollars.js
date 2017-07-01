import Link from 'next/link'
import axios from 'axios'
import * as R from 'ramda'

import { apiRequest } from '../utils/api'


class Canvas extends React.Component {
  constructor(props) {
    super(props)

    this.fontSize = 14
    this.determinePDI = this.determinePDI.bind(this)
  }

  componentDidMount() {
    let ctx = this.Canvas.getContext('2d')
    this.determinePDI(ctx)
    this.paint(ctx)
  }

  componentDidUpdate() {
    let ctx = this.Canvas.getContext('2d')
    ctx.clearRect(0, 0, this.Canvas.width, this.Canvas.height)
    this.paint(ctx)
  }

  paint(ctx) {
  	if (this.props.dollars) {
	    ctx.save()
	    ctx.translate(0, this.fontSize)
	    ctx.fillStyle = '#38cc80'
	    ctx.font = this.fontSize + "px monospace"
	    ctx.fillText('$'+ this.props.dollars, 0, 0)
	    ctx.restore()
		}
  }

  determinePDI(ctx) {
  	let devicePixelRatio = window.devicePixelRatio || 1,
        backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
                            ctx.mozBackingStorePixelRatio ||
                            ctx.msBackingStorePixelRatio ||
                            ctx.oBackingStorePixelRatio ||
                            ctx.backingStorePixelRatio || 1,

        ratio = devicePixelRatio / backingStoreRatio;

   // upscale the canvas if the two ratios don't match
    if (devicePixelRatio !== backingStoreRatio) {

        var oldWidth = this.Canvas.width;
        var oldHeight = this.Canvas.height;

        this.Canvas.width = oldWidth * ratio;
        this.Canvas.height = oldHeight * ratio;

        this.Canvas.style.width = oldWidth + 'px';
        this.Canvas.style.height = oldHeight + 'px';

        // now scale the context to counter
        // the fact that we've manually scaled
        // our canvas element
        ctx.scale(ratio, ratio);
    }
  }

  render() {
  	return <canvas ref={ instance => this.Canvas = instance } width={100} height={this.fontSize} />
  }
}

class Dollars extends React.Component {
  constructor(props) {
  	super(props)

  	this.duration    = 1000 // in ms
    this.fps         = 30 // frames per second
    this.step  			 = 1 / ((this.duration / 1000) * this.fps)
    this.idx         = 1
    this.digits      = 5

  	this.state = { dollars: null, request: 0 }
  	this.timeouts = []
    this.tick = this.tick.bind(this)
    this.clearTimeouts = this.clearTimeouts.bind(this)
    this.clearTimeouts()
  }

  componentDidMount() {
    this.clearTimeouts()
    this.tick()
  }

  componentDidUpdate(prevProps, prevState) {
    this.clearTimeouts()
  	this.tick()
  }

  componentWillUnmount() {
  	this.clearTimeouts()
    window.cancelAnimationFrame(this.state.request)
  }

  clearTimeouts() {
    this.timeouts.forEach(clearTimeout)
  }

  tick() {
  	this.timeouts.push(setTimeout(() => {
	    this.setState({ 
	    	dollars: this.calc(this.props.data), 
	    	request: window.requestAnimationFrame(this.tick)
	    })
   	}, 1000 / this.fps))
  }

  calc(data) {
  	if (!data || !data.fn) return
  	let earned = new Date().getTime() - data.fn.startDate
		let spent = this.props.actions ? R.sum(this.props.actions.map(R.prop('value'))) : 0
		let dollars = data.fn.startAmount + ((earned - data.fn.spent) / data.fn.growRate) - spent
		return this.round(dollars)
  }

  round(n) {
  	let val = Math.round(n * Math.pow(10, this.digits)) / Math.pow(10, this.digits)
  	// add any missing 0s to keep length consistent
  	if (val.toString().split('.').pop().length < this.digits) {
  		val += ('0').repeat(this.digits - val.toString().split('.').pop().length)
  	}
  	return val
  }

  render() {
    return <div><Canvas dollars={this.state.dollars} /></div>
  }
}


export default Dollars