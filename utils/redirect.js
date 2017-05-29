/**
 * Redirect
 */

function redirect (ctx, path) {
  if (path === undefined) {
  	path = ctx, ctx = {}
  } 

  if (ctx.res) {
    ctx.res.writeHead(302, { Location: path })
    ctx.res.end()
  } else {
    document.location.pathname = path
  }
}

module.exports = redirect
