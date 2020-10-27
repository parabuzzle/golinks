const pgp = require('pg-promise')()

// Get the values for these variables from configuration
const user = process.env.DATABASE_USER
const password = process.env.DATABASE_PASSWORD
const host = process.env.DATABASE_HOST
const port = process.env.DATABASE_PORT
const database = process.env.DATABASE_DB

const DB_KEY = Symbol.for('golinks.db')
const globalSymbols = Object.getOwnPropertySymbols(global)
const hasDb = globalSymbols.indexOf(DB_KEY) > -1

if (!hasDb) {
  global[DB_KEY] = pgp(
    `postgres://${user}:${password}@${host}:${port}/${database}`
  )
}

// Create and freeze the singleton object so that it has an instance property.
const singleton = {}
Object.defineProperty(singleton, 'instance', {
  get: function () {
    return global[DB_KEY]
  },
})
Object.freeze(singleton)

module.exports = singleton
