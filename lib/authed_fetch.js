import jwt from 'next-auth/jwt'

const secret = process.env.SECRET

export default async function authedFetch(ctx, uri, options = {}) {
  const method = options.method || 'GET'
  const jsonData = options.jsonData || null
  const req = ctx.req
  const token = await jwt.getToken({ req, secret, raw: true })
  const bearer = 'Bearer ' + token
  const url = process.env.API_HOST + uri
  const res = await fetch(url, {
    headers: { Authorization: bearer },
    method: method,
    body: jsonData,
  })
  const json = await res.json()

  return { res: res, data: json }
}
