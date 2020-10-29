import apiHandler from '../../../lib/api_handler'
import jwt from 'next-auth/jwt'

const db = require('../../../lib/db').instance
const secret = process.env.SECRET

export default async (req, res) => {
  const token = await jwt.getToken({ req, secret })

  const {
    query: { name },
    method,
  } = req

  let username = null

  if (token) {
    username = token.username
  }

  let destination = req.body.destination
  if (destination === '') {
    destination = null
  }

  let regex_destination = req.body.regex_destination
  if (regex_destination === '') {
    regex_destination = null
  }

  const body = {
    name: name,
    destination: destination,
    regex_destination: regex_destination,
    owner: username || req.body.owner,
    creator: username || req.body.owner,
  }

  apiHandler(res, method, {
    GET: (response) => {
      db.one('SELECT * FROM links WHERE name=$1', name).then(
        (link) => {
          response.status(200).json(link)
        },
        (reason) => {
          if (reason.received === 0) {
            response
              .status(404)
              .json({ link: name, status: 404, reason: 'not found' })
          } else {
            console.error(e)
            response.status(500).end()
          }
        }
      )
    },
    DELETE: (response) => {
      if (token) {
        db.tx((t) => {
          const ret = db
            .one('SELECT * FROM links WHERE name=$1', name)
            .then((old) => {
              const del = db.none('DELETE FROM links WHERE name = $1', name)
              const log = db.none(
                'INSERT INTO logs(link_id, link_name, user_id, action, old_destination_value, old_regex_value, old_owner) VALUES($1, $2, $3, $4, $5, $6, $7)',
                [
                  old.id,
                  name,
                  token.username,
                  'DELETE',
                  old.destination,
                  old.regex_destination,
                  old.owner,
                ]
              )
              return t.batch([old, del, log])
            })
          return ret
        }).then(
          () => {
            response.status(200).end()
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
    PUT: (response) => {
      const body = {
        name: name,
        destination: destination,
        regex_destination: regex_destination,
        owner: username || req.body.owner,
        creator: username || req.body.owner,
      }
      if (token) {
        db.tx((t) => {
          const ret = db
            .one('SELECT * FROM links WHERE name=$1', name)
            .then((old) => {
              const update = db.one(
                'UPDATE links SET (destination, regex_destination, owner, creator, modified_at) = (${destination}, ${regex_destination}, ${owner}, ${creator}, CURRENT_TIMESTAMP) WHERE name = ${name} RETURNING *',
                body
              )
              const log = db.none(
                'INSERT INTO logs(link_id, link_name, user_id, action, old_destination_value, new_destination_value, old_regex_value, new_regex_value, old_owner, new_owner) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
                [
                  old.id,
                  name,
                  token.username,
                  'UPDATE',
                  old.destination,
                  body.destination,
                  old.regex_destination,
                  body.regex_destination,
                  old.owner,
                  body.owner,
                ]
              )
              return t.batch([old, update, log])
            })
          return ret
        }).then(
          (link) => {
            response.status(200).json(link[1])
          },
          (reason) => {
            if (reason.code === '23505') {
              response.status(409).json({
                status: 409,
                reason: 'link already exists',
                info: reason.detail,
              })
            } else {
              console.error(reason) // Error!
              response.status(500).end()
            }
          }
        )
      } else {
        response.status(401).json({ status: 401, reason: 'not authorized' })
      }
    },
    POST: (response) => {
      if (token) {
        db.tx((t) => {
          const ret = db
            .one(
              'INSERT INTO links(name, destination, regex_destination, owner, creator) VALUES(${name}, ${destination}, ${regex_destination}, ${owner}, ${creator}) RETURNING *',
              body
            )
            .then((create) => {
              const log = db.none(
                'INSERT INTO logs(link_id, link_name, user_id, action, new_destination_value, new_regex_value, new_owner) VALUES($1, $2, $3, $4, $5, $6, $7)',
                [
                  create.id,
                  name,
                  token.username,
                  'CREATE',
                  body.destination,
                  body.regex_destination,
                  body.owner,
                ]
              )
              return t.batch([create, log])
            })
          return ret
        }).then(
          (link) => {
            response.status(201).json(link)
          },
          (reason) => {
            if (reason.code === '23505') {
              response.status(409).json({
                status: 409,
                reason: 'link already exists',
                info: reason.detail,
              })
            } else if (reason.code === '23502') {
              response.status(422).json({
                status: 422,
                reason: 'failed data validation',
                info: reason.detail,
              })
            } else {
              console.error(reason) // Error!
              response.status(500).end()
            }
          }
        )
      } else {
        response.status(401).json({ status: 401, reason: 'not authorized' })
      }
    },
  })
}
