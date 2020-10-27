import apiHandler from '../../../../lib/api_handler'
import jwt from 'next-auth/jwt'

const db = require('../../../../lib/db').instance
const secret = process.env.SECRET

export default async (req, res) => {
  const token = await jwt.getToken({ req, secret })

  const {
    query: { name },
    method,
  } = req

  apiHandler(res, method, {
    POST: (response) => {
      if (token) {
        db.none(
          'UPDATE links SET visits = visits + 1 WHERE name=$1',
          name
        ).then(
          (link) => {
            response.status(200).json({ status: 'success' })
          },
          (reason) => {
            console.error(reason) // Error!
            response.status(500).end()
          }
        )
      } else {
        response.status(401).json({ status: 401, reason: 'not authorized' })
      }
    },
  })
}
