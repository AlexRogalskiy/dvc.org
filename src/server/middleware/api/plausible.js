const { isProduction } = require('../../utils')

require('isomorphic-fetch')
const ScriptName = '/js/script.js'
const Endpoint = '/pl/event'

const ScriptWithoutExtension = ScriptName.replace('.js', '')

async function handlePlausibleRequest(req, res) {
  try {
    const pathname = req.path
    const [baseUri, ...extensions] = pathname.split('.')

    if (baseUri.endsWith(ScriptWithoutExtension)) {
      const response = await fetch(
        'https://plausible.io/js/plausible.' + extensions.join('.')
      )
      res.set({
        'content-type': response.headers.get('content-type')
      })
      return response.body.pipe(res)
    } else if (pathname.endsWith(Endpoint)) {
      const response = await fetch('https://plausible.io/api/event', {
        method: req.method,
        body: JSON.stringify(req.body),
        headers: {
          'content-type': 'application/json'
        }
      })
      res.set({
        'content-type': response.headers.get('content-type')
      })
      return response.body.pipe(res)
    }
    res.status(404).end()
  } catch (error) {
    if (!isProduction) console.error(error)
    res.status(500).end()
  }
}

module.exports = {
  handlePlausibleRequest
}
